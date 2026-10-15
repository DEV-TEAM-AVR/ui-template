"use client";

import { ConfirmDialogHost } from "./ConfirmDialog";
import { NotifierHost } from "./Notifier";

/** Mounted once in the root layout: renders confirmDialog() and notify.*() requests. */
export function FeedbackHost() {
  return (
    <>
      <ConfirmDialogHost />
      <NotifierHost />
    </>
  );
}
