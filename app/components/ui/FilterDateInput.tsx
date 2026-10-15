"use client";

import React from "react";

type FilterDateInputProps = {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  /** Extra classes for the outer wrapper (e.g. "w-full"). */
  className?: string;
  /** Replaces the default compact box styling; layout classes are always appended. */
  boxClassName?: string;
};

const DEFAULT_BOX =
  "text-xs border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-zinc-950 h-[31px] min-w-[120px] hover:border-brand-300 focus:border-brand-400 focus:ring-1 focus:ring-brand-400";

/** ISO "yyyy-mm-dd" -> "dd/mm/yyyy". The native input's own displayed format
 * follows the browser/OS locale (not the `lang` attribute, despite what you'd
 * expect), so it can render as mm/dd/yyyy regardless — this formats the value
 * ourselves instead of trusting the browser to.
 */
function isoToDisplay(iso: string): string {
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
}

/**
 * Always displays dd/mm/yyyy, regardless of browser/OS locale. The real
 * `<input type="date">` is kept for the native calendar picker and keyboard
 * editing, but made invisible and layered on top of our own formatted text —
 * same overlay technique used for the week picker in TabVerificar.tsx.
 */
export function FilterDateInput({ value, onChange, min, max, disabled = false, className = "", boxClassName }: FilterDateInputProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`${boxClassName || DEFAULT_BOX} flex items-center transition-colors ${disabled ? "opacity-50" : "cursor-pointer"}`}
      >
        <span className={value ? "" : "text-zinc-400 dark:text-zinc-500"}>
          {value ? isoToDisplay(value) : "dd/mm/aaaa"}
        </span>
      </div>
      <input
        type="date"
        lang="es-BO"
        className="absolute inset-0 w-full h-full opacity-0 scheme-light dark:scheme-dark cursor-pointer disabled:cursor-not-allowed"
        min={min}
        max={max}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => {
          // The real tap already opens the native picker on every browser; this
          // is just a best-effort nudge for browsers where a click alone doesn't.
          try { (e.currentTarget as any).showPicker?.(); } catch {}
        }}
      />
    </div>
  );
}
