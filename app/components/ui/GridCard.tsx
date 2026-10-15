"use client";

import React from "react";

/**
 * Card with a black title bar, the frame for an entity's data block (one per galpón, sucursal,
 * vehicle…) on dense data-entry pages. Stack <GroupedGrid> sections inside it; each section
 * draws its own thick top divider.
 *
 *   <GridCard icon={<StoreIcon sx={{ fontSize: 18 }} />} title="Sucursal Norte" meta="Prom. 12 Sem."
 *     chips={["Lote A · Sem. 10", "Lote B · Sem. 14"]}>
 *     <GroupedGrid … />
 *   </GridCard>
 *
 * The bar stays zinc-900 in both themes, like the sidebar.
 */
export function GridCard({
  title,
  icon,
  meta,
  chips,
  actions,
  children,
  className = "",
}: {
  title: React.ReactNode;
  icon?: React.ReactNode;
  /** Muted text after the title ("· Prom. 12 Sem."). */
  meta?: React.ReactNode;
  /** Small pills on the right of the bar (sub-entities, ages, statuses). */
  chips?: React.ReactNode[];
  /** Controls on the far right of the bar (white-on-dark: use ghost buttons with text-zinc-300). */
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-zinc-200 dark:border-zinc-700 rounded-card overflow-hidden shadow-sm flex flex-col pb-4 bg-white dark:bg-zinc-950 ${className}`}>
      <div className="bg-zinc-900 text-white px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-zinc-400 shrink-0 flex">{icon}</span>}
          <span className="text-sm font-semibold tracking-wide flex items-center gap-1.5 min-w-0">
            <span className="truncate">{title}</span>
            {meta && <span className="text-xs font-normal text-zinc-400 shrink-0">· {meta}</span>}
          </span>
        </div>
        {(chips?.length || actions) && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {chips?.map((c, i) => (
              <span key={i} className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-200">
                {c}
              </span>
            ))}
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
