import React from "react";
import { TextField, TextFieldProps, InputAdornment } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { FieldLabel } from "./FieldLabel";

type InputProps = Omit<TextFieldProps, 'error'> & {
  label?: string;
  error?: string;
  helperText?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  readOnly?: boolean;
  required?: boolean;
};

export const Input = ({
  label,
  error,
  helperText,
  id,
  className = "",
  variant = "outlined",
  size = "small",
  min,
  max,
  step,
  readOnly,
  required,
  type,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  if (type === "date") {
    return (
      <div className={className}>
        {label && (
        <FieldLabel htmlFor={inputId} required={required}>
          {label}
        </FieldLabel>
      )}
        <input
          id={inputId}
          type="date"
          lang="es-BO"
          min={min}
          max={max}
          required={required}
          readOnly={readOnly}
          disabled={(props as any).disabled}
          value={props.value as any}
          onChange={props.onChange as any}
          onClick={(e) => {
            // The real tap already opens the native picker on every browser; this
            // is just a best-effort nudge for browsers where a click alone doesn't.
            try { (e.currentTarget as any).showPicker?.(); } catch {}
          }}
          className={`w-full p-2.5 bg-white dark:bg-zinc-950 border rounded-xl font-bold text-sm min-h-9.5 transition-all outline-none
            scheme-light dark:scheme-dark disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-500 ring-4 ring-red-500/10" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"}`}
        />
        {error && (
          <span className="flex items-center gap-1 text-2xs text-red-500 mt-1">
            <ErrorOutlineIcon sx={{ fontSize: 14 }} className="shrink-0" />
            {error}
          </span>
        )}
        {!error && helperText && (
          <span className="text-xs text-zinc-400 dark:text-zinc-400 mt-1 block">{helperText}</span>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {label && (
        <FieldLabel htmlFor={inputId} required={required}>
          {label}
        </FieldLabel>
      )}
      <TextField
        id={inputId}
        error={!!error}
        type={inputType}
        inputProps={{
          min, max, step, readOnly,
          ...(inputType === "number" ? { onWheel: (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur() } : {}),
          ...props.inputProps
        }}
        helperText={error ? (
          <span className="flex items-center gap-1">
            <ErrorOutlineIcon sx={{ fontSize: 14 }} className="shrink-0" />
            {error}
          </span>
        ) : helperText}
        variant={variant}
        size={size}
        fullWidth
        InputProps={{
          ...props.InputProps,
          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </InputAdornment>
          ) : props.InputProps?.endAdornment,
        }}
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
      />
    </div>
  );
};
