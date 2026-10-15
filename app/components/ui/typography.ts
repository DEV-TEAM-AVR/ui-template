/**
 * Text roles. Pick the role, not a size: these are the only text styles screens use outside
 * of what the primitives (PageHeader, FieldLabel, Table, Button…) already render.
 *
 *   <h2 className={text.section}>Ventas por sucursal</h2>
 *   <p className={text.muted}>Últimos 30 días</p>
 */
export const text = {
  /** Page title — PageHeader renders it; use directly only outside the shell. */
  page: "text-xl sm:text-2xl font-bold tracking-tight leading-tight text-zinc-900 dark:text-zinc-50",
  /** Card / section heading. */
  section: "text-sm font-bold text-zinc-800 dark:text-zinc-100",
  /** Small uppercase label over a value or a group (KPI labels, filter group titles, table headers). */
  overline: "text-3xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400",
  /** Default running text. */
  body: "text-sm text-zinc-700 dark:text-zinc-200",
  /** Secondary text: descriptions, subtitles, metadata. */
  muted: "text-xs text-zinc-500 dark:text-zinc-400",
  /** Faint hints under fields, timestamps, counters. */
  hint: "text-2xs text-zinc-400 dark:text-zinc-500",
  /** Emphasized value inside running text or a cell. */
  strong: "font-bold text-zinc-900 dark:text-zinc-50",
  /** Any number that lines up in a column. */
  number: "tabular-nums whitespace-nowrap",
  /** Codes, IDs, references. */
  code: "font-mono text-xs text-zinc-600 dark:text-zinc-300",
} as const;
