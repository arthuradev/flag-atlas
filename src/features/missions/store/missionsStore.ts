import { create } from "zustand";
import type { DailyMissionsState } from "@/entities/mission/mission.types";
import { computeMissionCoins } from "@/features/cosmetics/logic/coinRewards";
import {
  applyAnswerToMissions,
  applySessionToMissions,
  diffCompletedMissions,
  generateDailyMissions,
  type MissionAnswerEvent,
  type MissionSessionEvent,
} from "@/features/missions/logic/dailyMissions";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { loadDailyMissions, saveDailyMissions } from "@/shared/storage/missionsRepository";
import { getLocalDateKey } from "@/shared/utils/dateKey";

export type MissionRewardResult = {
  completedMissionIds: string[];
  xpEarned: number;
  coinsEarned: number;
};

type MissionsState = {
  missions: DailyMissionsState;
  /** Garante que o estado pertence ao dia atual (renova na virada do dia). */
  refreshForToday: () => void;
  recordAnswer: (event: MissionAnswerEvent, answeredAt: string) => MissionRewardResult;
  recordSessionCompleted: (event: MissionSessionEvent, completedAt: string) => MissionRewardResult;
  resetMissions: () => void;
};

function missionsForToday(): DailyMissionsState {
  const today = getLocalDateKey();
  const stored = loadDailyMissions();
  if (stored && stored.date === today) {
    return stored;
  }
  const generated = generateDailyMissions(today);
  saveDailyMissions(generated);
  return generated;
}

export const useMissionsStore = create<MissionsState>((set, get) => {
  const applyUpdate = (
    recipe: (state: DailyMissionsState) => DailyMissionsState["missions"],
  ): MissionRewardResult => {
    // Sempre parte do dia atual: uma sessão que atravessa a meia-noite
    // progride as missões do dia novo, não as de ontem.
    const current = ensureToday();
    const missions = recipe(current);
    const completedNow = diffCompletedMissions(current.missions, missions);
    const rewardXp = completedNow.reduce((total, mission) => total + mission.rewardXp, 0);
    if (rewardXp > 0) {
      // Concedido apenas na transição para completa: nunca duas vezes.
      useProgressStore.getState().addBonusXp(rewardXp);
    }
    // Moedas Flaggo cosméticas por missão concluída, também só na transição.
    const rewardCoins = computeMissionCoins(completedNow.length);
    if (rewardCoins > 0) {
      useProgressStore.getState().addCoins(rewardCoins);
    }
    const next: DailyMissionsState = { date: current.date, missions };
    saveDailyMissions(next);
    set({ missions: next });
    return {
      completedMissionIds: completedNow.map((mission) => mission.id),
      xpEarned: rewardXp,
      coinsEarned: rewardCoins,
    };
  };

  const ensureToday = (): DailyMissionsState => {
    const today = getLocalDateKey();
    const current = get().missions;
    if (current.date === today) {
      return current;
    }
    const fresh = missionsForToday();
    set({ missions: fresh });
    return fresh;
  };

  return {
    missions: missionsForToday(),

    refreshForToday: () => {
      ensureToday();
    },

    recordAnswer: (event, answeredAt) => {
      return applyUpdate((state) => applyAnswerToMissions(state.missions, event, answeredAt));
    },

    recordSessionCompleted: (event, completedAt) => {
      return applyUpdate((state) => applySessionToMissions(state.missions, event, completedAt));
    },

    resetMissions: () => {
      const generated = generateDailyMissions(getLocalDateKey());
      saveDailyMissions(generated);
      set({ missions: generated });
    },
  };
});
