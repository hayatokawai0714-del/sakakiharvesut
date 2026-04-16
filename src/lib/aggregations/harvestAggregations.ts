import { FIELD_MASTER } from "@/data/fields";
import type {
  DashboardFilter,
  FieldSummary,
  HarvestRecord,
  KpiData,
  FieldName,
} from "@/types/harvest";

export const getAvailableYears = (rows: HarvestRecord[]): number[] =>
  [...new Set(rows.map((r) => r.year))].sort((a, b) => b - a);

export const filterRows = (rows: HarvestRecord[], filter: DashboardFilter): HarvestRecord[] =>
  rows.filter((row) => {
    if (filter.year !== "all" && row.year !== filter.year) return false;
    if (filter.month !== "all" && row.month !== filter.month) return false;
    if (filter.field !== "all" && row.fieldName !== filter.field) return false;
    return true;
  });

const sumKg = (rows: HarvestRecord[]): number => rows.reduce((sum, row) => sum + row.harvestKg, 0);

const uniqueDays = (rows: HarvestRecord[]): number => new Set(rows.map((r) => r.date)).size;

export const getKpiData = (allRows: HarvestRecord[], filter: DashboardFilter): KpiData => {
  const annualRows = filter.year === "all" ? allRows : allRows.filter((r) => r.year === filter.year);
  const selectedRows = filterRows(allRows, filter);

  const annualTotalKg = sumKg(annualRows);
  const selectedTotalKg = sumKg(selectedRows);
  const annualHarvestDays = uniqueDays(annualRows);

  const byField = new Map<string, number>();
  selectedRows.forEach((row) => {
    byField.set(row.fieldName, (byField.get(row.fieldName) ?? 0) + row.harvestKg);
  });
  const topField = [...byField.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

  let monthOverMonth: number | null = null;
  if (filter.month !== "all" && filter.year !== "all") {
    const currentMonthRows = annualRows.filter((r) => r.month === filter.month);
    const prevMonth = filter.month === 1 ? 12 : filter.month - 1;
    const prevMonthRows = annualRows.filter((r) => r.month === prevMonth);
    const prev = sumKg(prevMonthRows);
    monthOverMonth = prev > 0 ? sumKg(currentMonthRows) / prev : null;
  }

  const areaSum = selectedRows.reduce((sum, row) => sum + row.areaAre, 0);
  const kgPerArea = areaSum > 0 ? selectedTotalKg / areaSum : 0;

  return {
    annualTotalKg,
    selectedTotalKg,
    annualHarvestDays,
    topField,
    monthOverMonth,
    kgPerArea,
  };
};

export const getDailySeries = (rows: HarvestRecord[]) => {
  const map = new Map<string, number>();
  rows.forEach((row) => map.set(row.date, (map.get(row.date) ?? 0) + row.harvestKg));
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, harvestKg]) => ({ date, harvestKg }));
};

export const getMonthlySeries = (rows: HarvestRecord[], year: number | "all") => {
  const base = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, harvestKg: 0 }));
  rows
    .filter((r) => (year === "all" ? true : r.year === year))
    .forEach((row) => {
    base[row.month - 1].harvestKg += row.harvestKg;
  });
  return base;
};

export const getYearlySeries = (rows: HarvestRecord[]) => {
  const map = new Map<number, number>();
  rows.forEach((row) => {
    map.set(row.year, (map.get(row.year) ?? 0) + row.harvestKg);
  });
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, harvestKg]) => ({ year, harvestKg }));
};

export const getFieldSeries = (rows: HarvestRecord[]) => {
  const map = new Map<FieldName, number>();
  FIELD_MASTER.forEach((name) => map.set(name, 0));
  rows.forEach((row) => map.set(row.fieldName, (map.get(row.fieldName) ?? 0) + row.harvestKg));
  return FIELD_MASTER.map((fieldName) => ({ fieldName, harvestKg: map.get(fieldName) ?? 0 }));
};

export const getFieldSummary = (rows: HarvestRecord[]): FieldSummary[] => {
  const total = sumKg(rows);
  return FIELD_MASTER.map((fieldName) => {
    const fieldRows = rows.filter((r) => r.fieldName === fieldName);
    const totalKg = sumKg(fieldRows);
    const areaAre = fieldRows.length > 0 ? fieldRows[fieldRows.length - 1].areaAre : 0;
    const kgPerAre = areaAre > 0 ? totalKg / areaAre : 0;
    const harvestDays = uniqueDays(fieldRows);
    return {
      fieldName,
      areaAre,
      totalKg,
      kgPerAre,
      harvestDays,
      share: total > 0 ? (totalKg / total) * 100 : 0,
    };
  });
};
