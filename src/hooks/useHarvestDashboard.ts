"use client";

import { useMemo, useState } from "react";
import { FIELD_MASTER } from "@/data/fields";
import {
  filterRows,
  getAvailableYears,
  getDailySeries,
  getFieldSeries,
  getFieldSummary,
  getKpiData,
  getMonthlySeries,
  getYearlySeries,
} from "@/lib/aggregations/harvestAggregations";
import type { DashboardFilter, HarvestRecord } from "@/types/harvest";

export const useHarvestDashboard = (rows: HarvestRecord[]) => {
  const years = useMemo(() => getAvailableYears(rows), [rows]);
  const defaultYear = years[0] ?? new Date().getFullYear();

  const [filter, setFilter] = useState<DashboardFilter>({
    year: defaultYear,
    month: "all",
    field: "all",
  });

  const resolvedFilter = useMemo<DashboardFilter>(() => {
    if (filter.year === "all") return filter;
    if (years.length === 0 || years.includes(filter.year)) return filter;
    return { ...filter, year: years[0] };
  }, [filter, years]);

  const activeRows = useMemo(() => filterRows(rows, resolvedFilter), [rows, resolvedFilter]);
  const annualRows = useMemo(
    () => (resolvedFilter.year === "all" ? rows : rows.filter((r) => r.year === resolvedFilter.year)),
    [rows, resolvedFilter.year],
  );

  const kpi = useMemo(() => getKpiData(rows, resolvedFilter), [rows, resolvedFilter]);
  const dailySeries = useMemo(() => getDailySeries(activeRows), [activeRows]);
  const monthlySeries = useMemo(
    () => getMonthlySeries(rows, resolvedFilter.year),
    [rows, resolvedFilter.year],
  );
  const yearlySeries = useMemo(() => getYearlySeries(rows), [rows]);
  const fieldSeries = useMemo(() => getFieldSeries(activeRows), [activeRows]);
  const fieldSummary = useMemo(() => getFieldSummary(activeRows), [activeRows]);

  return {
    years,
    filter: resolvedFilter,
    setFilter,
    rows: activeRows,
    annualRows,
    kpi,
    dailySeries,
    monthlySeries,
    yearlySeries,
    fieldSeries,
    fieldSummary,
    fields: FIELD_MASTER,
  };
};
