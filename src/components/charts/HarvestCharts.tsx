"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FIELD_COLOR_MAP } from "@/data/fields";
import { formatDateLabel } from "@/lib/formatters";
import type { FieldSummary } from "@/types/harvest";
import { ChartCard } from "@/components/charts/ChartCard";

type Props = {
  dailySeries: { date: string; harvestKg: number }[];
  monthlySeries: { month: number; harvestKg: number }[];
  yearlySeries: { year: number; harvestKg: number }[];
  fieldSeries: { fieldName: keyof typeof FIELD_COLOR_MAP; harvestKg: number }[];
  fieldSummary: FieldSummary[];
};

export function HarvestCharts({
  dailySeries,
  monthlySeries,
  yearlySeries,
  fieldSeries,
  fieldSummary,
}: Props) {
  const ranking = [...fieldSeries].sort((a, b) => b.harvestKg - a.harvestKg);
  const tooltipFormatter = (value: string | number | readonly (string | number)[] | undefined) => {
    const normalized = Array.isArray(value) ? value[0] : value;
    return [`${Number(normalized ?? 0).toFixed(1)}`, "収穫量(kg)"] as const;
  };

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="xl:col-span-2">
        <ChartCard title="年別収穫量推移">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlySeries}>
              <CartesianGrid stroke="#d8e6de" />
              <XAxis dataKey="year" tickFormatter={(v) => `${v}年`} />
              <YAxis />
              <Tooltip formatter={tooltipFormatter} />
              <Bar dataKey="harvestKg" fill="#1f8b4c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="日別収穫量推移">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailySeries}>
            <CartesianGrid stroke="#d8e6de" />
            <XAxis dataKey="date" tickFormatter={formatDateLabel} minTickGap={24} />
            <YAxis />
            <Tooltip formatter={tooltipFormatter} />
            <Line type="monotone" dataKey="harvestKg" stroke="#1f8b4c" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="月別収穫量推移">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlySeries}>
            <CartesianGrid stroke="#d8e6de" />
            <XAxis dataKey="month" tickFormatter={(v) => `${v}月`} />
            <YAxis />
            <Tooltip formatter={tooltipFormatter} />
            <Bar dataKey="harvestKg" fill="#209354" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="圃場別収穫量構成比">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={fieldSeries} dataKey="harvestKg" nameKey="fieldName" innerRadius={58} outerRadius={90}>
              {fieldSeries.map((row) => (
                <Cell key={row.fieldName} fill={FIELD_COLOR_MAP[row.fieldName]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const item = payload[0];
                const fieldName = String(item?.name ?? "-");
                const value = Number(item?.value ?? 0).toFixed(1);
                return (
                  <div className="rounded-md border border-[#bfd4c7] bg-white px-3 py-2 text-sm shadow">
                    <p className="font-semibold text-[#123122]">{fieldName}</p>
                    <p className="text-[#2f5a44]">収穫量(kg): {value}</p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="圃場別収穫量ランキング">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ranking} layout="vertical" margin={{ left: 12, right: 12 }}>
            <CartesianGrid stroke="#d8e6de" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="fieldName" width={88} />
            <Tooltip formatter={tooltipFormatter} />
            <Bar dataKey="harvestKg" radius={[0, 6, 6, 0]}>
              {ranking.map((row) => (
                <Cell key={row.fieldName} fill={FIELD_COLOR_MAP[row.fieldName]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="xl:col-span-2">
        <ChartCard title="面積あたり収穫量比較">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fieldSummary}>
              <CartesianGrid stroke="#d8e6de" />
              <XAxis dataKey="fieldName" />
              <YAxis />
              <Tooltip formatter={tooltipFormatter} />
              <Bar dataKey="kgPerAre" radius={[6, 6, 0, 0]}>
                {fieldSummary.map((row) => (
                  <Cell key={row.fieldName} fill={FIELD_COLOR_MAP[row.fieldName]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}
