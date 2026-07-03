import type { ContinentId } from "@/entities/continent/continent.types";
import type { MasteryLevel } from "@/entities/progress/progress.types";
import type { SessionSize } from "@/entities/settings/settings.types";

export type SessionMode = "continue" | "continent";

export type SessionConfig = {
  mode: SessionMode;
  continentId?: ContinentId;
  size: SessionSize;
};

export type SessionQuestion = {
  countryId: string;
  /** 4 alternativas embaralhadas, incluindo a correta. */
  optionCountryIds: readonly string[];
};

export type SessionAnswer = {
  countryId: string;
  selectedCountryId: string;
  isCorrect: boolean;
  answeredAt: string;
  xpGained: number;
  masteryBefore: MasteryLevel;
  masteryAfter: MasteryLevel;
};

export type TrainingSession = {
  id: string;
  config: SessionConfig;
  questions: readonly SessionQuestion[];
  currentIndex: number;
  answers: SessionAnswer[];
  startedAt: string;
};

export type MasteryPromotion = {
  countryId: string;
  from: MasteryLevel;
  to: MasteryLevel;
};

export type SessionSummary = {
  config: SessionConfig;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  bestStreak: number;
  xpEarned: number;
  promotions: MasteryPromotion[];
  toReviewCountryIds: string[];
  levelBefore: number;
  levelAfter: number;
};
