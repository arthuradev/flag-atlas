import { resolveExercise } from "@/entities/exercise/exercise.mapping";
import type { ExerciseType } from "@/entities/exercise/exercise.types";
import type { SessionQuestion } from "@/entities/session/session.types";
import type { AnswerFeedback } from "@/features/training/store/sessionStore";
import type { Locale } from "@/shared/i18n/locale";
import { ChoiceOptionsGrid } from "./ChoiceOptionsGrid";
import { TypingAnswerArea } from "./TypingAnswerArea";

type ExerciseBodyProps = {
  question: SessionQuestion;
  questionIndex: number;
  exerciseType: ExerciseType;
  feedback: AnswerFeedback | null;
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

  return (
    <ChoiceOptionsGrid
      question={question}
      feedback={feedback}
      locale={locale}
      onSelect={onSelectOption}
    />
  );
}
