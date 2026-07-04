import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { loadDailyMissions } from "@/shared/storage/missionsRepository";
import { getLocalDateKey } from "@/shared/utils/dateKey";
import { useMissionsStore } from "./missionsStore";

/** localStorage em memória: o ambiente de teste é node. */
function installMemoryStorage(): void {
  const store = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  });
}

describe("missionsStore", () => {
  beforeEach(() => {
    installMemoryStorage();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 4, 10, 0, 0));
    useProgressStore.getState().resetProgress();
    useMissionsStore.getState().resetMissions();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("keeps the same missions when refreshed within the same day", () => {
    const before = useMissionsStore.getState().missions;
    vi.setSystemTime(new Date(2026, 6, 4, 23, 59, 0));
    useMissionsStore.getState().refreshForToday();
    expect(useMissionsStore.getState().missions).toEqual(before);
  });

  it("persists progress so a reload within the day keeps it", () => {
    useMissionsStore
      .getState()
      .recordAnswer(
        { isCorrect: true, mode: "continue", promoted: false, sessionStreak: 1 },
        new Date().toISOString(),
      );
    const persisted = loadDailyMissions();
    expect(persisted?.date).toBe(getLocalDateKey());
    expect(persisted?.missions).toEqual(useMissionsStore.getState().missions.missions);
  });

  it("renews missions on the next day", () => {
    const before = useMissionsStore.getState().missions;
    vi.setSystemTime(new Date(2026, 6, 5, 0, 5, 0));
    useMissionsStore.getState().refreshForToday();
    const after = useMissionsStore.getState().missions;
    expect(after.date).toBe("2026-07-05");
    expect(after.date).not.toBe(before.date);
    expect(after.missions.every((mission) => mission.progress === 0)).toBe(true);
  });

  it("grants mission XP exactly once", () => {
    const completedAt = new Date().toISOString();
    const sessionEvent = {
      mode: "continue",
      questionType: "choice",
      accuracy: 60,
      questionCount: 5,
    } as const;

    // Com precisão 60, modo continue e múltipla escolha, só a missão
    // "complete 1 sessão" pode completar: o XP esperado é exato.
    useMissionsStore.getState().recordSessionCompleted(sessionEvent, completedAt);
    const completeMission = useMissionsStore
      .getState()
      .missions.missions.find((mission) => mission.type === "completeSession");
    expect(completeMission?.completed).toBe(true);
    expect(useProgressStore.getState().progress.totalXp).toBe(completeMission?.rewardXp);

    // Concluir outra sessão no mesmo dia não paga a missão de novo.
    useMissionsStore.getState().recordSessionCompleted(sessionEvent, completedAt);
    expect(useProgressStore.getState().progress.totalXp).toBe(completeMission?.rewardXp);
  });

  it("rolls over to the new day when recording after midnight", () => {
    const before = useMissionsStore.getState().missions;
    vi.setSystemTime(new Date(2026, 6, 5, 0, 1, 0));
    useMissionsStore
      .getState()
      .recordAnswer(
        { isCorrect: true, mode: "continue", promoted: false, sessionStreak: 1 },
        new Date().toISOString(),
      );
    const after = useMissionsStore.getState().missions;
    expect(after.date).toBe("2026-07-05");
    expect(after.date).not.toBe(before.date);
  });
});
