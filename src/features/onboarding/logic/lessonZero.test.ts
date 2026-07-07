import { describe, expect, it } from "vitest";
import { createInitialCountryProgress } from "@/entities/progress/progress.types";
import {
  evaluateLessonZeroAnswer,
  getLessonZeroCountries,
  LESSON_ZERO_CORRECT_COUNTRY_ID,
  skipLessonZero,
} from "./lessonZero";

describe("lesson zero", () => {
  it("uses the real first flag countries", () => {
    expect(getLessonZeroCountries().map((country) => country.id)).toEqual(["br", "ar", "co", "mx"]);
  });

  it("rewards the initial Brazil answer with real XP and mastery progress", () => {
    const outcome = evaluateLessonZeroAnswer("br", undefined, "2026-07-07T12:00:00.000Z");

    expect(outcome.correctCountryId).toBe(LESSON_ZERO_CORRECT_COUNTRY_ID);
    expect(outcome.isCorrect).toBe(true);
    expect(outcome.xpGained).toBe(15);
    expect(outcome.accuracy).toBe(100);
    expect(outcome.masteryBefore).toBe("new");
    expect(outcome.masteryAfter).toBe("recognized");
    expect(outcome.countryProgress.countryId).toBe("br");
    expect(outcome.countryProgress.correctCount).toBe(1);
  });

  it("turns a miss into educational review without XP", () => {
    const previous = createInitialCountryProgress("br");
    const outcome = evaluateLessonZeroAnswer("mx", previous, "2026-07-07T12:00:00.000Z");

    expect(outcome.isCorrect).toBe(false);
    expect(outcome.xpGained).toBe(0);
    expect(outcome.accuracy).toBe(0);
    expect(outcome.countryProgress.needsReview).toBe(true);
    expect(outcome.countryProgress.confusions).toEqual({ mx: 1 });
  });

  it("can be skipped without granting XP or mastery progress", () => {
    const previous = createInitialCountryProgress("br");
    const outcome = skipLessonZero(previous, "2026-07-07T12:00:00.000Z");

    expect(outcome.wasSkipped).toBe(true);
    expect(outcome.selectedCountryId).toBeNull();
    expect(outcome.xpGained).toBe(0);
    expect(outcome.accuracy).toBe(0);
    expect(outcome.masteryBefore).toBe("new");
    expect(outcome.masteryAfter).toBe("new");
  });
});
