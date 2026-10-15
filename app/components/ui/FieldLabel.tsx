import React from "react";

/**
 * The one form-field label style (also used by <Input>). Put it right above the control;
 * `required` adds the red asterisk.
 */
export const fieldLabelClass =
  "block ml-1 mb-1 text-3xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400";

export function FieldLabel({
  children,
  required,
  htmlFor,
  className = "",
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={`${fieldLabelClass} ${className}`.trim()}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}
