"use client";

import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Inline message box that stays on screen inside the layout — a form's submit error at the top
 * of a modal, a "this week is closed" notice above a grid. For transient feedback after an
 * action use notify.*() (toast); to ask a question use confirmDialog().
 *
 *   {error && <Alert tone="danger">{error}</Alert>}
 *   <Alert tone="warning" title="Semana cerrada">Los registros ya no se pueden editar.</Alert>
 */
type AlertTone = "info" | "success" | "warning" | "danger";

const tones: Record<AlertTone, { box: string; icon: React.ReactNode }> = {
  info: {
    box: "bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-300",
    icon: <InfoOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  success: {
    box: "bg-brand-50 border-brand-100 text-brand-700 dark:bg-brand-950/40 dark:border-brand-900/50 dark:text-brand-300",
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />,
  },
  warning: {
    box: "bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-950/40 dark:border-amber-900/50 dark:text-amber-300",
    icon: <WarningAmberRoundedIcon sx={{ fontSize: 18 }} />,
  },
  danger: {
    box: "bg-red-50 border-red-100 text-red-600 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-400",
    icon: <ErrorOutlineIcon sx={{ fontSize: 18 }} />,
  },
};

export function Alert({
  tone = "info",
  title,
  children,
  action,
  onClose,
  className = "",
}: {
  tone?: AlertTone;
  title?: string;
  children?: React.ReactNode;
  /** A small button/link on the right ("Reintentar", "Ver detalle"). */
  action?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <div
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-xs ${t.box} ${className}`}
    >
      <span className="mt-px shrink-0">{t.icon}</span>
      <div className="min-w-0 flex-1">
        {title && <p className="font-bold text-sm leading-tight mb-0.5">{title}</p>}
        {children && <div className="leading-relaxed whitespace-pre-line">{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="shrink-0 rounded-md p-0.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </button>
      )}
    </div>
  );
}
