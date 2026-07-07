import { getCountryById } from "@/entities/country/country.selectors";
import type { Country } from "@/entities/country/country.types";
import {
  type CountryProgress,
  createInitialCountryProgress,
  type MasteryLevel,
} from "@/entities/progress/progress.types";
import { applyAnswerToCountryProgress } from "@/features/progress/logic/mastery";
import { computeAnswerXp } from "@/features/progress/logic/xp";
import { getLocalDateKey } from "@/shared/utils/dateKey";

export const LESSON_ZERO_CORRECT_COUNTRY_ID = "br";
export const LESSON_ZERO_COUNTRY_IDS = ["br", "ar", "co", "mx"] as const;

type LessonZeroAnsweredOutcome = {
  correctCountryId: string;
  selectedCountryId: string;
  wasSkipped: false;
  isCorrect: boolean;
  xpGained: number;
  accuracy: number;
  masteryBefore: MasteryLevel;
  masteryAfter: MasteryLevel;
  masteryPointsBefore: number;
  masteryPointsAfter: number;
  promoted: boolean;
  countryProgress: CountryProgress;
  answeredAt: string;
};

type LessonZeroSkippedOutcome = {
  correctCountryId: string;
  selectedCountryId: null;
  wasSkipped: true;
  isCorrect: false;
  xpGained: 0;
  accuracy: 0;
  masteryBefore: MasteryLevel;
  masteryAfter: MasteryLevel;
  masteryPointsBefore: number;
  masteryPointsAfter: number;
  promoted: false;
  answeredAt: string;
};

export type LessonZeroOutcome = LessonZeroAnsweredOutcome | LessonZeroSkippedOutcome;

export function getLessonZeroCountries(): Country[] {
  return LESSON_ZERO_COUNTRY_IDS.map((id) => getCountryById(id)).filter(
    (country): country is Country => country !== undefined,
  );
}

export function evaluateLessonZeroAnswer(
  selectedCountryId: string,
  previousCountryProgress?: CountryProgress,
  answeredAt = new Date().toISOString(),
): LessonZeroOutcome {
  const previous =
    previousCountryProgress ?? createInitialCountryProgress(LESSON_ZERO_CORRECT_COUNTRY_ID);
  const isCorrect = selectedCountryId === LESSON_ZERO_CORRECT_COUNTRY_ID;
  const countryProgress = applyAnswerToCountryProgress(previous, {
    isCorrect,
    answeredAt,
    localDateKey: getLocalDateKey(new Date(answeredAt)),
    mode: "continue",
    questionType: "choice",
    ...(!isCorrect && { confusedWithCountryId: selectedCountryId }),
  });
  const promoted = countryProgress.masteryLevel !== previous.masteryLevel && isCorrect;
  const xpGained = computeAnswerXp({
    isCorrect,
    promoted,
    streakAfter: isCorrect ? 1 : 0,
  });

  return {
    correctCountryId: LESSON_ZERO_CORRECT_COUNTRY_ID,
    selectedCountryId,
    wasSkipped: false,
    isCorrect,
    xpGained,
    accuracy: isCorrect ? 100 : 0,
    masteryBefore: previous.masteryLevel,
    masteryAfter: countryProgress.masteryLevel,
    masteryPointsBefore: previous.masteryPoints,
    masteryPointsAfter: countryProgress.masteryPoints,
    promoted,
    countryProgress,
    answeredAt,
  };
}

export function skipLessonZero(
  previousCountryProgress?: CountryProgress,
  answeredAt = new Date().toISOString(),
): LessonZeroOutcome {
  const previous =
    previousCountryProgress ?? createInitialCountryProgress(LESSON_ZERO_CORRECT_COUNTRY_ID);

  return {
    correctCountryId: LESSON_ZERO_CORRECT_COUNTRY_ID,
    selectedCountryId: null,
    wasSkipped: true,
    isCorrect: false,
    xpGained: 0,
    accuracy: 0,
    masteryBefore: previous.masteryLevel,
    masteryAfter: previous.masteryLevel,
    masteryPointsBefore: previous.masteryPoints,
    masteryPointsAfter: previous.masteryPoints,
    promoted: false,
    answeredAt,
  };
}
