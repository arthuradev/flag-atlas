import { describe, expect, it } from "vitest";
import { createInitialDailyStreak, type DailyStreak } from "@/entities/progress/progress.types";
import { getDailyStreakStatus, MAX_REST_DAYS, registerActiveDay } from "./dailyStreak";

function streakOf(overrides: Partial<DailyStreak>): DailyStreak {
  return { ...createInitialDailyStreak(), ...overrides };
}

describe("registerActiveDay", () => {
  it("starts the streak on the first active day", () => {
    const update = registerActiveDay(createInitialDailyStreak(), "2026-07-04");
    expect(update.streak.currentStreak).toBe(1);
    expect(update.streak.bestStreak).toBe(1);
    expect(update.streak.lastActiveDate).toBe("2026-07-04");
    expect(update.countedToday).toBe(true);
    expect(update.usedRestDay).toBe(false);
  });

  it("does not count the same day twice", () => {
    const first = registerActiveDay(createInitialDailyStreak(), "2026-07-04");
    const second = registerActiveDay(first.streak, "2026-07-04");
    expect(second.streak).toEqual(first.streak);
    expect(second.countedToday).toBe(false);
  });

  it("increments on the following day", () => {
    const streak = streakOf({ currentStreak: 3, bestStreak: 5, lastActiveDate: "2026-07-03" });
    const update = registerActiveDay(streak, "2026-07-04");
    expect(update.streak.currentStreak).toBe(4);
    expect(update.streak.bestStreak).toBe(5);
    expect(update.countedToday).toBe(true);
  });

  it("uses the rest day to cover a single skipped day", () => {
    const streak = streakOf({
      currentStreak: 3,
      bestStreak: 3,
      lastActiveDate: "2026-07-02",
      restDaysAvailable: 1,
    });
    const update = registerActiveDay(streak, "2026-07-04");
    expect(update.streak.currentStreak).toBe(4);
    expect(update.streak.restDaysAvailable).toBe(0);
    expect(update.usedRestDay).toBe(true);
  });

  it("restarts gently after a skipped day without rest available", () => {
    const streak = streakOf({
      currentStreak: 9,
      bestStreak: 9,
      lastActiveDate: "2026-07-02",
      restDaysAvailable: 0,
    });
    const update = registerActiveDay(streak, "2026-07-04");
    expect(update.streak.currentStreak).toBe(1);
    expect(update.streak.bestStreak).toBe(9);
    // Recomeço devolve o descanso: sem punição dupla.
    expect(update.streak.restDaysAvailable).toBe(MAX_REST_DAYS);
    expect(update.usedRestDay).toBe(false);
  });

  it("restarts after a long break and keeps bestStreak", () => {
    const streak = streakOf({ currentStreak: 30, bestStreak: 30, lastActiveDate: "2026-05-01" });
    const update = registerActiveDay(streak, "2026-07-04");
    expect(update.streak.currentStreak).toBe(1);
    expect(update.streak.bestStreak).toBe(30);
  });

  it("recharges the rest day every 7 active days", () => {
    let streak = streakOf({
      currentStreak: 5,
      bestStreak: 5,
      lastActiveDate: "2026-07-01",
      restDaysAvailable: 0,
    });
    streak = registerActiveDay(streak, "2026-07-02").streak; // 6
    expect(streak.restDaysAvailable).toBe(0);
    streak = registerActiveDay(streak, "2026-07-03").streak; // 7 -> recarrega
    expect(streak.currentStreak).toBe(7);
    expect(streak.restDaysAvailable).toBe(MAX_REST_DAYS);
  });

  it("updates bestStreak when the current streak passes it", () => {
    const streak = streakOf({ currentStreak: 5, bestStreak: 5, lastActiveDate: "2026-07-03" });
    const update = registerActiveDay(streak, "2026-07-04");
    expect(update.streak.bestStreak).toBe(6);
  });

  it("treats a backwards clock as an already counted day", () => {
    const streak = streakOf({ currentStreak: 2, bestStreak: 2, lastActiveDate: "2026-07-04" });
    const update = registerActiveDay(streak, "2026-07-03");
    expect(update.streak).toEqual(streak);
    expect(update.countedToday).toBe(false);
  });
});

describe("getDailyStreakStatus", () => {
  it("returns none without history", () => {
    expect(getDailyStreakStatus(createInitialDailyStreak(), "2026-07-04")).toBe("none");
  });

  it("returns activeToday when today already counted", () => {
    const streak = streakOf({ currentStreak: 2, lastActiveDate: "2026-07-04" });
    expect(getDailyStreakStatus(streak, "2026-07-04")).toBe("activeToday");
  });

  it("returns alive on the next day, or one skipped day with rest", () => {
    const streak = streakOf({ currentStreak: 2, lastActiveDate: "2026-07-03" });
    expect(getDailyStreakStatus(streak, "2026-07-04")).toBe("alive");
    const rested = streakOf({
      currentStreak: 2,
      lastActiveDate: "2026-07-02",
      restDaysAvailable: 1,
    });
    expect(getDailyStreakStatus(rested, "2026-07-04")).toBe("alive");
  });

  it("returns expired after the streak is out of reach", () => {
    const streak = streakOf({
      currentStreak: 2,
      lastActiveDate: "2026-07-01",
      restDaysAvailable: 0,
    });
    expect(getDailyStreakStatus(streak, "2026-07-04")).toBe("expired");
  });
});
