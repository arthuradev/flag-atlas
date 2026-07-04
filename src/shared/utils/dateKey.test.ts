import { describe, expect, it } from "vitest";
import { dateKeyDiffInDays, getLocalDateKey, isDateKey } from "./dateKey";

describe("getLocalDateKey", () => {
  it("formats a date as YYYY-MM-DD in local time", () => {
    expect(getLocalDateKey(new Date(2026, 6, 4, 23, 59))).toBe("2026-07-04");
    expect(getLocalDateKey(new Date(2026, 0, 9, 0, 0))).toBe("2026-01-09");
  });
});

describe("isDateKey", () => {
  it("accepts only YYYY-MM-DD strings", () => {
    expect(isDateKey("2026-07-04")).toBe(true);
    expect(isDateKey("2026-7-4")).toBe(false);
    expect(isDateKey("04/07/2026")).toBe(false);
    expect(isDateKey(20260704)).toBe(false);
    expect(isDateKey(undefined)).toBe(false);
  });
});

describe("dateKeyDiffInDays", () => {
  it("computes whole-day differences", () => {
    expect(dateKeyDiffInDays("2026-07-03", "2026-07-04")).toBe(1);
    expect(dateKeyDiffInDays("2026-07-04", "2026-07-04")).toBe(0);
    expect(dateKeyDiffInDays("2026-07-04", "2026-07-03")).toBe(-1);
  });

  it("crosses month and year boundaries", () => {
    expect(dateKeyDiffInDays("2026-01-31", "2026-02-01")).toBe(1);
    expect(dateKeyDiffInDays("2025-12-31", "2026-01-01")).toBe(1);
    expect(dateKeyDiffInDays("2026-02-28", "2026-03-01")).toBe(1);
  });

  it("returns NaN for invalid keys", () => {
    expect(dateKeyDiffInDays("hoje", "2026-07-04")).toBeNaN();
    expect(dateKeyDiffInDays("2026-07-04", "")).toBeNaN();
  });
});
