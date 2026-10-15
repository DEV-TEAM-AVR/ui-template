"use client";

import React from "react";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { Button } from "./Button";

/**
 * Standard block states for a section/list/card. Inline hints (a select's "Cargando…" option,
 * a button caption) stay as plain text — these are for the area where content will appear.
 *
 *   if (loading) return <LoadingState label="Cargando ventas…" />;
 *   if (error) return <ErrorState message={error} onRetry={cargar} />;
 *   if (!rows.length) return <EmptyState title="Sin ventas" description="…" />;
 *
 * size: "md" (page section, default) | "sm" (inside a card, modal or table cell) |
 *       "fill" (no padding — centers in a box whose height you set via className, e.g. "h-48").
 */
type StateSize = "sm" | "md" | "fill";

const pad: Record<StateSize, string> = { sm: "py-6", md: "py-16", fill: "" };

export function LoadingState({
  label = "Cargando…",
  size = "md",
  className = "",
}: {
  /** Pass null for a bare spinner. */
  label?: string | null;
  size?: StateSize;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-2 text-zinc-400 dark:text-zinc-500 ${pad[size]} ${className}`}
    >
      <span
        aria-hidden
        className={`${size === "md" ? "h-8 w-8" : "h-6 w-6"} animate-spin rounded-full border-2 border-zinc-100 border-t-brand-500 dark:border-zinc-800`}
      />
      {label && <span className={size === "md" ? "text-xs font-semibold" : "text-2xs font-medium"}>{label}</span>}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
  size = "md",
  className = "",
}: {
  message: string;
  onRetry?: () => void;
  size?: StateSize;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-3 text-center ${pad[size]} ${className}`}
    >
      <ErrorOutlineRoundedIcon className="text-red-500 dark:text-red-400" fontSize={size === "md" ? "medium" : "small"} />
      <p className="max-w-md text-sm text-red-700 dark:text-red-300">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
