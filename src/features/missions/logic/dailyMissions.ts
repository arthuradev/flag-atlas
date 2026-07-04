import type {
  DailyMission,
  DailyMissionsState,
  DailyMissionType,
} from "@/entities/mission/mission.types";
import type { QuestionType, SessionMode } from "@/entities/session/session.types";
import { createRng, shuffle } from "@/shared/utils/rng";

export const MISSIONS_PER_DAY = 3;

type MissionBlueprint = {
  type: DailyMissionType;
  target: number;
  rewardXp: number;
};

/** A primeira missão do dia é sempre "complete 1 sessão"; as demais variam. */
const BASE_MISSION: MissionBlueprint = { type: "completeSession", target: 1, rewardXp: 10 };

const ROTATING_MISSIONS: readonly MissionBlueprint[] = [
  { type: "correctAnswers", target: 10, rewardXp: 15 },
  { type: "reviewAnswers", target: 3, rewardXp: 15 },
  { type: "masteryUp", target: 1, rewardXp: 15 },
  { type: "typingSession", target: 1, rewardXp: 20 },
  { type: "similarSession", target: 1, rewardXp: 20 },
  { type: "answerStreak", target: 5, rewardXp: 15 },
  { type: "accuracySession", target: 1, rewardXp: 20 },
];

/** Seed numérica estável derivada da chave do dia. */
function seedFromDateKey(dateKey: string): number {
  let hash = 2166136261;
  for (let i = 0; i < dateKey.length; i++) {
    hash ^= dateKey.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function toMission(blueprint: MissionBlueprint, dateKey: string): DailyMission {
  return {
    id: `${dateKey}:${blueprint.type}`,
    type: blueprint.type,
    target: blueprint.target,
    progress: 0,
    completed: false,
    rewardXp: blueprint.rewardXp,
  };
}

/**
 * Missões do dia, determinísticas para a mesma data: recarregar a página
 * não troca as missões, e a virada do dia troca sozinha.
 */
export function generateDailyMissions(dateKey: string): DailyMissionsState {
  const rng = createRng(seedFromDateKey(dateKey));
  const rotating = shuffle(ROTATING_MISSIONS, rng).slice(0, MISSIONS_PER_DAY - 1);
  return {
    date: dateKey,
    missions: [BASE_MISSION, ...rotating].map((blueprint) => toMission(blueprint, dateKey)),
  };
}

export type MissionAnswerEvent = {
  isCorrect: boolean;
  mode: SessionMode;
  /** A resposta evoluiu o domínio do país. */
  promoted: boolean;
  /** Sequência de acertos dentro da sessão após esta resposta. */
  sessionStreak: number;
};

export type MissionSessionEvent = {
  mode: SessionMode;
  questionType: QuestionType;
  /** Percentual 0–100. */
  accuracy: number;
  questionCount: number;
};

export const ACCURACY_MISSION_MIN_PERCENT = 80;

function advance(mission: DailyMission, amount: number, completedAt: string): DailyMission {
  if (mission.completed || amount <= 0) {
    return mission;
  }
  const progress = Math.min(mission.target, mission.progress + amount);
  if (progress >= mission.target) {
    return { ...mission, progress, completed: true, completedAt };
  }
  return { ...mission, progress };
}

/** answerStreak progride para o melhor valor do dia, sem somar. */
function advanceToAtLeast(mission: DailyMission, value: number, completedAt: string): DailyMission {
  if (mission.completed || value <= mission.progress) {
    return mission;
  }
  const progress = Math.min(mission.target, value);
  if (progress >= mission.target) {
    return { ...mission, progress, completed: true, completedAt };
  }
  return { ...mission, progress };
}

export function applyAnswerToMissions(
  missions: readonly DailyMission[],
  event: MissionAnswerEvent,
  answeredAt: string,
): DailyMission[] {
  return missions.map((mission) => {
    switch (mission.type) {
      case "correctAnswers":
        return event.isCorrect ? advance(mission, 1, answeredAt) : mission;
      case "reviewAnswers":
        return event.mode === "review" ? advance(mission, 1, answeredAt) : mission;
      case "masteryUp":
        return event.promoted ? advance(mission, 1, answeredAt) : mission;
      case "answerStreak":
        return advanceToAtLeast(mission, event.sessionStreak, answeredAt);
      default:
        return mission;
    }
  });
}

export function applySessionToMissions(
  missions: readonly DailyMission[],
  event: MissionSessionEvent,
  completedAt: string,
): DailyMission[] {
  return missions.map((mission) => {
    switch (mission.type) {
      case "completeSession":
        return advance(mission, 1, completedAt);
      case "typingSession":
        return event.questionType === "typing" ? advance(mission, 1, completedAt) : mission;
      case "similarSession":
        return event.mode === "similar" ? advance(mission, 1, completedAt) : mission;
      case "accuracySession":
        return event.accuracy >= ACCURACY_MISSION_MIN_PERCENT && event.questionCount > 0
          ? advance(mission, 1, completedAt)
          : mission;
      default:
        return mission;
    }
  });
}

/** Missões que completaram nesta transição (para conceder XP uma única vez). */
export function diffCompletedMissions(
  before: readonly DailyMission[],
  after: readonly DailyMission[],
): DailyMission[] {
  const wasCompleted = new Set(
    before.filter((mission) => mission.completed).map((mission) => mission.id),
  );
  return after.filter((mission) => mission.completed && !wasCompleted.has(mission.id));
}
