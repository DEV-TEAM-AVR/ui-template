import { describe, expect, it } from "vitest";
import { formatInteger, formatMoney, formatNumber, formatPercent, getNumberFormatter, parseNumber } from "./number-format";

describe("number-format (NUMBER_LOCALE = en-US)", () => {
  it("formats with comma thousands and dot decimals", () => {
    expect(formatNumber(1886735)).toBe("1,886,735.00");
    expect(formatNumber(-31947485.114)).toBe("-31,947,485.11");
    expect(formatNumber(1234.5, 0)).toBe("1,235");
    expect(formatNumber(0.12345, { min: 2, max: 4 })).toBe("0.1235");
    expect(formatInteger(844257)).toBe("844,257");
    expect(formatPercent(12.345)).toBe("12.3%");
    expect(getNumberFormatter({ max: 3 }).format(155868)).toBe("155,868");
  });

  it("formats bolivianos", () => {
    expect(formatMoney(1234.5)).toBe("Bs 1,234.50");
    expect(formatMoney(1234.5, 0)).toBe("Bs 1,235");
    expect(formatMoney(null)).toBe("");
  });

  it("renders nothing for missing values", () => {
    expect(formatNumber(null)).toBe("");
    expect(formatNumber(undefined, 0)).toBe("");
    expect(formatInteger(null)).toBe("");
    expect(formatPercent(undefined)).toBe("");
  });

  it("never prints -0", () => {
    expect(formatNumber(-0)).toBe("0.00");
    expect(formatNumber(-0.001)).toBe("0.00");
  });

  it("parses typed numbers in either convention", () => {
    expect(parseNumber("1,234.5")).toBe(1234.5);
    expect(parseNumber("1,234,567.89")).toBe(1234567.89);
    expect(parseNumber("1234.5")).toBe(1234.5);
    expect(parseNumber("-3.75")).toBe(-3.75);
    expect(parseNumber(" 7 ")).toBe(7);
    // A lone comma with 1–2 digits after it is a decimal typed the Bolivian way…
    expect(parseNumber("5,5")).toBe(5.5);
    expect(parseNumber("12,25")).toBe(12.25);
    // …with 3 digits it's a thousands separator.
    expect(parseNumber("1,234")).toBe(1234);
    expect(parseNumber("")).toBeNull();
    expect(parseNumber(null)).toBeNull();
    expect(parseNumber("abc")).toBeNull();
    expect(parseNumber("1.2.3")).toBeNull();
  });
});
