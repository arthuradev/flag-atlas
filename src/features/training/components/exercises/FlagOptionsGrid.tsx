import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { getCountryById, getCountryName } from "@/entities/country/country.selectors";
import type { SessionQuestion } from "@/entities/session/session.types";
import type { AnswerFeedback } from "@/features/training/store/sessionStore";
import { FlagImage } from "@/shared/components/FlagImage";
import type { IconName } from "@/shared/components/Icon";
import { Icon } from "@/shared/components/Icon";
import type { Locale } from "@/shared/i18n/locale";

type OptionState = "idle" | "correct" | "wrong" | "dimmed";

const STATE_CLASSES: Record<OptionState, string> = {
  idle: "border-line bg-surface text-text hover:border-line-strong hover:bg-surface-2 active:scale-[0.99]",
  correct: "border-success bg-success-soft text-success",
  wrong: "border-danger bg-danger-soft text-danger",
  dimmed: "border-line bg-background text-faint opacity-70",
};

const STATE_ICONS: Record<OptionState, IconName | null> = {
  idle: null,
  correct: "check-circle",
  wrong: "x-circle",
  dimmed: null,
};

type FlagOptionsGridProps = {
  question: SessionQuestion;
  feedback: AnswerFeedback | null;
  locale: Locale;
  onSelect: (countryId: string) => void;
};

/** Grid de alternativas em bandeira: o jogador vê o nome e escolhe a bandeira. */
export function FlagOptionsGrid({ question, feedback, locale, onSelect }: FlagOptionsGridProps) {
  const { t } = useTranslation();

  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
      {(question.optionCountryIds ?? []).map((optionId) => {
        const option = getCountryById(optionId);

        if (!option) {
          return null;
        }

        const state: OptionState = !feedback
          ? "idle"
          : optionId === feedback.correctCountryId
            ? "correct"
            : optionId === feedback.selectedCountryId
              ? "wrong"
              : "dimmed";
        const icon = STATE_ICONS[state];

        return (
          <motion.button
            key={optionId}
            type="button"
            data-sound="off"
            data-testid="training-option"
            data-state={state}
            aria-label={getCountryName(option, locale)}
            onClick={() => onSelect(optionId)}
            disabled={feedback !== null}
            animate={state === "correct" ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`relative flex min-h-24 w-full cursor-pointer items-center justify-center rounded-btn border-2 p-3 shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default sm:min-h-32 ${STATE_CLASSES[state]}`}
          >
            <FlagImage
              flagPath={option.flagPath}
              alt={t("training.flagAlt")}
              className="max-h-20 max-w-full rounded-md object-contain sm:max-h-24"
            />
            {icon && (
              <span className="absolute right-2 top-2">
                <Icon name={icon} size={22} strokeWidth={2.4} />
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
