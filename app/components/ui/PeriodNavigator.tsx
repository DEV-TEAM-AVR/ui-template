"use client";

import React from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

/**
 * ‹ 13 – 19 oct 2026 [Esta semana] [Sem. 42 del año] ›: steps through weeks/months above a
 * period grid. The caller owns the date math; this only renders.
 */
export function PeriodNavigator({
  label,
  isCurrent,
  currentLabel = "Esta semana",
  badge,
  onPrev,
  onNext,
  nextDisabled,
  extra,
}: {
  /** The period as text ("13 – 19 oct 2026"). */
  label: React.ReactNode;
  /** Shows the brand "Esta semana" pill. */
  isCurrent?: boolean;
  currentLabel?: string;
  /** Neutral pill, e.g. "Sem. 42 del año". */
  badge?: React.ReactNode;
  onPrev: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  /** Controls after the arrows (a view toggle, an export button). */
  extra?: React.ReactNode;
}) {
  const arrow =
    "w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed";
  return (
    <div className="flex items-center justify-between sm:justify-start gap-2 w-full">
      <button type="button" onClick={onPrev} className={arrow} aria-label="Período anterior" title="Período anterior">
        <ChevronLeftIcon sx={{ fontSize: 18 }} />
      </button>
      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center flex-1 sm:flex-none justify-center">
        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-50">{label}</span>
        {(isCurrent || badge) && (
          <div className="flex items-center gap-1 justify-center flex-wrap">
            {isCurrent && (
              <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                {currentLabel}
              </span>
            )}
            {badge && (
              <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-200">
                {badge}
              </span>
            )}
          </div>
        )}
      </div>
      <button type="button" onClick={onNext} disabled={nextDisabled} className={arrow} aria-label="Período siguiente" title="Período siguiente">
        <ChevronRightIcon sx={{ fontSize: 18 }} />
      </button>
      {extra && <div className="ml-2 shrink-0">{extra}</div>}
    </div>
  );
}
