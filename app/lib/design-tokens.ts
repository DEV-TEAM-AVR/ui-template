/**
 * Design tokens for code that can't use Tailwind classes (MUI theme, recharts, canvas).
 * Keep in sync with the BRAND block in app/globals.css — see docs/ui-standards.md.
 *
 * Rebranding: change the hex values below AND the `--color-brand-*` / `--color-accent*`
 * lines in globals.css. Nothing else in the codebase names a hue directly.
 */
export const colors = {
  primary: "#059669", // brand-600 (emerald-600)
  primaryHover: "#047857", // brand-700
  primaryLight: "#34d399", // brand-400
  primaryDark: "#065f46", // brand-800
  danger: "#dc2626", // red-600
  dangerHover: "#b91c1c", // red-700
  warning: "#f59e0b", // amber-500
  success: "#10b981", // emerald-500 (stays green even if the brand isn't)
  info: "#2563eb", // blue-600
  accent: "#2563eb", // accent (blue-600)
  accentHover: "#1d4ed8", // blue-700
  neutral: "#3f3f46", // zinc-700
} as const;

/** Radii in px (Tailwind: rounded-control / rounded-card / rounded-dialog). */
export const radius = {
  control: 12,
  card: 16,
  dialog: 24,
} as const;
