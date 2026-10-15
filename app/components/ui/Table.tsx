"use client";

import React, { createContext, useContext } from "react";

/**
 * Standard data-table primitives. They render plain <table>/<tr>/<td> (so print CSS and
 * scrolling containers keep working) and own the table *chrome*: padding, header typography,
 * row dividers, hover, number alignment. Pass className only for what is specific to a cell
 * (highlight colors, widths, sticky columns) — never padding or font size.
 *
 *   <TableContainer>
 *     <Table density="compact">
 *       <THead sticky><TR><TH>Producto</TH><TH numeric>Cantidad</TH></TR></THead>
 *       <TBody>{rows.map(r => <TR key={r.id}><TD>{r.nombre}</TD><TD numeric>{formatInteger(r.cantidad)}</TD></TR>)}</TBody>
 *       <TFoot><TR total><TD>Total</TD><TD numeric>{formatInteger(total)}</TD></TR></TFoot>
 *     </Table>
 *   </TableContainer>
 *
 * density: "normal" (text-sm, roomy — CRUD lists) | "compact" (text-xs — reports, dense lists).
 * For bespoke dense grids (editable spreadsheets, pivot reports) use tableClasses.num etc. à la carte.
 */
export type TableDensity = "normal" | "compact";

const DensityContext = createContext<TableDensity>("normal");
/** Rows inside <THead>/<TFoot> don't get the body hover effect. */
const SectionContext = createContext<"head" | "body" | "foot">("body");

const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

export const tableClasses = {
  container:
    "overflow-x-auto rounded-card border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
  // Colors live on <table>/<thead> and are inherited, so a cell's own text color always wins.
  table: {
    normal: "w-full text-left text-sm text-zinc-700 dark:text-zinc-200",
    compact: "w-full text-left text-xs text-zinc-700 dark:text-zinc-200",
  },
  thead: "bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400",
  theadSticky: "sticky top-0 z-10 shadow-[0_1px_0_0_var(--color-zinc-200)] dark:shadow-[0_1px_0_0_var(--color-zinc-800)]",
  th: {
    normal: "px-4 py-2.5",
    compact: "px-2 py-1.5",
    base: "text-3xs font-bold uppercase tracking-wider whitespace-nowrap border-b border-zinc-200 dark:border-zinc-800",
  },
  tbody: "divide-y divide-zinc-100 dark:divide-zinc-800/80",
  tr: "transition-colors hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50",
  trClickable: "cursor-pointer",
  trSelected: "bg-brand-50/60 dark:bg-brand-950/30 hover:bg-brand-50 dark:hover:bg-brand-950/40",
  trTotal: "bg-zinc-50 font-bold text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 border-t-2 border-zinc-200 dark:border-zinc-700",
  td: { normal: "px-4 py-2.5", compact: "px-2 py-1.5", base: "align-middle" },
  /** Numbers: right-aligned, fixed-width digits so columns line up. */
  num: "text-right tabular-nums whitespace-nowrap",
  center: "text-center",
} as const;

type Align = "left" | "center" | "right";
const alignClass = (align?: Align, numeric?: boolean) =>
  numeric ? tableClasses.num : align === "right" ? "text-right" : align === "center" ? tableClasses.center : "";

export function TableContainer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(tableClasses.container, className)} {...props} />;
}

export function Table({
  density = "normal",
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement> & { density?: TableDensity }) {
  return (
    <DensityContext.Provider value={density}>
      <table className={cx(tableClasses.table[density], className)} {...props} />
    </DensityContext.Provider>
  );
}

export function THead({ sticky, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement> & { sticky?: boolean }) {
  return (
    <SectionContext.Provider value="head">
      <thead className={cx(tableClasses.thead, sticky && tableClasses.theadSticky, className)} {...props} />
    </SectionContext.Provider>
  );
}

export function TBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cx(tableClasses.tbody, className)} {...props} />;
}

export function TFoot(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <SectionContext.Provider value="foot">
      <tfoot {...props} />
    </SectionContext.Provider>
  );
}

export const TR = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { selected?: boolean; total?: boolean }
>(function TR({ selected, total, className, onClick, ...props }, ref) {
  const section = useContext(SectionContext);
  return (
    <tr
      ref={ref}
      onClick={onClick}
      className={cx(
        total ? tableClasses.trTotal : section === "body" && tableClasses.tr,
        onClick && tableClasses.trClickable,
        selected && tableClasses.trSelected,
        className,
      )}
      {...props}
    />
  );
});

/** flush: no padding (cells holding an input or a full-bleed control). */
type CellProps<T> = T & { align?: Align; numeric?: boolean; flush?: boolean };

export function TH({ align, numeric, flush, className, ...props }: CellProps<React.ThHTMLAttributes<HTMLTableCellElement>>) {
  const density = useContext(DensityContext);
  return <th className={cx(!flush && tableClasses.th[density], tableClasses.th.base, alignClass(align, numeric), className)} {...props} />;
}

export function TD({ align, numeric, flush, className, ...props }: CellProps<React.TdHTMLAttributes<HTMLTableCellElement>>) {
  const density = useContext(DensityContext);
  return <td className={cx(!flush && tableClasses.td[density], tableClasses.td.base, alignClass(align, numeric), className)} {...props} />;
}

/** Full-width message row ("Sin registros", spinner) inside a table body. */
export function TableMessageRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-zinc-400 dark:text-zinc-500">
        {children}
      </td>
    </tr>
  );
}
