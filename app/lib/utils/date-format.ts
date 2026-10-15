/**
 * Single source of truth for on-screen date/time display (companion to number-format.ts).
 *
 * A bare `date.toLocaleDateString()` follows each browser's language, so the same screen
 * showed "12/10/2026" on one PC and "10/12/2026" on another. These helpers pin the locale.
 * For pattern-based formatting ("dd 'de' MMMM yyyy") use date-fns `format` with the `es` locale.
 *
 * Not for machine dates: to build "YYYY-MM-DD" use toLocaleDateString("en-CA").
 */
export const DATE_LOCALE = "es-BO";

type DateInput = Date | string | number;

const toDate = (value: DateInput) => (value instanceof Date ? value : new Date(value));

/** "12/10/2026" (or per `options`, e.g. { day: "2-digit", month: "short" }). */
export function formatDate(value: DateInput, options?: Intl.DateTimeFormatOptions): string {
  return toDate(value).toLocaleDateString(DATE_LOCALE, options);
}

/** "12/10/2026, 14:05:09" (or per `options`). */
export function formatDateTime(value: DateInput, options?: Intl.DateTimeFormatOptions): string {
  return toDate(value).toLocaleString(DATE_LOCALE, options);
}

/** "14:05:09" (or per `options`, e.g. { hour: "2-digit", minute: "2-digit" }). */
export function formatTime(value: DateInput, options?: Intl.DateTimeFormatOptions): string {
  return toDate(value).toLocaleTimeString(DATE_LOCALE, options);
}
