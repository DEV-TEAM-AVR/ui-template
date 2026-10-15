"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useAnchoredPanel } from "@/app/lib/useAnchoredPanel";

export interface FilterOption {
  value: string;
  label: string;
  /** No se puede marcar (se muestra atenuada); si ya está marcada igual se puede desmarcar. */
  disabled?: boolean;
  /** Texto chico al lado de la opción (p. ej. por qué está deshabilitada). */
  hint?: string;
}

export interface FilterGroup {
  key: string;
  title: string;
  options: FilterOption[];
  selected: string[];
  /** Opciones incluidas por otro grupo (p. ej. sucursales de una región marcada): se ven
   *  marcadas con su `impliedHint`, pero no cuentan como selección propia de este grupo. Al
   *  tocarlas se llama igual a `onToggle` — el dueño decide qué hacer. */
  implied?: string[];
  impliedHint?: (value: string) => string | undefined;
  onToggle: (value: string) => void;
  /** Muestra un buscador arriba de las opciones de este grupo (filtra por label, del lado del
   * cliente). Pensado para grupos largos (cientos de clientes o proveedores). */
  searchable?: boolean;
}

export function toggleFilterValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

const defaultTriggerCls =
  "text-xs border rounded-lg px-2 py-1.5 bg-white dark:bg-zinc-950 cursor-pointer " +
  "focus:outline-none focus:ring-1 focus:ring-brand-400 focus:border-brand-400 transition-colors " +
  "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-200";

function FilterGroupSection({
  title,
  options,
  selected,
  implied,
  impliedHint,
  onToggle,
  searchable,
}: Omit<FilterGroup, "key">) {
  const [search, setSearch] = useState("");
  if (options.length === 0) return null;
  const q = search.trim().toLowerCase();
  // Grupo con buscador: no se vuelca la lista entera. Sin texto sólo se muestran las opciones ya elegidas (para poder
  // desmarcarlas); al escribir aparecen las coincidencias. Un grupo normal muestra todo.
  const shown = !searchable
    ? options
    : q
    ? options.filter((o) => selected.includes(o.value) || o.label.toLowerCase().includes(q))
    : options.filter((o) => selected.includes(o.value));
  return (
    <div className="mb-2 last:mb-0">
      <div className="px-1.5 py-1 text-3xs font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {title}
      </div>
      {searchable && (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Escribí para buscar…"
          className="mb-1 w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 py-1 text-xs text-zinc-600 dark:text-zinc-200 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
        />
      )}
      {searchable && q !== "" && shown.length === 0 && (
        <div className="px-1.5 py-1 text-xs text-zinc-400 dark:text-zinc-500">Sin resultados</div>
      )}
      {shown.map((o) => {
        const porOtro = !selected.includes(o.value) && !!implied?.includes(o.value);
        const checked = selected.includes(o.value) || porOtro;
        const bloqueada = !!o.disabled && !checked;
        const hint = porOtro ? (impliedHint?.(o.value) ?? o.hint) : o.hint;
        return (
          <label
            key={o.value}
            title={hint}
            className={`flex items-center gap-2 px-1.5 py-1 rounded-md ${
              bloqueada ? "opacity-45 cursor-not-allowed" : "hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              disabled={bloqueada}
              onChange={() => onToggle(o.value)}
              className={`accent-brand-500 ${bloqueada ? "cursor-not-allowed" : "cursor-pointer"}`}
            />
            <span className="text-xs text-zinc-600 dark:text-zinc-200 truncate">{o.label}</span>
            {hint && (
              <span className={`ml-auto shrink-0 text-3xs ${porOtro ? "text-brand-600 dark:text-brand-400" : "text-zinc-400"}`}>
                {hint}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}

interface MultiGroupFilterDropdownProps {
  /** One checkbox section per group — selections OR within a group, AND across groups. */
  groups: FilterGroup[];
  /** Trigger label when nothing is selected in any group, e.g. "Todas las sucursales". */
  allLabel: string;
  /** Clears every group's selection at once. */
  onClear: () => void;
  /** Overrides the trigger button's classes (to match a page's existing select styling). */
  className?: string;
  title?: string;
}

/**
 * Combines several filter groups (Estado / Región / Sucursal, typically) into one multi-select
 * dropdown — checking multiple boxes within a group ORs them (e.g. Activas + Suspendidas), while
 * the groups AND together. The standard "filter" control for list and report toolbars.
 */
export function MultiGroupFilterDropdown({ groups, allLabel, onClear, className, title }: MultiGroupFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Panel is portaled to <body> with fixed positioning so a card's overflow or a trigger
  // at the right edge of a narrow column can't clip it (it used to be `absolute left-0`).
  const panelStyle = useAnchoredPanel(open, ref, { width: 256 });

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const totalSelected = groups.reduce((sum, g) => sum + g.selected.length, 0);
  const selectedLabels = groups.flatMap((g) => g.options.filter((o) => g.selected.includes(o.value)).map((o) => o.label));
  const triggerLabel =
    totalSelected === 0 ? allLabel : totalSelected <= 2 ? selectedLabels.join(", ") : `${totalSelected} filtros`;

  return (
    // z bumped to 50 while open so this wrapper's stacking context paints above a later sibling
    // dropdown (e.g. "Asignado a" next to "Sucursales") — otherwise DOM order wins between two equal
    // z-30 siblings and the closed one covers this one's open panel.
    <div className={`relative ${open ? "z-50" : "z-30"} w-full sm:w-auto`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${className || defaultTriggerCls} inline-flex items-center gap-1 ${
          className?.includes("max-w-") ? "" : "max-w-full sm:max-w-[220px]"
        }`}
        title={title || "Filtrar"}
      >
        <span className="truncate">{triggerLabel}</span>
        <KeyboardArrowDownIcon
          sx={{ fontSize: 15 }}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && createPortal(
        // Rounded corners + shadow live on this outer, non-scrolling frame — putting them on
        // the same element as overflow-y-auto (as before) can make Chromium repaint a "ghost"
        // of the last-scrolled content on fast scroll (looks like a section label sticking /
        // duplicating). Splitting the scroll area into its own plain inner div avoids that.
        <div
          ref={panelRef}
          style={panelStyle}
          className="z-1400 flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden"
        >
          {/* overflowAnchor: "none" — every checkbox click rebuilds the groups/options arrays
              (new objects each render), which re-triggers the browser's CSS scroll-anchoring:
              it tries to keep some node's visual position stable across that content mutation
              and picks the wrong one, pinning a stale copy of a section label (e.g. "SUCURSAL")
              near the top instead of scrolling normally. Opting this container out of scroll
              anchoring removes the browser behavior that causes it, regardless of why the
              content re-renders. */}
          <div className="max-h-80 min-h-0 overflow-y-auto p-2 bg-white dark:bg-zinc-950" style={{ overflowAnchor: "none" }}>
            {groups.map((g) => (
              <FilterGroupSection
                key={g.key}
                title={g.title}
                options={g.options}
                selected={g.selected}
                implied={g.implied}
                impliedHint={g.impliedHint}
                onToggle={g.onToggle}
                searchable={g.searchable}
              />
            ))}
            {totalSelected > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="mt-1 w-full text-center text-3xs font-bold uppercase tracking-wider text-zinc-400 hover:text-red-500 transition-colors py-1 cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
