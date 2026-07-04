export const DAILY_MISSION_TYPES = [
  "correctAnswers",
  "completeSession",
  "reviewAnswers",
  "masteryUp",
  "typingSession",
  "similarSession",
  "answerStreak",
  "accuracySession",
] as const;

export type DailyMissionType = (typeof DAILY_MISSION_TYPES)[number];

export function isDailyMissionType(value: unknown): value is DailyMissionType {
  return DAILY_MISSION_TYPES.includes(value as DailyMissionType);
}

export type DailyMission = {
  id: string;
  type: DailyMissionType;
  target: number;
  progress: number;
  completed: boolean;
  completedAt?: string;
  rewardXp: number;
};

export type DailyMissionsState = {
  /** Dia local YYYY-MM-DD ao qual as missões pertencem. */
  date: string;
  missions: DailyMission[];
};
