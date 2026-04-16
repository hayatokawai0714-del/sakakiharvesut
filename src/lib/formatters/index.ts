export const formatKg = (value: number): string =>
  `${new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 }).format(value)} kg`;

export const formatPercent = (value: number): string =>
  `${new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 }).format(value)}%`;

export const formatRatio = (value: number | null): string => {
  if (value === null || !Number.isFinite(value)) return "-";
  return `${value.toFixed(2)} 倍`;
};

export const formatDateLabel = (isoDate: string): string =>
  new Intl.DateTimeFormat("ja-JP", { month: "2-digit", day: "2-digit" }).format(
    new Date(isoDate),
  );
