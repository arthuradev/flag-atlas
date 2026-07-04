import { describe, expect, it } from "vitest";
import { createInitialCountryProgress } from "@/entities/progress/progress.types";
import { applyAnswerToCountryProgress, masteryLevelForPoints } from "./mastery";

const T0 = "2026-07-03T10:00:00.000Z";
const T1 = "2026-07-03T10:01:00.000Z";
const T2 = "2026-07-03T10:02:00.000Z";

describe("masteryLevelForPoints", () => {
  it("maps point ranges to public levels", () => {
    expect(masteryLevelForPoints(0)).toBe("new");
    expect(masteryLevelForPoints(1)).toBe("recognized");
    expect(masteryLevelForPoints(2)).toBe("recognized");
    expect(masteryLevelForPoints(3)).toBe("learned");
    expect(masteryLevelForPoints(5)).toBe("learned");
    expect(masteryLevelForPoints(6)).toBe("dominated");
    expect(masteryLevelForPoints(8)).toBe("dominated");
    expect(masteryLevelForPoints(9)).toBe("master");
    expect(masteryLevelForPoints(10)).toBe("master");
  });
});

describe("applyAnswerToCountryProgress", () => {
  it("promotes on correct answers", () => {
    const start = createInitialCountryProgress("br");
    const after = applyAnswerToCountryProgress(start, { isCorrect: true, answeredAt: T0 });
    expect(after.masteryPoints).toBe(1);
    expect(after.masteryLevel).toBe("recognized");
    expect(after.correctCount).toBe(1);
    expect(after.currentCorrectStreak).toBe(1);
    expect(after.needsReview).toBe(false);
  });

  it("marks review without removing points on a single error", () => {
    let progress = createInitialCountryProgress("br");
    for (let i = 0; i < 3; i++) {
      progress = applyAnswerToCountryProgress(progress, { isCorrect: true, answeredAt: T0 });
    }
    const after = applyAnswerToCountryProgress(progress, { isCorrect: false, answeredAt: T1 });
    expect(after.masteryPoints).toBe(3);
    expect(after.needsReview).toBe(true);
    expect(after.currentCorrectStreak).toBe(0);
  });

  it("removes one point after two recent errors", () => {
    let progress = createInitialCountryProgress("br");
    for (let i = 0; i < 3; i++) {
      progress = applyAnswerToCountryProgress(progress, { isCorrect: true, answeredAt: T0 });
    }
    progress = applyAnswerToCountryProgress(progress, { isCorrect: false, answeredAt: T1 });
    const after = applyAnswerToCountryProgress(progress, { isCorrect: false, answeredAt: T2 });
    expect(after.masteryPoints).toBe(2);
    expect(after.masteryLevel).toBe("recognized");
    expect(after.needsReview).toBe(true);
  });

  it("does not demote when an error follows a correct answer", () => {
    let progress = createInitialCountryProgress("br");
    progress = applyAnswerToCountryProgress(progress, { isCorrect: true, answeredAt: T0 });
    progress = applyAnswerToCountryProgress(progress, { isCorrect: false, answeredAt: T1 });
    progress = applyAnswerToCountryProgress(progress, { isCorrect: true, answeredAt: T1 });
    const after = applyAnswerToCountryProgress(progress, { isCorrect: false, answeredAt: T2 });
    expect(after.masteryPoints).toBe(2);
  });

  it("clears review after a correct answer", () => {
    let progress = createInitialCountryProgress("br");
    progress = applyAnswerToCountryProgress(progress, { isCorrect: false, answeredAt: T0 });
    expect(progress.needsReview).toBe(true);
    progress = applyAnswerToCountryProgress(progress, { isCorrect: true, answeredAt: T1 });
    expect(progress.needsReview).toBe(false);
  });

  it("clamps points between 0 and 10", () => {
    let progress = createInitialCountryProgress("br");
    for (let i = 0; i < 15; i++) {
      progress = applyAnswerToCountryProgress(progress, { isCorrect: true, answeredAt: T0 });
    }
    expect(progress.masteryPoints).toBe(10);
    expect(progress.masteryLevel).toBe("master");

    let fresh = createInitialCountryProgress("jp");
    for (let i = 0; i < 5; i++) {
      fresh = applyAnswerToCountryProgress(fresh, { isCorrect: false, answeredAt: T1 });
    }
    expect(fresh.masteryPoints).toBe(0);
    expect(fresh.masteryLevel).toBe("new");
  });

  it("tracks the best streak", () => {
    let progress = createInitialCountryProgress("br");
    for (let i = 0; i < 4; i++) {
      progress = applyAnswerToCountryProgress(progress, { isCorrect: true, answeredAt: T0 });
    }
    progress = applyAnswerToCountryProgress(progress, { isCorrect: false, answeredAt: T1 });
    progress = applyAnswerToCountryProgress(progress, { isCorrect: true, answeredAt: T2 });
    expect(progress.bestCorrectStreak).toBe(4);
    expect(progress.currentCorrectStreak).toBe(1);
  });
});

describe("confusion tracking", () => {
  it("records which country the user confused the flag with", () => {
    let progress = createInitialCountryProgress("td");
    progress = applyAnswerToCountryProgress(progress, {
      isCorrect: false,
      answeredAt: T0,
      confusedWithCountryId: "ro",
    });
    progress = applyAnswerToCountryProgress(progress, {
      isCorrect: false,
      answeredAt: T1,
      confusedWithCountryId: "ro",
    });
    progress = applyAnswerToCountryProgress(progress, {
      isCorrect: false,
      answeredAt: T2,
      confusedWithCountryId: "sn",
    });
    expect(progress.confusions).toEqual({ ro: 2, sn: 1 });
  });

  it("keeps confusions untouched on correct answers and errors without selection", () => {
    let progress = createInitialCountryProgress("td");
    progress = applyAnswerToCountryProgress(progress, {
      isCorrect: false,
      answeredAt: T0,
      confusedWithCountryId: "ro",
    });
    progress = applyAnswerToCountryProgress(progress, { isCorrect: true, answeredAt: T1 });
    progress = applyAnswerToCountryProgress(progress, { isCorrect: false, answeredAt: T2 });
    expect(progress.confusions).toEqual({ ro: 1 });
  });

  it("ignores self-confusion", () => {
    const progress = applyAnswerToCountryProgress(createInitialCountryProgress("td"), {
      isCorrect: false,
      answeredAt: T0,
      confusedWithCountryId: "td",
    });
    expect(progress.confusions).toBeUndefined();
  });
});
