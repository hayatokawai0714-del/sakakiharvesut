import { formatPercent } from "@/lib/formatters";
import type { FieldSummary } from "@/types/harvest";

type Props = {
  rows: FieldSummary[];
};

export function FieldSummaryTable({ rows }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#cfe1d7] bg-white shadow-[0_6px_18px_rgba(22,103,58,0.06)]">
      <h3 className="border-b border-[#dbe8e0] px-4 py-3 text-base font-semibold text-[#123122]">圃場別サマリー表</h3>
      <table className="min-w-full text-sm">
        <thead className="bg-[#f3f9f6] text-left text-[#335742]">
          <tr>
            <th className="px-4 py-2">圃場名</th>
            <th className="px-4 py-2">作付面積（アール）</th>
            <th className="px-4 py-2">総収穫量（kg）</th>
            <th className="px-4 py-2">面積あたり収穫量（kg/a）</th>
            <th className="px-4 py-2">収穫日数</th>
            <th className="px-4 py-2">構成比</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.fieldName} className="border-t border-[#edf3ef]">
              <td className="px-4 py-2">{row.fieldName}</td>
              <td className="px-4 py-2">{row.areaAre.toFixed(1)}</td>
              <td className="px-4 py-2">{row.totalKg.toFixed(1)}</td>
              <td className="px-4 py-2">{row.kgPerAre.toFixed(2)}</td>
              <td className="px-4 py-2">{row.harvestDays}</td>
              <td className="px-4 py-2">{formatPercent(row.share)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
