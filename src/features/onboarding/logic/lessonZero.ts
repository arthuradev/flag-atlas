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

export type LessonZeroOutcome = {
  correctCountryId: string;
  selectedCountryId: string;
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
