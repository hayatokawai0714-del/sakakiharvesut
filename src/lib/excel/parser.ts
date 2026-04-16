import * as XLSX from "xlsx";
import type { HarvestRecord, ImportResult, RawExcelRow } from "@/types/harvest";
import { getColumn, validateRawRow } from "@/lib/validators/harvestValidator";

export const parseExcelFile = async (file: File): Promise<ImportResult> => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<RawExcelRow>(sheet, {
    raw: true,
    defval: "",
  });

  const validRows: HarvestRecord[] = [];
  const errorRows: ImportResult["errorRows"] = [];
  const dedupeSet = new Set<string>();
  const col = getColumn;

  rows.forEach((row, idx) => {
    const checked = validateRawRow(row, dedupeSet);
    if (checked.errors.length > 0 || !checked.normalized.date || !checked.normalized.fieldName) {
      errorRows.push({
        rowNumber: idx + 2,
        reasons: checked.errors,
        raw: row,
      });
      return;
    }

    const dateObj = new Date(checked.normalized.date);
    validRows.push({
      harvestId: String(row[col.harvestId] ?? ""),
      date: checked.normalized.date,
      year: dateObj.getUTCFullYear(),
      month: dateObj.getUTCMonth() + 1,
      cropName: String(row[col.cropName] ?? ""),
      fieldId: String(row[col.fieldId] ?? ""),
      fieldName: checked.normalized.fieldName,
      areaAre: checked.normalized.areaAre ?? 0,
      timing: checked.normalized.timing,
      harvestKg: checked.normalized.harvestKg ?? 0,
      lotNo: String(row[col.lotNo] ?? ""),
      memo: String(row[col.memo] ?? ""),
    });
  });

  return { validRows, errorRows };
};
