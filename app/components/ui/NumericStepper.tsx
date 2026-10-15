import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { FieldLabel } from "./FieldLabel";

interface NumericStepperProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  /** Amount the − / + buttons add or subtract. Typing is not limited by this. */
  step?: number;
  /** Decimal places kept when the buttons round; > 0 also lets the user type decimals. */
  decimals?: number;
  required?: boolean;
  placeholder?: string;
  error?: string;
}

export function NumericStepper({
  label,
  value,
  onChange,
  step = 1,
  decimals = 0,
  required = false,
  placeholder,
  error,
}: NumericStepperProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className={`flex items-center w-full border rounded-xl overflow-hidden bg-white dark:bg-zinc-950
        transition-all ${error 
          ? "border-red-400 ring-2 ring-red-400/20" 
          : "border-zinc-200 dark:border-zinc-700 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/20"
        }`}>
        <button
          type="button"
          onClick={() => onChange(Math.max(0, parseFloat((value - step).toFixed(decimals))))}
          className="shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 text-zinc-400
            hover:text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900 transition-colors text-lg select-none"
        >
          −
        </button>
        <input
          type="number"
          inputMode="decimal"
          value={value === 0 ? "" : value}
          min={0}
          step={decimals > 0 ? "any" : step}
          placeholder={placeholder ?? (decimals > 0 ? "0." + "0".repeat(decimals) : "0")}
          onChange={(e) => onChange(Math.max(0, parseFloat(e.target.value) || 0))}
          className="min-w-0 flex-1 text-center text-base font-bold text-zinc-800 dark:text-zinc-50 bg-transparent outline-none h-10 sm:h-12
            placeholder:font-normal placeholder:text-zinc-300"
        />
        <button
          type="button"
          onClick={() => onChange(parseFloat((value + step).toFixed(decimals)))}
          className="shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 text-zinc-400
            hover:text-zinc-900 hover:bg-zinc-50 active:bg-zinc-100 dark:hover:text-zinc-50 dark:hover:bg-zinc-900 transition-colors text-lg select-none"
        >
          +
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5 ml-1">
          <ErrorOutlineIcon sx={{ fontSize: 14 }} />
          {error}
        </p>
      )}
    </div>
  );
}
