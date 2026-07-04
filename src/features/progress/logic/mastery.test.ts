import { describe, expect, it } from "vitest";
import {
  type CountryProgress,
  createInitialCountryProgress,
} from "@/entities/progress/progress.types";
import {
  applyAnswerToCountryProgress,
  deriveMasteryLevel,
  getMasteryRequirementStatus,
  MASTERY_BADGE_META,
  MAX_MASTERY_POINTS,
  masteryLevelForPoints,
} from "./mastery";

const T0 = "2026-07-03T10:00:00.000Z";
const T1 = "2026-07-03T10:01:00.000Z";
const T2 = "2026-07-03T10:02:00.000Z";

function masterReady(overrides: Partial<CountryProgress> = {}): CountryProgress {
  const progress = createInitialCountryProgress("br");
  return {
    ...progress,
    seenCount: 24,
    correctCount: 22,
    wrongCount: 2,
    masteryPoints: 90,
    masteryLevel: "dominated",
    needsReview: false,
    correctDateKeys: ["2026-07-01", "2026-07-02", "2026-07-03"],
    typedCorrectCount: 2,
    choiceCorrectCount: 12,
    reviewCorrectCount: 2,
    successfulReviews: 2,
    lastCorrectAt: "2026-07-03T09:00:00.000Z",
    lastWrongAt: "2026-07-01T09:00:00.000Z",
    ...overrides,
  };
}

describe("masteryLevelForPoints", () => {
  it("maps the new 0-100 point ranges without granting master by points alone", () => {
    expect(MAX_MASTERY_POINTS).toBe(100);
    expect(masteryLevelForPoints(0)).toBe("new");
    expect(masteryLevelForPoints(1)).toBe("recognized");
    expect(masteryLevelForPoints(19)).toBe("recognized");
    expect(masteryLevelForPoints(20)).toBe("learned");
    expect(masteryLevelForPoints(49)).toBe("learned");
    expect(masteryLevelForPoints(50)).toBe("dominated");
    expect(masteryLevelForPoints(85)).toBe("dominated");
    expect(masteryLevelForPoints(100)).toBe("dominated");
  });
});

describe("deriveMasteryLevel", () => {
  it("does not grant master with 100 points but missing real evidence", () => {
    const progress = masterReady({
      masteryPoints: 100,
      correctDateKeys: ["2026-07-03"],
      typedCorrectCount: 0,
    });
    expect(deriveMasteryLevel(progress)).toBe("dominated");
    expect(getMasteryRequirementStatus(progress).missing).toContain("correctDays");
    expect(getMasteryRequirementStatus(progress).missing).toContain("typedCorrect");
  });

  it("blocks master while review is pending or a recent wrong answer exists", () => {
    expect(deriveMasteryLevel(masterReady({ needsReview: true }))).toBe("dominated");
    expect(
      deriveMasteryLevel(
        masterReady({
          lastCorrectAt: "2026-07-02T09:00:00.000Z",
          lastWrongAt: "2026-07-03T09:00:00.000Z",
        }),
      ),
    ).toBe("dominated");
  });

  it("grants master only when every Platinum requirement is met", () => {
    expect(deriveMasteryLevel(masterReady())).toBe("master");
  });
});

describe("applyAnswerToCountryProgress", () => {
  it("awards fewer points for choice than typing or review", () => {
    const start = createInitialCountryProgress("br");
    const choice = applyAnswerToCountryProgress(start, {
      isCorrect: true,
      answeredAt: T0,
      localDateKey: "2026-07-03",
      questionType: "choice",
    });
    const typing = applyAnswerToCountryProgress(start, {
      isCorrect: true,
      answeredAt: T0,
      localDateKey: "2026-07-03",
      questionType: "typing",
    });
    const review = applyAnswerToCountryProgress(start, {
      isCorrect: true,
      answeredAt: T0,
      localDateKey: "2026-07-03",
      mode: "review",
    });
    expect(choice.masteryPoints).toBe(2);
    expect(typing.masteryPoints).toBe(4);
    expect(review.masteryPoints).toBe(5);
  });

  it("tracks evidence by question type and mode", () => {
    let progress = createInitialCountryProgress("br");
    progress = applyAnswerToCountryProgress(progress, {
      isCorrect: true,
      answeredAt: T0,
      localDateKey: "2026-07-03",
      mode: "similar",
      questionType: "typing",
    });
    expect(progress.typedCorrectCount).toBe(1);
    expect(progress.similarCorrectCount).toBe(1);
    expect(progress.correctDateKeys).toEqual(["2026-07-03"]);

    progress = applyAnswerToCountryProgress(progress, {
      isCorrect: true,
      answeredAt: T1,
      localDateKey: "2026-07-04",
      mode: "survival",
    });
    expect(progress.choiceCorrectCount).toBe(1);
    expect(progress.survivalCorrectCount).toBe(1);
    expect(progress.correctDateKeys).toEqual(["2026-07-03", "2026-07-04"]);
  });

  it("adds a bonus and successful review when a due review is answered correctly", () => {
    const start = {
      ...createInitialCountryProgress("br"),
      seenCount: 1,
      nextReviewAt: "2026-07-02",
    };
    const after = applyAnswerToCountryProgress(start, {
      isCorrect: true,
      answeredAt: T0,
      localDateKey: "2026-07-03",
      mode: "review",
    });
    expect(after.masteryPoints).toBe(8);
    expect(after.reviewCorrectCount).toBe(1);
    expect(after.successfulReviews).toBe(1);
    expect(after.nextReviewAt).toBe("2026-07-04");
  });

  it("marks review and schedules it for today on errors", () => {
    const after = applyAnswerToCountryProgress(createInitialCountryProgress("br"), {
      isCorrect: false,
      answeredAt: T0,
      localDateKey: "2026-07-03",
    });
    expect(after.needsReview).toBe(true);
    expect(after.nextReviewAt).toBe("2026-07-03");
  });

  it("removes more points from dominated countries and suspends master", () => {
    const dominated = applyAnswerToCountryProgress(
      masterReady({ masteryPoints: 70, masteryLevel: "dominated" }),
      {
        isCorrect: false,
        answeredAt: T1,
        localDateKey: "2026-07-03",
      },
    );
    expect(dominated.masteryPoints).toBe(66);
    expect(dominated.needsReview).toBe(true);

    const master = applyAnswerToCountryProgress(
      { ...masterReady(), masteryLevel: "master" },
      {
        isCorrect: false,
        answeredAt: T2,
        localDateKey: "2026-07-03",
      },
    );
    expect(master.masteryPoints).toBe(82);
    expect(master.masteryLevel).toBe("dominated");
    expect(master.needsReview).toBe(true);
  });

  it("keeps the old recent double-wrong behavior safe", () => {
    let progress = createInitialCountryProgress("br");
    progress = applyAnswerToCountryProgress(progress, {
      isCorrect: true,
      answeredAt: T0,
      localDateKey: "2026-07-03",
    });
    progress = applyAnswerToCountryProgress(progress, {
      isCorrect: false,
      answeredAt: T1,
      localDateKey: "2026-07-03",
    });
    const after = applyAnswerToCountryProgress(progress, {
      isCorrect: false,
      answeredAt: T2,
      localDateKey: "2026-07-03",
    });
    expect(after.masteryPoints).toBe(0);
    expect(after.masteryLevel).toBe("new");
  });

  it("clamps points between 0 and 100", () => {
    let progress = createInitialCountryProgress("br");
    for (let i = 0; i < 40; i++) {
      progress = applyAnswerToCountryProgress(progress, {
        isCorrect: true,
        answeredAt: T0,
        localDateKey: `2026-07-${String((i % 9) + 1).padStart(2, "0")}`,
        questionType: "typing",
      });
    }
    expect(progress.masteryPoints).toBe(100);

    const afterWrong = applyAnswerToCountryProgress(createInitialCountryProgress("jp"), {
      isCorrect: false,
      answeredAt: T1,
      localDateKey: "2026-07-03",
    });
    expect(afterWrong.masteryPoints).toBe(0);
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

describe("badge metadata", () => {
  it("defines visual metadata for every mastery level", () => {
    expect(Object.keys(MASTERY_BADGE_META).sort()).toEqual(
      ["dominated", "learned", "master", "new", "recognized"].sort(),
    );
    expect(MASTERY_BADGE_META.recognized.tier).toBe("bronze");
    expect(MASTERY_BADGE_META.learned.tier).toBe("silver");
    expect(MASTERY_BADGE_META.dominated.tier).toBe("gold");
    expect(MASTERY_BADGE_META.master.tier).toBe("platinum");
  });
});
