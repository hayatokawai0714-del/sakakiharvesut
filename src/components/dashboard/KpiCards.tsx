import { formatKg, formatRatio } from "@/lib/formatters";
import type { KpiData } from "@/types/harvest";

type Props = {
  kpi: KpiData;
};

export function KpiCards({ kpi }: Props) {
  const cards = [
    { label: "年間総収穫量", value: formatKg(kpi.annualTotalKg) },
    { label: "選択期間収穫量", value: formatKg(kpi.selectedTotalKg) },
    { label: "年間収穫日数", value: `${kpi.annualHarvestDays} 日` },
    { label: "最多収穫圃場", value: kpi.topField },
    { label: "前月比", value: formatRatio(kpi.monthOverMonth) },
    { label: "面積あたり収穫量", value: `${kpi.kgPerArea.toFixed(2)} kg/a` },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-[#cfe1d7] bg-white p-4 shadow-[0_6px_18px_rgba(22,103,58,0.06)]"
        >
          <p className="text-sm font-medium text-[#38624b]">{card.label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#123122]">{card.value}</p>
        </div>
      ))}
    </section>
  );
}
