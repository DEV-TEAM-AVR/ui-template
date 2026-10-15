/**
 * Single source of truth for on-screen number formatting (and parsing of typed numbers).
 *
 * Change `NUMBER_LOCALE` to switch every screen that formats through this module: today
 * "en-US" → thousands with comma, decimals with dot (1,886,735.00). Excel exports are not
 * affected: they write raw numeric cell values and Excel applies the viewer's own regional
 * settings.
 *
 * Never use the formatted string for a value that round-trips through parseFloat/Number()
 * or feeds a native <input type="number"> — use `parseNumber` to read typed text back.
 */
export const NUMBER_LOCALE = "en-US";

/** Prefix formatMoney puts before the amount ("Bs 1,234.50"). Per project. */
export const CURRENCY_PREFIX = "Bs";

export interface NumberFormatOptions {
  /** Minimum decimals (default 0). */
  min?: number;
  /** Maximum decimals (default = min). */
  max?: number;
  /** Thousands grouping (default true). */
  grouping?: boolean;
}

// `toLocaleString(locale, options)` builds a fresh Intl.NumberFormat on every call — costly
// when a table formats thousands of cells. One cached formatter per option set.
const formatters = new Map<string, Intl.NumberFormat>();

/** Cached Intl.NumberFormat for the app locale — for hot loops / table cells. */
export function getNumberFormatter({ min = 0, max, grouping = true }: NumberFormatOptions = {}): Intl.NumberFormat {
  const maxD = Math.max(min, max ?? min);
  const key = `${min}|${maxD}|${grouping ? 1 : 0}`;
  let fmt = formatters.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(NUMBER_LOCALE, {
      minimumFractionDigits: min,
      maximumFractionDigits: maxD,
      useGrouping: grouping,
    });
    formatters.set(key, fmt);
  }
  return fmt;
}

/** -0 (and values that round to -0) would print as "-0.00": normalize to 0. */
const sinMenosCero = (value: number, maxDecimals: number) => {
  if (value === 0) return 0;
  const f = 10 ** maxDecimals;
  return Math.round(Math.abs(value) * f) === 0 ? 0 : value;
};

/**
 * Formats a number in the app locale.
 *   formatNumber(1234.5)              → "1,234.50"   (2 fixed decimals)
 *   formatNumber(1234.5, 0)           → "1,235"
 *   formatNumber(0.12345, { min: 2, max: 4 }) → "0.1235"
 *   formatNumber(null)                → ""          (nothing to show — same as `x?.toLocaleString()`)
 */
export function formatNumber(value: number | null | undefined, decimals: number | NumberFormatOptions = 2): string {
  if (value == null) return "";
  const opts = typeof decimals === "number" ? { min: decimals, max: decimals } : decimals;
  const fmt = getNumberFormatter(opts);
  const max = Math.max(opts.min ?? 0, opts.max ?? opts.min ?? 0);
  return fmt.format(sinMenosCero(value, max));
}

/** Whole number with thousands separator ("12,345"). */
export function formatInteger(value: number | null | undefined): string {
  return formatNumber(value, 0);
}

/** Money: "Bs 1,234.50" (decimals default 2). Use instead of Intl currency formatters. */
export function formatMoney(value: number | null | undefined, decimals = 2): string {
  if (value == null) return "";
  return `${CURRENCY_PREFIX} ${formatNumber(value, decimals)}`;
}

export function formatPercent(value: number | null | undefined, decimals = 1): string {
  if (value == null) return "";
  return `${formatNumber(value, decimals)}%`;
}

// Separators of the app locale, read from Intl so they follow NUMBER_LOCALE.
const partes = new Intl.NumberFormat(NUMBER_LOCALE).formatToParts(12345.6);
const SEP_MILES = partes.find((p) => p.type === "group")?.value ?? ",";
const SEP_DECIMAL = partes.find((p) => p.type === "decimal")?.value ?? ".";

/**
 * Reads a number typed by the user, tolerant to the app locale:
 *   "1,234.5" → 1234.5 · "1234.5" → 1234.5 · "5,5" → 5.5 (a lone separator with 1–2 digits
 *   after it, typed with the other convention, is taken as the decimal) · "" / junk → null.
 */
export function parseNumber(text: string | null | undefined): number | null {
  let t = (text ?? "").trim().replace(/\s/g, "");
  if (!t) return null;
  const otroSep = SEP_DECIMAL === "." ? "," : ".";
  // Separador "del otro sistema" como decimal: aparece una sola vez, sin el decimal propio, y
  // con 1–2 dígitos después (con 3 es más probable que sea un separador de miles).
  const unSoloOtro = t.split(otroSep).length === 2 && !t.includes(SEP_DECIMAL) && /^\d{1,2}$/.test(t.split(otroSep)[1]);
  if (otroSep === SEP_MILES && unSoloOtro) {
    t = t.replace(otroSep, ".");
  } else {
    t = t.split(SEP_MILES).join("");
    if (SEP_DECIMAL !== ".") t = t.replace(SEP_DECIMAL, ".");
  }
  if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}
