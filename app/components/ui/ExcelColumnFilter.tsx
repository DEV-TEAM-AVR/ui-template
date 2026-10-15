"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

/**
 * Filtro de columna estilo Excel: ordenar + filtrar por valores (lista con búsqueda) y, en
 * columnas numéricas, por condición (=, ≠, >, ≥, <, ≤, entre). El tipo de dato de la columna
 * se detecta a partir de sus valores (ver detectColumnType), así que cada tabla sólo declara
 * de dónde sale el valor crudo de cada columna y cómo se muestra.
 *
 * El panel se porta a <body> con posición fija: los encabezados suelen vivir dentro de un
 * contenedor con overflow (tablas con scroll propio) que, si no, recortaría el panel.
 */

export type ColumnDataType = "number" | "date" | "text";
export type ColumnCellValue = number | string | null | undefined;

export type NumberOp = "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "between";

export interface ColumnFilterState {
  /** Claves (texto mostrado) desmarcadas. Se guarda lo excluido y no lo permitido para que,
   * si los datos cambian (otro período/filtro), los valores nuevos aparezcan marcados. */
  excluded?: Set<string>;
  /** Sólo columnas numéricas. */
  cond?: { op: NumberOp; a: number | null; b: number | null };
}

export type SortDir = "asc" | "desc";

export const EMPTY_VALUE_KEY = "(Vacías)";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}/;

/** Tipo de dato de una columna según sus valores no vacíos: todos números → number; todos
 * fechas ISO (YYYY-MM-DD…) → date; si no → text. Una columna sin valores es text. */
export function detectColumnType(values: ColumnCellValue[]): ColumnDataType {
  let sawAny = false;
  let allNumbers = true;
  let allDates = true;
  for (const v of values) {
    if (v == null || v === "") continue;
    sawAny = true;
    if (typeof v !== "number" || !Number.isFinite(v)) allNumbers = false;
    if (typeof v !== "string" || !ISO_DATE_RE.test(v)) allDates = false;
    if (!allNumbers && !allDates) break;
  }
  if (!sawAny) return "text";
  if (allNumbers) return "number";
  if (allDates) return "date";
  return "text";
}

/** Clave de la lista de valores para una celda: su texto mostrado, o "(Vacías)". */
export function cellKey(value: ColumnCellValue, formatted: string): string {
  return value == null || value === "" ? EMPTY_VALUE_KEY : formatted;
}

function testNumberCond(v: number, cond: NonNullable<ColumnFilterState["cond"]>): boolean {
  const { op, a, b } = cond;
  if (a == null) return true; // condición a medio escribir → no filtra todavía
  switch (op) {
    case "eq": return v === a;
    case "ne": return v !== a;
    case "gt": return v > a;
    case "gte": return v >= a;
    case "lt": return v < a;
    case "lte": return v <= a;
    case "between": {
      if (b == null) return v >= a;
      const [lo, hi] = a <= b ? [a, b] : [b, a];
      return v >= lo && v <= hi;
    }
  }
}

export function isFilterActive(f: ColumnFilterState | undefined): boolean {
  return !!f && ((f.excluded?.size ?? 0) > 0 || (f.cond !== undefined && f.cond.a != null));
}

/** ¿La celda pasa el filtro de su columna? */
export function matchesColumnFilter(value: ColumnCellValue, key: string, f: ColumnFilterState | undefined): boolean {
  if (!f) return true;
  if (f.excluded?.has(key)) return false;
  if (f.cond && f.cond.a != null) {
    if (typeof value !== "number") return false;
    if (!testNumberCond(value, f.cond)) return false;
  }
  return true;
}

/** Comparador por tipo; los vacíos van siempre al final, en ambos sentidos. */
export function compareCells(a: ColumnCellValue, b: ColumnCellValue, type: ColumnDataType, dir: SortDir): number {
  const aEmpty = a == null || a === "";
  const bEmpty = b == null || b === "";
  if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1;
  let c: number;
  if (type === "number" && typeof a === "number" && typeof b === "number") c = a - b;
  else c = String(a).localeCompare(String(b), "es", { numeric: true });
  return dir === "asc" ? c : -c;
}

const SORT_LABELS: Record<ColumnDataType, [string, string]> = {
  text: ["Ordenar A a Z", "Ordenar Z a A"],
  number: ["Ordenar de menor a mayor", "Ordenar de mayor a menor"],
  date: ["Ordenar del más antiguo al más reciente", "Ordenar del más reciente al más antiguo"],
};

const TYPE_LABELS: Record<ColumnDataType, string> = {
  text: "Texto",
  number: "Número",
  date: "Fecha",
};

const OP_LABELS: { op: NumberOp; label: string }[] = [
  { op: "eq", label: "Es igual a" },
  { op: "ne", label: "No es igual a" },
  { op: "gt", label: "Mayor que" },
  { op: "gte", label: "Mayor o igual que" },
  { op: "lt", label: "Menor que" },
  { op: "lte", label: "Menor o igual que" },
  { op: "between", label: "Entre" },
];

/** Acepta coma o punto decimal y separadores de miles ("1.234,5" / "1234.5"). */
function parseNumberInput(raw: string): number | null {
  const s = raw.trim();
  if (!s) return null;
  const normalized = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

const PANEL_WIDTH = 272;

interface ExcelColumnFilterProps {
  label: string;
  type: ColumnDataType;
  /** Valores distintos de la columna (clave = texto mostrado), ya ordenados. Es una función
   * y sólo se llama con el panel abierto: armar la lista formatea cada celda de la columna,
   * y hacerlo para todas las columnas al montar la tabla la vuelve lenta. */
  getDistinct: () => string[];
  filter: ColumnFilterState | undefined;
  onFilterChange: (next: ColumnFilterState | undefined) => void;
  sortDir: SortDir | null;
  onSortChange: (dir: SortDir | null) => void;
}

export function ExcelColumnFilter({ label, type, getDistinct, filter, onFilterChange, sortDir, onSortChange }: ExcelColumnFilterProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; maxHeight: number } | null>(null);
  const [search, setSearch] = useState("");
  const [rawA, setRawA] = useState("");
  const [rawB, setRawB] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const active = isFilterActive(filter);
  const [ascLabel, descLabel] = SORT_LABELS[type];

  const place = () => {
    const r = buttonRef.current?.getBoundingClientRect();
    if (!r) return;
    const left = Math.max(8, Math.min(r.left, window.innerWidth - PANEL_WIDTH - 8));
    const top = r.bottom + 4;
    setPos({ left, top, maxHeight: Math.max(200, window.innerHeight - top - 8) });
  };

  const toggle = () => {
    if (!open) {
      setSearch("");
      setRawA(filter?.cond?.a != null ? String(filter.cond.a) : "");
      setRawB(filter?.cond?.b != null ? String(filter.cond.b) : "");
      place();
    }
    setOpen((o) => !o);
  };

  useLayoutEffect(() => {
    if (open) place();
  }, [open]);

  // Cerrar al hacer clic fuera, con Escape, o si scrollea algo que no sea el propio panel
  // (el panel es fijo: si la tabla scrollea quedaría flotando lejos de su columna).
  useEffect(() => {
    if (!open) return;
    const inside = (t: EventTarget | null) =>
      t instanceof Node && (panelRef.current?.contains(t) || buttonRef.current?.contains(t));
    const onDown = (e: MouseEvent) => { if (!inside(e.target)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onScroll = (e: Event) => { if (!inside(e.target)) setOpen(false); };
    const onResize = () => setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    document.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const distinct = useMemo(() => (open ? getDistinct() : []), [open, getDistinct]);
  const excluded = filter?.excluded;
  const shown = search ? distinct.filter((v) => v.toLowerCase().includes(search.toLowerCase())) : distinct;

  const emit = (next: ColumnFilterState) => {
    const clean: ColumnFilterState = {};
    if (next.excluded && next.excluded.size > 0) clean.excluded = next.excluded;
    if (next.cond) clean.cond = next.cond;
    onFilterChange(clean.excluded || clean.cond ? clean : undefined);
  };

  const toggleValue = (v: string) => {
    const next = new Set(excluded);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    emit({ ...filter, excluded: next });
  };

  // Con búsqueda activa, "Seleccionar todo"/"Ninguno" actúan sólo sobre lo que se ve (como en Excel).
  const selectAllShown = () => {
    const next = new Set(excluded);
    shown.forEach((v) => next.delete(v));
    emit({ ...filter, excluded: next });
  };
  const clearAllShown = () => {
    const next = new Set(excluded);
    shown.forEach((v) => next.add(v));
    emit({ ...filter, excluded: next });
  };

  const setCond = (op: NumberOp, a: string, b: string) => {
    emit({ ...filter, cond: { op, a: parseNumberInput(a), b: op === "between" ? parseNumberInput(b) : null } });
  };
  const currentOp: NumberOp = filter?.cond?.op ?? "gte";

  const panel =
    open && pos
      ? createPortal(
          <div
            ref={panelRef}
            style={{ left: pos.left, top: pos.top, width: PANEL_WIDTH, maxHeight: pos.maxHeight }}
            className="fixed z-[1400] flex flex-col overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl text-left normal-case tracking-normal font-normal"
          >
            <div className="flex items-center justify-between gap-2 px-2.5 pt-2 pb-1">
              <span className="truncate text-2xs font-bold text-zinc-700 dark:text-zinc-100">{label}</span>
              <span className="shrink-0 rounded-full border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 text-4xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {TYPE_LABELS[type]}
              </span>
            </div>

            <div className="flex flex-col gap-0.5 px-1.5 pb-1.5 border-b border-zinc-100 dark:border-zinc-800">
              {(["asc", "desc"] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => {
                    onSortChange(sortDir === dir ? null : dir);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-1.5 rounded px-1.5 py-1 text-2xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer ${
                    sortDir === dir ? "text-brand-600 dark:text-brand-400" : "text-zinc-600 dark:text-zinc-200"
                  }`}
                >
                  {dir === "asc" ? <ArrowUpwardIcon sx={{ fontSize: 13 }} /> : <ArrowDownwardIcon sx={{ fontSize: 13 }} />}
                  {dir === "asc" ? ascLabel : descLabel}
                </button>
              ))}
            </div>

            <div className="flex min-h-0 flex-col gap-1.5 overflow-y-auto p-2">
              {type === "number" && (
                <div className="flex flex-col gap-1 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-3xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Filtro de número</span>
                  <select
                    value={currentOp}
                    onChange={(e) => setCond(e.target.value as NumberOp, rawA, rawB)}
                    className="h-7 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-1.5 text-2xs text-zinc-700 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-brand-400"
                  >
                    {OP_LABELS.map((o) => (
                      <option key={o.op} value={o.op}>{o.label}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder={currentOp === "between" ? "Desde" : "Valor"}
                      value={rawA}
                      onChange={(e) => { setRawA(e.target.value); setCond(currentOp, e.target.value, rawB); }}
                      className="h-7 min-w-0 flex-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 text-2xs text-zinc-700 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-brand-400"
                    />
                    {currentOp === "between" && (
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Hasta"
                        value={rawB}
                        onChange={(e) => { setRawB(e.target.value); setCond(currentOp, rawA, e.target.value); }}
                        className="h-7 min-w-0 flex-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 text-2xs text-zinc-700 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-brand-400"
                      />
                    )}
                  </div>
                </div>
              )}

              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-7 w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 text-2xs text-zinc-700 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-brand-400"
              />
              <div className="flex items-center justify-between px-0.5">
                <button type="button" onClick={selectAllShown} className="text-3xs font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer">
                  Seleccionar todo
                </button>
                <button type="button" onClick={clearAllShown} className="text-3xs font-semibold text-zinc-400 hover:underline cursor-pointer">
                  Ninguno
                </button>
              </div>
              <div className="flex max-h-52 flex-col gap-0.5 overflow-y-auto">
                {shown.map((v) => (
                  <label
                    key={v}
                    className="flex items-center gap-1.5 rounded px-1 py-0.5 text-2xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <input type="checkbox" checked={!excluded?.has(v)} onChange={() => toggleValue(v)} className="accent-brand-500" />
                    <span className={`truncate ${v === EMPTY_VALUE_KEY ? "italic text-zinc-400" : "font-mono"}`}>{v}</span>
                  </label>
                ))}
                {shown.length === 0 && <p className="py-2 text-center text-3xs text-zinc-400">Sin resultados</p>}
              </div>
            </div>

            {active && (
              <div className="border-t border-zinc-100 dark:border-zinc-800 p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onFilterChange(undefined);
                    setRawA("");
                    setRawB("");
                  }}
                  className="w-full rounded-md px-2 py-1 text-2xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                >
                  Borrar filtro de “{label}”
                </button>
              </div>
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        title={`Filtrar / ordenar ${label}`}
        aria-label={`Filtrar / ordenar ${label}`}
        aria-expanded={open}
        className={`inline-flex items-center align-middle rounded cursor-pointer transition-colors ${
          active || sortDir
            ? "text-brand-600 dark:text-brand-400"
            : "text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400"
        }`}
      >
        {sortDir === "asc" ? (
          <ArrowUpwardIcon sx={{ fontSize: 12 }} />
        ) : sortDir === "desc" ? (
          <ArrowDownwardIcon sx={{ fontSize: 12 }} />
        ) : active ? (
          <FilterAltIcon sx={{ fontSize: 12 }} />
        ) : (
          <FilterListIcon sx={{ fontSize: 12 }} />
        )}
      </button>
      {panel}
    </>
  );
}
