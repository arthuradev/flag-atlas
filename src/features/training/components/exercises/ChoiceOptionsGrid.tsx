import { getCountryById, getCountryName } from "@/entities/country/country.selectors";
import type { SessionQuestion } from "@/entities/session/session.types";
import { OptionButton } from "@/features/training/components/OptionButton";
import type { AnswerFeedback } from "@/features/training/store/sessionStore";
import type { Locale } from "@/shared/i18n/locale";

type ChoiceOptionsGridProps = {
  question: SessionQuestion;
  feedback: AnswerFeedback | null;
  locale: Locale;
  onSelect: (countryId: string) => void;
};

/** Grid de alternativas em texto: o jogador vê a bandeira e escolhe o país. */
export function ChoiceOptionsGrid({
  question,
  feedback,
  locale,
  onSelect,
}: ChoiceOptionsGridProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:gap-4">
      {(question.optionCountryIds ?? []).map((optionId) => {
        const option = getCountryById(optionId);

        if (!option) {
          return null;
        }

        const state = !feedback
          ? "idle"
          : optionId === feedback.correctCountryId
            ? "correct"
            : optionId === feedback.selectedCountryId
              ? "wrong"
              : "dimmed";

        return (
          <OptionButton
            key={optionId}
            label={getCountryName(option, locale)}
            state={state}
            disabled={feedback !== null}
            onSelect={() => onSelect(optionId)}
          />
        );
      })}
    </div>
  );
}
