import React from "react";
import { TextField, MenuItem, TextFieldProps } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { FieldLabel } from "./FieldLabel";

interface SelectOption {
  value: string;
  label: string;
}

type SelectProps = Omit<TextFieldProps, 'error'> & {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
};

export const Select = ({
  label,
  error,
  options,
  placeholder = "Seleccionar...",
  id,
  className = "",
  size = "small",
  variant = "outlined",
  required,
  ...props
}: SelectProps) => {
  const selectId = id || `select-field-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={className}>
      {label && (
        <FieldLabel htmlFor={selectId} required={required}>
          {label}
        </FieldLabel>
      )}
      <TextField
        select
        id={selectId}
        error={!!error}
        helperText={error ? (
          <span className="flex items-center gap-1">
            <ErrorOutlineIcon sx={{ fontSize: 14 }} className="shrink-0" />
            {error}
          </span>
        ) : null}
        variant={variant}
        size={size}
        fullWidth
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 3, // rounded-xl (~12px)
            backgroundColor: 'var(--mui-input-bg)',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'zinc.200',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'zinc.300',
          },
          ...props.sx
        }}
        {...props}
      >
        <MenuItem value="">
          <em>{placeholder}</em>
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};
