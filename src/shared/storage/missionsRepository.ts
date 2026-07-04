import {
  type DailyMission,
  type DailyMissionsState,
  isDailyMissionType,
} from "@/entities/mission/mission.types";
import { isDateKey } from "@/shared/utils/dateKey";
import { readJson, writeJson } from "./localStorageClient";
import { STORAGE_KEYS } from "./storageKeys";
import { unwrapEnvelope, wrapEnvelope } from "./storageSchema";

export const MISSIONS_SCHEMA_VERSION = 1;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeMission(value: unknown): DailyMission | null {
  if (!isRecord(value)) {
    return null;
  }
  if (typeof value.id !== "string" || value.id.length === 0 || !isDailyMissionType(value.type)) {
    return null;
  }
  const target = typeof value.target === "number" && value.target > 0 ? value.target : null;
  if (target === null) {
    return null;
  }
  const progress =
    typeof value.progress === "number" && Number.isFinite(value.progress)
      ? Math.min(target, Math.max(0, Math.floor(value.progress)))
      : 0;
  const mission: DailyMission = {
    id: value.id,
    type: value.type,
    target,
    progress,
    completed: value.completed === true,
    rewardXp:
      typeof value.rewardXp === "number" && value.rewardXp > 0 ? Math.floor(value.rewardXp) : 0,
  };
  if (typeof value.completedAt === "string") {
    mission.completedAt = value.completedAt;
  }
  return mission;
}

/**
 * Carrega o estado de missões do dia; dados corrompidos ou de formato
 * inesperado viram null e o chamador gera missões novas.
 */
export function loadDailyMissions(): DailyMissionsState | null {
  const data = unwrapEnvelope(readJson(STORAGE_KEYS.missions), MISSIONS_SCHEMA_VERSION);
  if (!isRecord(data) || !isDateKey(data.date) || !Array.isArray(data.missions)) {
    return null;
  }
  const missions: DailyMission[] = [];
  for (const entry of data.missions) {
    const mission = normalizeMission(entry);
    if (mission) {
      missions.push(mission);
    }
  }
  if (missions.length === 0) {
    return null;
  }
  return { date: data.date, missions };
}

export function saveDailyMissions(state: DailyMissionsState): void {
  writeJson(STORAGE_KEYS.missions, wrapEnvelope(state, MISSIONS_SCHEMA_VERSION));
}
