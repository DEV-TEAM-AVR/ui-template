import React from "react";
import { Snackbar, Alert, AlertProps } from "@mui/material";

/**
 * The toast's look. Don't render it directly — call notify.success/error/info() from
 * components/ui/Notifier, which drives the one <Toast> mounted by FeedbackHost.
 */
interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const typeMapping: Record<ToastProps["type"], AlertProps["severity"]> = {
  success: "success",
  error: "error",
  info: "info",
};

export const Toast = ({
  message,
  type,
  visible,
  onClose,
  duration = 4000,
}: ToastProps) => {
  return (
    <Snackbar
      open={visible}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ top: { xs: 16, sm: 24 }, right: { xs: 16, sm: 24 } }}
    >
      <Alert
        onClose={onClose}
        severity={typeMapping[type]}
        variant="filled"
        sx={{
          width: '100%',
          borderRadius: 3,
          boxShadow: 3,
          fontWeight: 500,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
