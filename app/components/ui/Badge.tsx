import React from "react";
import { Chip, ChipProps } from "@mui/material";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantMapping: Record<BadgeVariant, { color: ChipProps["color"]; variant: ChipProps["variant"] }> = {
  default: { color: "default", variant: "outlined" },
  success: { color: "success", variant: "outlined" },
  warning: { color: "warning", variant: "outlined" },
  danger: { color: "error", variant: "outlined" },
  info: { color: "info", variant: "outlined" },
};

export const Badge = ({
  children,
  variant = "default",
  className = "",
}: BadgeProps) => {
  const muiProps = variantMapping[variant];

  return (
    <Chip
      label={children}
      size="small"
      color={muiProps.color}
      variant={muiProps.variant}
      className={className}
      sx={{
        height: '20px',
        fontSize: '0.7rem',
        fontWeight: 600,
        borderRadius: '6px',
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );
};
