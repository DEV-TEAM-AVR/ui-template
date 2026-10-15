"use client";

import React, { useSyncExternalStore } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import { Button } from "./Button";

/**
 * App-wide confirmation dialog — replaces window.confirm (which ignores the theme, looks broken
 * in the installed PWA and can't show a title or a red "danger" button).
 *
 *   if (!(await confirmDialog("¿Eliminar este pago?"))) return;
 *   if (!(await confirmDialog({ title: "Eliminar usuario", message: "…", tone: "danger", confirmText: "Eliminar" }))) return;
 *
 * Callable from components and plain lib code alike; <ConfirmDialogHost /> (mounted once in the
 * root layout via FeedbackHost) renders whatever is pending.
 */
export interface ConfirmOptions {
  title?: string;
  /** Body text. Newlines are preserved. */
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  /** "danger" → red confirm button (deletes, irreversible actions). Default "primary". */
  tone?: "primary" | "danger" | "warning";
}

interface PendingConfirm extends ConfirmOptions {
  resolve: (ok: boolean) => void;
}

let queue: PendingConfirm[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function confirmDialog(options: ConfirmOptions | string): Promise<boolean> {
  const opts = typeof options === "string" ? { message: options } : options;
  // No host mounted (SSR / tests): don't block the flow silently — fall back to the native dialog.
  if (typeof window === "undefined") return Promise.resolve(false);
  if (listeners.size === 0) return Promise.resolve(window.confirm(String(opts.message)));
  return new Promise<boolean>((resolve) => {
    queue = [...queue, { ...opts, resolve }];
    emit();
  });
}

/** Hook form, for components that prefer it. Same function as confirmDialog. */
export const useConfirm = () => confirmDialog;

function settle(ok: boolean) {
  const [current, ...rest] = queue;
  if (!current) return;
  queue = rest;
  emit();
  current.resolve(ok);
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => queue[0] ?? null;
const getServerSnapshot = () => null;

export function ConfirmDialogHost() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const tone = current?.tone ?? "primary";
  const Icon = tone === "primary" ? HelpOutlineRoundedIcon : WarningAmberRoundedIcon;
  const iconClass =
    tone === "danger"
      ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
      : tone === "warning"
        ? "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
        : "bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400";

  return (
    <Dialog
      open={!!current}
      onClose={() => settle(false)}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: "var(--radius-dialog)" } }}
    >
      {current && (
        <>
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1, fontSize: "1rem", fontWeight: 700 }}>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
              <Icon fontSize="small" />
            </span>
            {current.title ?? "Confirmar acción"}
          </DialogTitle>
          <DialogContent>
            <div className="whitespace-pre-line text-sm text-zinc-600 dark:text-zinc-300">{current.message}</div>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button variant="secondary" onClick={() => settle(false)}>
              {current.cancelText ?? "Cancelar"}
            </Button>
            <Button
              variant={tone === "danger" ? "danger" : "primary"}
              onClick={() => settle(true)}
              autoFocus
            >
              {current.confirmText ?? "Confirmar"}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
