import { normalizeFieldName } from "@/data/fields";
import type { RawExcelRow } from "@/types/harvest";

const COLUMNS = {
  harvestId: "収穫ID",
  date: "日付",
  cropName: "作付名",
  fieldId: "圃場ID",
  fieldName: "圃場名",
  areaAre: "作付面積（アール）",
  timing: "計測タイミング",
  harvestKg: "入力（kg）",
  lotNo: "収穫ロット番号",
  memo: "メモ",
} as const;

export const getColumn = COLUMNS;

export const normalizeExcelDate = (value: unknown): string | null => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const asDate = new Date(epoch.getTime() + value * 86400000);
    return asDate.toISOString().slice(0, 10);
  }
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
};

export const toNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const normalized = String(value)
    .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
    .replace(/,/g, "")
    .trim();
  if (normalized === "") return null;
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
};

export const validateRawRow = (
  row: RawExcelRow,
  dedupeSet: Set<string>,
): {
  errors: string[];
  normalized: {
    date: string | null;
    fieldName: ReturnType<typeof normalizeFieldName>;
    areaAre: number | null;
    harvestKg: number | null;
    timing: string;
  };
} => {
  const errors: string[] = [];
  const date = normalizeExcelDate(row[COLUMNS.date]);
  const fieldRaw = String(row[COLUMNS.fieldName] ?? "").trim();
  const fieldName = normalizeFieldName(fieldRaw);
  const areaAre = toNumber(row[COLUMNS.areaAre]);
  const harvestKg = toNumber(row[COLUMNS.harvestKg]);
  const timing = String(row[COLUMNS.timing] ?? "").trim();

  if (!date) errors.push("日付が不正または空欄です");
  if (!fieldRaw) errors.push("圃場名が空欄です");
  if (fieldRaw && !fieldName) errors.push("圃場名が8工区マスタに存在しません");
  if (harvestKg === null) errors.push("収穫量(入力kg)が数値ではありません");
  if (areaAre === null) errors.push("作付面積(アール)が空欄または数値ではありません");
  if (!timing) errors.push("計測タイミングが空欄です");

  const dedupeKey = [
    row[COLUMNS.harvestId] ?? "",
    date ?? "",
    fieldName ?? "",
    harvestKg ?? "",
    timing,
  ].join("|");

  if (dedupeSet.has(dedupeKey)) {
    errors.push("同一記録が重複しています");
  } else {
    dedupeSet.add(dedupeKey);
  }

  return {
    errors,
    normalized: { date, fieldName, areaAre, harvestKg, timing },
  };
};
