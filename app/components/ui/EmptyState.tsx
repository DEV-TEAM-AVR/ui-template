"use client";

import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  /** "md" (page section, default) | "sm" (inside a card, modal or panel — no frame, less height). */
  size?: "sm" | "md";
}

export function EmptyState({
  icon = <ErrorOutlineIcon sx={{ fontSize: 36 }} />,
  title,
  description,
  action,
  className = "",
  size = "md",
}: EmptyStateProps) {
  if (size === "sm") {
    return (
      <div className={`flex flex-col items-center justify-center py-8 text-center px-4 ${className}`}>
        <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{title}</h3>
        {description && <p className="text-2xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-md">{description}</p>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    );
  }
  return (
    <div
      className={`flex flex-col items-center justify-center py-24 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[2rem] border border-dashed border-zinc-200 dark:border-zinc-700 text-center px-4 ${className}`}
    >
      <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-100">{title}</h3>
      {description && (
        <p className="text-xs text-zinc-400 dark:text-zinc-400 mt-1 max-w-md">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
