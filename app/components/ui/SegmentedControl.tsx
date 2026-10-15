"use client";

import React from "react";

/**
 * Pick one of 2–4 mutually exclusive views (Semana / Mes, Tabla / Gráfico). For more options,
 * or options that aren't views, use <Select>.
 *
 *   <SegmentedControl value={mode} onChange={setMode}
 *     options={[{ value: "semana", label: "Semana" }, { value: "mes", label: "Mes" }]} />
 *
 * size: "xs" (inside a card header, uppercase 9px — the dashboard look) | "sm" (page toolbars).
 */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  size = "sm",
  className = "",
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: React.ReactNode; title?: string }[];
  size?: "xs" | "sm";
  className?: string;
}) {
  const text = size === "xs" ? "text-4xs font-bold uppercase tracking-wider" : "text-xs font-semibold";
  const pad = size === "xs" ? "px-2 py-0.5" : "px-3 py-1.5";
  return (
    <div
      role="radiogroup"
      className={`inline-flex rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden ${text} ${className}`}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={o.title}
            onClick={() => onChange(o.value)}
            className={`${pad} transition-colors cursor-pointer ${
              active
                ? "bg-brand-500 text-white"
                : "bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
