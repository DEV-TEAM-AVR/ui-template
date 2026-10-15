"use client";

import React from "react";

/**
 * KPI tile for dashboards: small uppercase label, big tabular value, optional unit, and a delta
 * line (green up / red down; pass `goodWhen="down"` for metrics where lower is better).
 * Format the value before passing it (formatNumber / formatMoney / formatPercent).
 */
export function StatCard({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  goodWhen = "up",
  icon,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  /** Signed change; its sign picks the arrow and color. */
  delta?: number | null;
  /** Text shown for the delta, e.g. "+2.4% vs semana anterior". */
  deltaLabel?: string;
  goodWhen?: "up" | "down";
  icon?: React.ReactNode;
  className?: string;
}) {
  const hasDelta = delta != null && delta !== 0;
  const good = hasDelta && (goodWhen === "up" ? delta! > 0 : delta! < 0);
  return (
    <div
      className={`rounded-card border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col gap-1 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-3xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{label}</span>
        {icon && <span className="text-zinc-300 dark:text-zinc-600">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50 leading-tight">{value}</span>
        {unit && <span className="text-3xs font-semibold text-zinc-500 dark:text-zinc-300">{unit}</span>}
      </div>
      {(hasDelta || deltaLabel) && (
        <span
          className={`text-2xs font-semibold ${
            !hasDelta ? "text-zinc-400" : good ? "text-brand-600 dark:text-brand-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {hasDelta && (delta! > 0 ? "▲ " : "▼ ")}
          {deltaLabel}
        </span>
      )}
    </div>
  );
}
