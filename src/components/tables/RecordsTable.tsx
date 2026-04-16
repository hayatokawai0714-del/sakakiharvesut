"use client";

import { useMemo, useState } from "react";
import type { HarvestRecord } from "@/types/harvest";

type Props = {
  rows: HarvestRecord[];
};

type SortOrder = "desc" | "asc";

export function RecordsTable({ rows }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sortedRows = useMemo(() => {
    const cloned = [...rows];
    cloned.sort((a, b) => {
      const aTime = Number.isFinite(new Date(a.date).getTime()) ? new Date(a.date).getTime() : 0;
      const bTime = Number.isFinite(new Date(b.date).getTime()) ? new Date(b.date).getTime() : 0;
      const dateDiff = aTime - bTime;
      if (dateDiff !== 0) return sortOrder === "desc" ? -dateDiff : dateDiff;
      const idDiff = String(a.harvestId ?? "").localeCompare(String(b.harvestId ?? ""));
      return sortOrder === "desc" ? -idDiff : idDiff;
    });
    return cloned;
  }, [rows, sortOrder]);

  return (
    <div className="overflow-x-auto rounded-xl border border-[#cfe1d7] bg-white shadow-[0_6px_18px_rgba(22,103,58,0.06)]">
      <div className="flex items-center justify-between gap-2 border-b border-[#dbe8e0] px-4 py-3">
        <h3 className="text-base font-semibold text-[#123122]">記録一覧表</h3>
        <label className="flex items-center gap-2 text-sm text-[#2f5a44]">
          並び順
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="rounded-md border border-[#bfd4c7] bg-[#f7fbf9] px-2 py-1 text-sm text-slate-800"
          >
            <option value="desc">新しい順</option>
            <option value="asc">古い順</option>
          </select>
        </label>
      </div>
      <table className="min-w-full text-sm">
        <thead className="bg-[#f3f9f6] text-left text-[#335742]">
          <tr>
            <th className="px-4 py-2">日付</th>
            <th className="px-4 py-2">圃場名</th>
            <th className="px-4 py-2">収穫量（kg）</th>
            <th className="px-4 py-2">メモ</th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, index) => (
            <tr
              key={`${row.harvestId}-${row.date}-${row.fieldName}-${row.timing}-${index}`}
              className="border-t border-[#edf3ef]"
            >
              <td className="px-4 py-2">{row.date}</td>
              <td className="px-4 py-2">{row.fieldName}</td>
              <td className="px-4 py-2">{row.harvestKg.toFixed(1)}</td>
              <td className="max-w-xs truncate px-4 py-2">{row.memo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
