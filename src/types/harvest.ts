export const FIELD_ORDER = [
  "1工区",
  "2工区",
  "3工区道上",
  "3工区道下",
  "4工区",
  "5工区",
  "6工区",
  "7工区",
] as const;

export type FieldName = (typeof FIELD_ORDER)[number];

export type RawExcelRow = Record<string, unknown>;

export type HarvestRecord = {
  harvestId: string;
  date: string;
  year: number;
  month: number;
  cropName: string;
  fieldId: string;
  fieldName: FieldName;
  areaAre: number;
  timing: string;
  harvestKg: number;
  lotNo: string;
  memo: string;
};

export type ValidationError = {
  rowNumber: number;
  reasons: string[];
  raw: RawExcelRow;
};

export type ImportResult = {
  validRows: HarvestRecord[];
  errorRows: ValidationError[];
};

export type DashboardFilter = {
  year: number | "all";
  month: number | "all";
  field: FieldName | "all";
};

export type FieldSummary = {
  fieldName: FieldName;
  areaAre: number;
  totalKg: number;
  kgPerAre: number;
  harvestDays: number;
  share: number;
};

export type KpiData = {
  annualTotalKg: number;
  selectedTotalKg: number;
  annualHarvestDays: number;
  topField: string;
  monthOverMonth: number | null;
  kgPerArea: number;
};
