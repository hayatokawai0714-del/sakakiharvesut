import { FIELD_ORDER, type FieldName } from "@/types/harvest";

export const FIELD_MASTER = [...FIELD_ORDER];

export const FIELD_COLOR_MAP: Record<FieldName, string> = {
  "1工区": "#2563eb",
  "2工区": "#16a34a",
  "3工区道上": "#d97706",
  "3工区道下": "#dc2626",
  "4工区": "#0d9488",
  "5工区": "#7c3aed",
  "6工区": "#475569",
  "7工区": "#db2777",
};

export const normalizeFieldName = (raw: string): FieldName | null => {
  const normalized = raw
    .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
    .replace(/　/g, " ")
    .trim()
    .replace(/\s+/g, "");

  const aliasMap: Record<string, FieldName> = {
    "1工区": "1工区",
    "2工区": "2工区",
    "3工区道上": "3工区道上",
    "3工区上": "3工区道上",
    "3工区道下": "3工区道下",
    "3工区下": "3工区道下",
    "4工区": "4工区",
    "5工区": "5工区",
    "6工区": "6工区",
    "7工区": "7工区",
  };

  return aliasMap[normalized] ?? null;
};
