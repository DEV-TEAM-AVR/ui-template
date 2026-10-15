"use client";

import React from "react";
import { formatNumber } from "@/app/lib/utils/number-format";
import { groupToneClass, type GroupTone } from "./groupTones";

/**
 * Dense matrix for data entry and review: rows are periods (days of a week, months), columns are
 * grouped into tinted bands (MORTALIDAD · INGRESOS · …), and each band holds one column per
 * sub-entity (lote, product) plus a TOTAL. This is the GAP-AVR "Registros" weekly grid,
 * generalized.
 *
 * Layout:
 *   header row 1: [corner label] [band per group, tinted by tone, with optional subheader]  [extra]
 *   header row 2: [DÍA]          [col labels … TOTAL]                                         [extra.prev]
 *   body:         sticky row label · values (clickable) · bold row TOTAL per group · extra column
 *   footer:       TOTAL row: column totals, bigger grand total per group
 *
 * Cells: a value renders with a dotted underline when clickable (edit). An empty clickable cell
 * shows "–" and turns brand-colored on row hover (create). Non-clickable empties are faint.
 * Always compact (text-xs, px-1.5 py-1). Wrap one or more grids in a <GridCard>.
 */
export interface GridColumn {
  key: string;
  label: React.ReactNode;
}

export interface GridGroup {
  key: string;
  label: string;
  tone: GroupTone;
  columns: GridColumn[];
  /** Extra line under the band label (e.g. opening balances per column). */
  subheader?: React.ReactNode;
  /** Show the per-row TOTAL column and the footer grand total. Default true. */
  total?: boolean;
  /** How a row's values combine into the TOTAL cell. Default "sum". */
  aggregate?: "sum" | "avg";
}

export interface GridRow {
  key: string;
  label: React.ReactNode;
  /** Muted text after the label (e.g. the day number). */
  sublabel?: React.ReactNode;
}

export interface GroupedGridProps {
  /** Corner cell over the row labels (the section name: "AVES", "ALIMENTO"). */
  title: string;
  /** Header over the row-label column. Default "DÍA". */
  rowHeader?: string;
  rows: GridRow[];
  groups: GridGroup[];
  getValue: (row: GridRow, group: GridGroup, col: GridColumn) => number | null | undefined;
  /** Default: formatNumber with up to 3 decimals. */
  format?: (value: number, group: GridGroup) => string;
  /** Makes a cell clickable. Called with the current value (null/undefined = empty → create). */
  onCellClick?: (row: GridRow, group: GridGroup, col: GridColumn, value: number | null | undefined) => void;
  /** Return false to make a specific cell read-only even when onCellClick is set. */
  isCellEditable?: (row: GridRow, group: GridGroup, col: GridColumn) => boolean;
  /** Extra text color for a value (warnings: "text-red-600 dark:text-red-400"). */
  cellTone?: (row: GridRow, group: GridGroup, col: GridColumn, value: number) => string | undefined;
  /** A trailing summary column (running balance, SALDOS). */
  extraColumn?: {
    label: string;
    /** Second header line, e.g. "Ant: 1,234" (opening balance). */
    prevLabel?: React.ReactNode;
    render: (row: GridRow) => React.ReactNode;
    /** Per-row cell classes, e.g. red when the balance goes negative. */
    className?: (row: GridRow) => string | undefined;
  };
  /** Show the footer TOTAL row. Default true. */
  footer?: boolean;
}

const cp = "px-1.5 py-1";
const dash = <span className="text-zinc-300 dark:text-zinc-600">–</span>;

export function GroupedGrid({
  title,
  rowHeader = "DÍA",
  rows,
  groups,
  getValue,
  format = (v) => formatNumber(v, { max: 3 }),
  onCellClick,
  isCellEditable,
  cellTone,
  extraColumn,
  footer = true,
}: GroupedGridProps) {
  const hasTotal = (g: GridGroup) => g.total !== false;

  const combine = (g: GridGroup, values: (number | null | undefined)[]) => {
    const nums = values.filter((v): v is number => v != null);
    if (nums.length === 0) return null;
    const sum = nums.reduce((s, v) => s + v, 0);
    return g.aggregate === "avg" ? sum / nums.length : sum;
  };

  const colTotal = (g: GridGroup, c: GridColumn) => combine(g, rows.map((r) => getValue(r, g, c)));
  const grandTotal = (g: GridGroup) => combine(g, rows.flatMap((r) => g.columns.map((c) => getValue(r, g, c))));

  return (
    <div className="border-t-4 border-zinc-200 dark:border-zinc-700">
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse min-w-max">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
              <th className="bg-zinc-100 dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 sticky left-0 z-30 align-middle w-16 px-1.5">
                <span className="text-3xs font-bold text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">{title}</span>
              </th>
              {groups.map((g) => (
                <th
                  key={g.key}
                  colSpan={g.columns.length + (hasTotal(g) ? 1 : 0)}
                  className={`border-r border-zinc-200 dark:border-zinc-700 align-middle ${groupToneClass[g.tone]}`}
                >
                  <div className="px-2 py-1 text-3xs font-bold tracking-wider text-center uppercase truncate">{g.label}</div>
                  {g.subheader && (
                    <div className="px-2 pb-1 text-4xs font-medium normal-case tracking-normal opacity-70">{g.subheader}</div>
                  )}
                </th>
              ))}
              {extraColumn && (
                <th className="bg-zinc-100 dark:bg-zinc-800 align-middle">
                  <div className="px-2 py-1.5 text-3xs font-bold text-zinc-500 dark:text-zinc-300 uppercase tracking-tight text-center">
                    {extraColumn.label}
                  </div>
                </th>
              )}
            </tr>
            <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-700">
              <th
                className={`text-left ${cp} font-semibold text-zinc-400 w-16 sticky left-0 bg-zinc-50 dark:bg-zinc-900 z-20 border-r border-zinc-200 dark:border-zinc-700`}
              >
                {rowHeader}
              </th>
              {groups.map((g) => (
                <React.Fragment key={g.key}>
                  {g.columns.map((c) => (
                    <th key={c.key} className={`${cp} text-center font-semibold text-zinc-600 dark:text-zinc-200 whitespace-nowrap bg-white dark:bg-zinc-950`}>
                      {c.label}
                    </th>
                  ))}
                  {hasTotal(g) && (
                    <th className={`${cp} text-center font-bold text-zinc-700 dark:text-zinc-100 whitespace-nowrap bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700`}>
                      TOTAL
                    </th>
                  )}
                </React.Fragment>
              ))}
              {extraColumn && (
                <th className={`${cp} text-center font-bold text-zinc-500 dark:text-zinc-300 whitespace-nowrap bg-zinc-50/50 dark:bg-zinc-900/50`}>
                  {extraColumn.prevLabel ?? ""}
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                <td
                  className={`${cp} font-medium text-zinc-600 dark:text-zinc-200 sticky left-0 bg-white dark:bg-zinc-950 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800 whitespace-nowrap z-10 border-r border-zinc-200 dark:border-zinc-700`}
                >
                  <span className="font-semibold">{r.label}</span>
                  {r.sublabel != null && <span className="ml-1 text-zinc-400">{r.sublabel}</span>}
                </td>
                {groups.map((g) => {
                  const values = g.columns.map((c) => getValue(r, g, c));
                  const rowTotal = combine(g, values);
                  return (
                    <React.Fragment key={g.key}>
                      {g.columns.map((c, i) => {
                        const v = values[i];
                        const has = v != null && v !== 0;
                        const clickable = !!onCellClick && (isCellEditable?.(r, g, c) ?? true);
                        const tone = has ? cellTone?.(r, g, c, v!) ?? "" : "";
                        return (
                          <td
                            key={c.key}
                            onClick={clickable ? () => onCellClick!(r, g, c, v) : undefined}
                            className={`${cp} text-center tabular-nums transition-colors ${
                              clickable ? "cursor-pointer hover:bg-brand-50/50 dark:hover:bg-brand-950/50" : ""
                            }`}
                          >
                            {has ? (
                              <span className={`font-medium text-zinc-900 dark:text-zinc-100 ${clickable ? "underline decoration-dotted underline-offset-2" : ""} ${tone}`}>
                                {format(v!, g)}
                              </span>
                            ) : (
                              <span
                                className={
                                  clickable
                                    ? "text-zinc-300 dark:text-zinc-500 group-hover:text-brand-500 dark:group-hover:text-brand-400"
                                    : "text-zinc-200 dark:text-zinc-600"
                                }
                              >
                                –
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {hasTotal(g) && (
                        <td
                          className={`${cp} text-center font-bold tabular-nums bg-zinc-50/50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-700 ${
                            rowTotal ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-300 dark:text-zinc-500"
                          }`}
                        >
                          {rowTotal ? format(rowTotal, g) : "–"}
                        </td>
                      )}
                    </React.Fragment>
                  );
                })}
                {extraColumn && (
                  <td
                    className={`${cp} text-center font-medium tabular-nums ${
                      extraColumn.className?.(r) ?? "text-zinc-500 dark:text-zinc-300 bg-zinc-50/30 dark:bg-zinc-900/30"
                    }`}
                  >
                    {extraColumn.render(r)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>

          {footer && (
            <tfoot>
              <tr className="bg-zinc-100/80 dark:bg-zinc-800/80 border-t-2 border-zinc-300 dark:border-zinc-600">
                <td
                  className={`${cp} font-bold text-zinc-700 dark:text-zinc-100 text-2xs tracking-wider sticky left-0 bg-zinc-100 dark:bg-zinc-800 z-10 border-r border-zinc-300 dark:border-zinc-600`}
                >
                  TOTAL
                </td>
                {groups.map((g) => {
                  const gt = grandTotal(g);
                  return (
                    <React.Fragment key={g.key}>
                      {g.columns.map((c) => {
                        const t = colTotal(g, c);
                        return (
                          <td key={c.key} className={`${cp} text-center font-bold tabular-nums ${t ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}>
                            {t ? format(t, g) : "—"}
                          </td>
                        );
                      })}
                      {hasTotal(g) && (
                        <td
                          className={`${cp} text-center font-bold tabular-nums text-sm bg-zinc-200/50 dark:bg-zinc-700/50 border-r border-zinc-300 dark:border-zinc-600 ${
                            gt ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"
                          }`}
                        >
                          {gt ? format(gt, g) : "—"}
                        </td>
                      )}
                    </React.Fragment>
                  );
                })}
                {extraColumn && <td className={`${cp} text-center text-zinc-400`}>{dash}</td>}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
