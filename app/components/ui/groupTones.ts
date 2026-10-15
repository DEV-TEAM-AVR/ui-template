/**
 * Categorical tints for column-group headers in a GroupedGrid (MORTALIDAD / INGRESOS /
 * CONSUMO …). Each group in a grid gets a different tone so the eye can track a band of columns
 * down the page. These are data-category colors, not brand colors, which is why this is the
 * one file allowed to name hues (see eslint.config.mjs).
 *
 * Conventional meanings: red = losses/deaths, positive = inflows (follows the brand),
 * orange = outflows/transfers, amber/yellow = consumption/receptions, blue = production,
 * indigo = deliveries/sales, teal = measurements, neutral = anything else.
 */
export type GroupTone = "red" | "positive" | "orange" | "amber" | "yellow" | "blue" | "indigo" | "teal" | "neutral";

export const groupToneClass: Record<GroupTone, string> = {
  red: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400",
  positive: "bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400",
  orange: "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400",
  amber: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400",
  yellow: "bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400",
  blue: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400",
  indigo: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400",
  teal: "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400",
  neutral: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300",
};
