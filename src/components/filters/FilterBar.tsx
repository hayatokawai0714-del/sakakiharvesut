import type { DashboardFilter, FieldName } from "@/types/harvest";

type Props = {
  years: number[];
  fields: readonly FieldName[];
  filter: DashboardFilter;
  onChange: (next: DashboardFilter) => void;
};

const selectClassName =
  "mt-1 w-full rounded-md border border-[#bfd4c7] bg-[#f7fbf9] px-3 py-2 text-slate-800 transition focus:border-[#1f8b4c]";

export function FilterBar({ years, fields, filter, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#cfe1d7] bg-white p-4 shadow-[0_6px_18px_rgba(22,103,58,0.06)] md:grid-cols-3 lg:grid-cols-5">
      <label className="text-sm font-medium text-[#2f5a44]">
        年
        <select
          className={selectClassName}
          value={filter.year}
          onChange={(e) =>
            onChange({ ...filter, year: e.target.value === "all" ? "all" : Number(e.target.value) })
          }
        >
          <option value="all">全期間</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}年
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium text-[#2f5a44]">
        月
        <select
          className={selectClassName}
          value={filter.month}
          onChange={(e) =>
            onChange({ ...filter, month: e.target.value === "all" ? "all" : Number(e.target.value) })
          }
        >
          <option value="all">全月</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {month}月
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium text-[#2f5a44] md:col-span-1 lg:col-span-2">
        圃場
        <select
          className={selectClassName}
          value={filter.field}
          onChange={(e) =>
            onChange({
              ...filter,
              field: e.target.value === "all" ? "all" : (e.target.value as FieldName),
            })
          }
        >
          <option value="all">全圃場</option>
          {fields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
