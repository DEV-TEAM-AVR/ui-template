"use client";

import React, { useSyncExternalStore } from "react";
import { Toast } from "./Toast";

/**
 * App-wide toast notifications — replaces window.alert.
 *
 *   notify.success("Pago registrado");
 *   notify.error(getErrorMessage(err));
 *
 * Callable from anywhere (components or plain lib code); <NotifierHost /> renders the latest one.
 */
type NotifyType = "success" | "error" | "info";

interface NotifyState {
  id: number;
  message: string;
  type: NotifyType;
  visible: boolean;
}

let state: NotifyState = { id: 0, message: "", type: "info", visible: false };
const listeners = new Set<() => void>();
const set = (next: NotifyState) => {
  state = next;
  listeners.forEach((l) => l());
};

function show(message: string, type: NotifyType) {
  if (typeof window === "undefined") return;
  if (listeners.size === 0) {
    window.alert(message);
    return;
  }
  set({ id: state.id + 1, message, type, visible: true });
}

export const notify = {
  success: (message: string) => show(message, "success"),
  error: (message: string) => show(message, "error"),
  info: (message: string) => show(message, "info"),
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function NotifierHost() {
  const current = useSyncExternalStore(subscribe, () => state, () => state);
  return (
    <Toast
      key={current.id}
      visible={current.visible}
      message={current.message}
      type={current.type}
      // Errors usually carry a sentence worth reading — keep them up longer.
      duration={current.type === "error" ? 7000 : 4000}
      onClose={() => set({ ...state, visible: false })}
    />
  );
}
