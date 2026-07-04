import { describe, expect, it } from "vitest";
import type { DailyMission } from "@/entities/mission/mission.types";
import {
  applyAnswerToMissions,
  applySessionToMissions,
  diffCompletedMissions,
  generateDailyMissions,
  MISSIONS_PER_DAY,
  type MissionAnswerEvent,
  type MissionSessionEvent,
} from "./dailyMissions";

const T0 = "2026-07-04T12:00:00.000Z";

function mission(overrides: Partial<DailyMission>): DailyMission {
  return {
    id: "2026-07-04:correctAnswers",
    type: "correctAnswers",
    target: 10,
    progress: 0,
    completed: false,
    rewardXp: 15,
    ...overrides,
  };
}

function answer(overrides: Partial<MissionAnswerEvent>): MissionAnswerEvent {
  return { isCorrect: true, mode: "continue", promoted: false, sessionStreak: 1, ...overrides };
}

function session(overrides: Partial<MissionSessionEvent>): MissionSessionEvent {
  return {
    mode: "continue",
    questionType: "choice",
    accuracy: 80,
    questionCount: 10,
    ...overrides,
  };
}

describe("generateDailyMissions", () => {
  it("generates the fixed daily amount, starting with completeSession", () => {
    const state = generateDailyMissions("2026-07-04");
    expect(state.date).toBe("2026-07-04");
    expect(state.missions).toHaveLength(MISSIONS_PER_DAY);
    expect(state.missions[0]?.type).toBe("completeSession");
    for (const entry of state.missions) {
      expect(entry.progress).toBe(0);
      expect(entry.completed).toBe(false);
      expect(entry.id.startsWith("2026-07-04:")).toBe(true);
    }
  });

  it("is deterministic for the same day", () => {
    const first = generateDailyMissions("2026-07-04");
    const second = generateDailyMissions("2026-07-04");
    expect(second).toEqual(first);
  });

  it("rotates missions across days", () => {
    const seen = new Set<string>();
    for (let day = 1; day <= 30; day++) {
      const key = `2026-07-${String(day).padStart(2, "0")}`;
      const types = generateDailyMissions(key)
        .missions.map((entry) => entry.type)
        .join(",");
      seen.add(types);
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it("never repeats a mission type within the same day", () => {
    for (let day = 1; day <= 30; day++) {
      const key = `2026-06-${String(day).padStart(2, "0")}`;
      const types = generateDailyMissions(key).missions.map((entry) => entry.type);
      expect(new Set(types).size).toBe(types.length);
    }
  });
});

describe("applyAnswerToMissions", () => {
  it("advances correctAnswers only on correct answers", () => {
    const missions = [mission({})];
    const afterWrong = applyAnswerToMissions(missions, answer({ isCorrect: false }), T0);
    expect(afterWrong[0]?.progress).toBe(0);
    const afterCorrect = applyAnswerToMissions(missions, answer({}), T0);
    expect(afterCorrect[0]?.progress).toBe(1);
  });

  it("advances reviewAnswers only in review sessions", () => {
    const missions = [mission({ type: "reviewAnswers", target: 3 })];
    expect(applyAnswerToMissions(missions, answer({}), T0)[0]?.progress).toBe(0);
    expect(applyAnswerToMissions(missions, answer({ mode: "review" }), T0)[0]?.progress).toBe(1);
  });

  it("advances masteryUp when the answer promotes a country", () => {
    const missions = [mission({ type: "masteryUp", target: 1 })];
    const result = applyAnswerToMissions(missions, answer({ promoted: true }), T0);
    expect(result[0]?.completed).toBe(true);
    expect(result[0]?.completedAt).toBe(T0);
  });

  it("tracks answerStreak as best-of-day, not a sum", () => {
    const missions = [mission({ type: "answerStreak", target: 5, progress: 3 })];
    expect(applyAnswerToMissions(missions, answer({ sessionStreak: 2 }), T0)[0]?.progress).toBe(3);
    expect(applyAnswerToMissions(missions, answer({ sessionStreak: 4 }), T0)[0]?.progress).toBe(4);
    const done = applyAnswerToMissions(missions, answer({ sessionStreak: 7 }), T0);
    expect(done[0]?.progress).toBe(5);
    expect(done[0]?.completed).toBe(true);
  });

  it("completes on reaching the target and never goes past it", () => {
    const missions = [mission({ progress: 9 })];
    const done = applyAnswerToMissions(missions, answer({}), T0);
    expect(done[0]?.progress).toBe(10);
    expect(done[0]?.completed).toBe(true);
    const after = applyAnswerToMissions(done, answer({}), T0);
    expect(after[0]?.progress).toBe(10);
    expect(after[0]?.completedAt).toBe(T0);
  });
});

describe("applySessionToMissions", () => {
  it("completes completeSession on any finished session", () => {
    const missions = [mission({ type: "completeSession", target: 1, rewardXp: 10 })];
    const result = applySessionToMissions(missions, session({}), T0);
    expect(result[0]?.completed).toBe(true);
  });

  it("advances typingSession and similarSession by kind", () => {
    const missions = [
      mission({ id: "a", type: "typingSession", target: 1 }),
      mission({ id: "b", type: "similarSession", target: 1 }),
    ];
    const afterTyping = applySessionToMissions(missions, session({ questionType: "typing" }), T0);
    expect(afterTyping[0]?.completed).toBe(true);
    expect(afterTyping[1]?.completed).toBe(false);
    const afterSimilar = applySessionToMissions(missions, session({ mode: "similar" }), T0);
    expect(afterSimilar[0]?.completed).toBe(false);
    expect(afterSimilar[1]?.completed).toBe(true);
  });

  it("advances accuracySession only at 80% or more", () => {
    const missions = [mission({ type: "accuracySession", target: 1 })];
    expect(applySessionToMissions(missions, session({ accuracy: 79 }), T0)[0]?.completed).toBe(
      false,
    );
    expect(applySessionToMissions(missions, session({ accuracy: 80 }), T0)[0]?.completed).toBe(
      true,
    );
  });
});

describe("diffCompletedMissions", () => {
  it("returns only missions completed in this transition", () => {
    const before = [
      mission({ id: "a", completed: true }),
      mission({ id: "b", progress: 9 }),
      mission({ id: "c" }),
    ];
    const after = [
      mission({ id: "a", completed: true }),
      mission({ id: "b", progress: 10, completed: true }),
      mission({ id: "c", progress: 1 }),
    ];
    const completedNow = diffCompletedMissions(before, after);
    expect(completedNow.map((entry) => entry.id)).toEqual(["b"]);
  });
});
