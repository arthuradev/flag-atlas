import { resolveExercise } from "@/entities/exercise/exercise.mapping";
import type { ExerciseType } from "@/entities/exercise/exercise.types";
import type { SessionQuestion } from "@/entities/session/session.types";
import type { AnswerFeedback } from "@/features/training/store/sessionStore";
import type { Locale } from "@/shared/i18n/locale";
import { ChoiceOptionsGrid } from "./ChoiceOptionsGrid";
import { FlagOptionsGrid } from "./FlagOptionsGrid";
import { TypingAnswerArea } from "./TypingAnswerArea";

type ExerciseBodyProps = {
  question: SessionQuestion;
  questionIndex: number;
  exerciseType: ExerciseType;
  feedback: AnswerFeedback | null;
  selectedId: string | null;
  locale: Locale;
  onSelectOption: (countryId: string) => void;
  onSubmitTyped: (typedAnswer: string) => void;
};

/** Despacha a área de resposta pelo formato do tipo de exercício da pergunta. */
export function ExerciseBody({
  question,
  questionIndex,
  exerciseType,
  feedback,
  selectedId,
  locale,
  onSelectOption,
  onSubmitTyped,
}: ExerciseBodyProps) {
  const { format } = resolveExercise(exerciseType);

  if (format === "typing") {
    return (
      <TypingAnswerArea
        questionIndex={questionIndex}
        disabled={feedback !== null}
        onSubmit={onSubmitTyped}
      />
    );
  }

  if (format === "country_to_flag") {
    return (
      <FlagOptionsGrid
        question={question}
        feedback={feedback}
        selectedId={selectedId}
        locale={locale}
        onSelect={onSelectOption}
      />
    );
  }

  return (
    <ChoiceOptionsGrid
      question={question}
      feedback={feedback}
      selectedId={selectedId}
      locale={locale}
      onSelect={onSelectOption}
    />
  );
}
