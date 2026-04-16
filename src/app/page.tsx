"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { PdfExportButton } from "@/components/dashboard/PdfExportButton";
import { FilterBar } from "@/components/filters/FilterBar";
import { FieldSummaryTable } from "@/components/tables/FieldSummaryTable";
import { RecordsTable } from "@/components/tables/RecordsTable";
import { ExcelUploadButton } from "@/components/upload/ExcelUploadButton";
import { ImportErrorTable } from "@/components/upload/ImportErrorTable";
import { parseExcelFile } from "@/lib/excel/parser";
import type { HarvestRecord, ValidationError } from "@/types/harvest";
import { useHarvestDashboard } from "@/hooks/useHarvestDashboard";

const HarvestCharts = dynamic(
  () => import("@/components/charts/HarvestCharts").then((mod) => mod.HarvestCharts),
  { ssr: false },
);

export default function Home() {
  const [records, setRecords] = useState<HarvestRecord[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [status, setStatus] = useState("Excelファイルを取り込んでください");

  const dashboard = useHarvestDashboard(records);

  const handleImport = async (file: File) => {
    setIsImporting(true);
    setStatus("取り込み中です...");
    try {
      const result = await parseExcelFile(file);
      setRecords((prev) => [...prev, ...result.validRows]);
      setErrors(result.errorRows);
      setStatus(`取込完了: 正常 ${result.validRows.length}件 / エラー ${result.errorRows.length}件`);
    } catch {
      setStatus("取込に失敗しました。Excel形式と列名を確認してください。");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#e4f2e9,transparent_38%)] px-4 py-6 text-slate-900 md:px-6 xl:px-10">
      <div id="dashboard-root" className="mx-auto max-w-[1440px] space-y-5">
        <header className="rounded-2xl border border-[#cfe1d7] bg-white p-5 shadow-[0_8px_28px_rgba(22,103,58,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-[0.08em] text-[#1f8b4c]">SAKAKI HARVEST DASHBOARD</p>
              <h1 className="text-2xl font-bold tracking-tight text-[#123122]">榊 収穫管理ダッシュボード</h1>
              <p className="text-sm text-slate-600">{status}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ExcelUploadButton onSelect={handleImport} disabled={isImporting} />
              <PdfExportButton targetId="dashboard-root" />
            </div>
          </div>
        </header>

        {dashboard.years.length > 0 && (
          <FilterBar
            years={dashboard.years}
            fields={dashboard.fields}
            filter={dashboard.filter}
            onChange={dashboard.setFilter}
          />
        )}

        <KpiCards kpi={dashboard.kpi} />

        <HarvestCharts
          dailySeries={dashboard.dailySeries}
          monthlySeries={dashboard.monthlySeries}
          yearlySeries={dashboard.yearlySeries}
          fieldSeries={dashboard.fieldSeries}
          fieldSummary={dashboard.fieldSummary}
        />

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <FieldSummaryTable rows={dashboard.fieldSummary} />
          <ImportErrorTable errors={errors} />
        </section>

        <RecordsTable rows={dashboard.rows} />
      </div>
    </main>
  );
}
