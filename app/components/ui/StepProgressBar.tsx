import React from "react";

interface StepProgressBarProps {
  /** Steps finished so far. */
  done: number;
  total: number;
  /** Fraction (0–1) of the step in flight, when the server reports sub-step progress. */
  partial?: number;
  /** Headline shown next to the spinner, e.g. "Recalculando métricas…". */
  message: string;
  /** What the step currently in flight is working on, e.g. "Sucursal Norte". */
  current?: string;
  /** Plural noun for the counter line, e.g. "sucursales". */
  unit?: string;
  errorCount?: number;
}

/**
 * Step-by-step progress for long jobs that the client drives one HTTP call at a time
 * (bulk recalculations, multi-file uploads). Splitting the work keeps every
 * request short enough to stay under the gateway timeout.
 */
export function StepProgressBar({ done, total, partial = 0, message, current, unit = "pasos", errorCount = 0 }: StepProgressBarProps) {
  const progressed = done < total ? done + Math.min(Math.max(partial, 0), 1) : total;
  const pct = total > 0 ? Math.round((Math.min(progressed, total) / total) * 100) : 0;

  return (
    <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2.5">
      <div className="flex items-center justify-between gap-3 text-xs font-semibold">
        <span className="text-zinc-700 dark:text-zinc-300 flex items-center gap-2 min-w-0">
          <svg className="animate-spin w-3.5 h-3.5 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="truncate">{message}</span>
        </span>
        <span className="text-brand-600 dark:text-brand-400 font-bold font-mono">{pct}%</span>
      </div>
      <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-brand-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.max(4, pct)}%` }}
        />
      </div>
      <div className="text-2xs text-zinc-500 dark:text-zinc-400 flex justify-between gap-3 font-mono">
        <span className="truncate">{current ?? ""}</span>
        <span className="shrink-0">
          {Math.min(done, total)} de {total} {unit}
          {errorCount > 0 && <span className="text-red-600 dark:text-red-400"> · {errorCount} error(es)</span>}
        </span>
      </div>
    </div>
  );
}
