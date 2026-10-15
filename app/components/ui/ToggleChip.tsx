"use client";

import React from "react";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

/**
 * Compact on/off switch for a filter that includes/excludes something ("Integrados",
 * "Mostrar anulados"), sized to sit in a card header or toolbar next to a SegmentedControl.
 */
export function ToggleChip({
  checked,
  onChange,
  children,
  title,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      title={title}
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-4xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
        checked
          ? "border-brand-300 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300"
          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-400 dark:text-zinc-500"
      }`}
    >
      {checked ? <CheckBoxIcon sx={{ fontSize: 12 }} /> : <CheckBoxOutlineBlankIcon sx={{ fontSize: 12 }} />}
      {children}
    </button>
  );
}
