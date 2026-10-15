import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime, formatTime } from "./date-format";

describe("date-format (DATE_LOCALE = es-BO)", () => {
  const d = new Date(2026, 9, 12, 14, 5, 9); // 12 Oct 2026, local time

  it("formats day-first regardless of the browser language", () => {
    expect(formatDate(d)).toBe("12/10/2026");
  });

  it("accepts ISO strings and options", () => {
    expect(formatDate("2026-10-12T12:00:00", { day: "2-digit", month: "2-digit" })).toBe("12/10");
  });

  it("formats date-time and time", () => {
    expect(formatDateTime(d)).toContain("12/10/2026");
    expect(formatTime(d, { hour: "2-digit", minute: "2-digit", hour12: false })).toBe("14:05");
  });
});
