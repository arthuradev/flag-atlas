import type { UserProgress } from "@/entities/progress/progress.types";
import type { QuestionType, SessionMode } from "@/entities/session/session.types";
import type { IconName } from "@/shared/components/Icon";

export const ACHIEVEMENT_CATEGORIES = [
  "progress",
  "continent",
  "mastery",
  "session",
  "accuracy",
  "challenge",
  "survival",
  "review",
] as const;

export type AchievementCategory = (typeof ACHIEVEMENT_CATEGORIES)[number];

/** Resumo de uma sessão recém-concluída, para conquistas de evento. */
export type AchievementSessionEvent = {
  mode: SessionMode;
  questionType: QuestionType;
  questionCount: number;
  correctCount: number;
  /** Percentual 0–100. */
  accuracy: number;
  bestStreak: number;
};

export type AchievementContext = {
  progress: UserProgress;
  /** Presente apenas na avaliação disparada pelo fim de uma sessão. */
  sessionEvent?: AchievementSessionEvent;
};

export type AchievementProgress = {
  current: number;
  target: number;
};

export type AchievementDefinition = {
  /** Também é a base das chaves i18n: achievements.items.<id>.title/.description. */
  id: string;
  category: AchievementCategory;
  icon: IconName;
  isUnlocked: (context: AchievementContext) => boolean;
  /** Progresso parcial exibível; ausente em conquistas de evento tudo-ou-nada. */
  getProgress?: (progress: UserProgress) => AchievementProgress;
};

/** Conquista pronta para exibição. */
export type AchievementView = {
  id: string;
  category: AchievementCategory;
  icon: IconName;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: AchievementProgress;
};
