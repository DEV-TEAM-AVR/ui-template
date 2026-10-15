"use client";

import React from "react";

/**
 * The app's one button. Pick by intent, not by color:
 *   primary   — the main action of a screen/modal (Guardar, Registrar, Aprobar)
 *   secondary — neutral alternatives (Cancelar, Actualizar, Exportar)
 *   ghost     — low-emphasis/toolbar actions and icon buttons
 *   danger    — destructive, irreversible actions (Eliminar, Anular, Rechazar)
 *   accent    — actions that push documents to an external system (ERP, accounting…), kept
 *               visually apart from in-app saves (Registrar Pago / Registrar Factura)
 *
 * For a <Link> or other element that must look like a button, use buttonClasses().
 */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "accent";
export type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap select-none " +
  "transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-offset-1 focus-visible:ring-brand-500/60 dark:focus-visible:ring-offset-zinc-950 " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow-sm",
  secondary:
    "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 " +
    "dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800",
  ghost:
    "bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 " +
    "dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
  danger: "bg-danger text-white hover:bg-danger-hover active:bg-red-800 shadow-sm",
  accent: "bg-accent text-white hover:bg-accent-hover active:bg-accent-active shadow-sm",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
  icon: "h-9 w-9 p-0",
  "icon-sm": "h-8 w-8 p-0",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
}: { variant?: ButtonVariant; size?: ButtonSize; fullWidth?: boolean; className?: string } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`.trim();
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className = "",
    variant = "primary",
    size = "md",
    loading = false,
    fullWidth = false,
    startIcon,
    endIcon,
    disabled,
    type = "button",
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      ) : (
        startIcon
      )}
      {children}
      {!loading && endIcon}
    </button>
  );
});
