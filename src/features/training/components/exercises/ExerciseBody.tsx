import type { QuestionType, SessionQuestion } from "@/entities/session/session.types";
import type { AnswerFeedback } from "@/features/training/store/sessionStore";
import type { Locale } from "@/shared/i18n/locale";
import { ChoiceOptionsGrid } from "./ChoiceOptionsGrid";
import { TypingAnswerArea } from "./TypingAnswerArea";

type ExerciseBodyProps = {
  question: SessionQuestion;
  questionIndex: number;
  questionType: QuestionType;
  feedback: AnswerFeedback | null;
  locale: Locale;
  onSelectOption: (countryId: string) => void;
  onSubmitTyped: (typedAnswer: string) => void;
};

/**
 * Despacha a área de resposta pelo formato do exercício. Hoje o formato é
 * global por sessão (config.questionType); o dispatch por pergunta chega
 * com o modelo de ExerciseType.
 */
export function ExerciseBody({
  question,
  questionIndex,
  questionType,
  feedback,
  locale,
  onSelectOption,
  onSubmitTyped,
}: ExerciseBodyProps) {
  if (questionType === "typing") {
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
