import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { getCountryById, getCountryName } from "@/entities/country/country.selectors";
import type { SessionQuestion } from "@/entities/session/session.types";
import type { OptionState } from "@/features/training/components/OptionButton";
import type { AnswerFeedback } from "@/features/training/store/sessionStore";
import { FlagImage } from "@/shared/components/FlagImage";
import type { IconName } from "@/shared/components/Icon";
import { Icon } from "@/shared/components/Icon";
import type { Locale } from "@/shared/i18n/locale";

const STATE_CLASSES: Record<OptionState, string> = {
  idle: "border-line bg-surface text-text hover:border-line-strong hover:bg-surface-2 active:scale-[0.99]",
  selected: "border-ring bg-pine-soft text-text ring-2 ring-ring/40",
  correct: "border-success bg-success-soft text-success",
  wrong: "border-danger bg-danger-soft text-danger",
  dimmed: "border-line bg-background text-faint opacity-70",
};

const STATE_ICONS: Record<OptionState, IconName | null> = {
  idle: null,
  selected: null,
  correct: "check-circle",
  wrong: "x-circle",
  dimmed: null,
};

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

type FlagOptionsGridProps = {
  question: SessionQuestion;
  feedback: AnswerFeedback | null;
  selectedId: string | null;
  locale: Locale;
  onSelect: (countryId: string) => void;
};

/**
 * Grid de alternativas em bandeira: o jogador vê o nome do país e escolhe a
 * bandeira. Antes do feedback os cards mostram apenas A/B/C/D — nunca o nome
 * dos países; após o feedback, os nomes relevantes são revelados.
 */
export function FlagOptionsGrid({
  question,
  feedback,
  selectedId,
  locale,
  onSelect,
}: FlagOptionsGridProps) {
  const { t } = useTranslation();

  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
      {(question.optionCountryIds ?? []).map((optionId, index) => {
        const option = getCountryById(optionId);

        if (!option) {
          return null;
        }

        const state: OptionState = !feedback
          ? optionId === selectedId
            ? "selected"
            : "idle"
          : optionId === feedback.correctCountryId
            ? "correct"
            : optionId === feedback.selectedCountryId
              ? "wrong"
              : "dimmed";
        const icon = STATE_ICONS[state];
        const letter = OPTION_LETTERS[index] ?? "";
        const revealName = feedback !== null && (state === "correct" || state === "wrong");

        return (
          <motion.button
            key={optionId}
            type="button"
            data-sound="off"
            data-testid="training-option"
            data-state={state}
            aria-pressed={state === "selected"}
            aria-label={t("training.optionLetter", { letter })}
            onClick={() => onSelect(optionId)}
            disabled={feedback !== null}
            animate={state === "correct" ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`relative flex min-h-24 w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-btn border-2 p-3 pb-2 shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default sm:min-h-32 ${STATE_CLASSES[state]}`}
          >
            <span
              aria-hidden="true"
              className={`absolute left-2 top-2 flex size-6 items-center justify-center rounded-md text-xs font-black ${
                state === "selected"
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-2 text-text-muted"
              }`}
            >
              {letter}
            </span>
            <FlagImage
              flagPath={option.flagPath}
              alt={t("training.flagAlt")}
              className="max-h-16 max-w-full rounded-md object-contain sm:max-h-20"
            />
            {revealName ? (
              <span className="line-clamp-1 text-xs font-extrabold">
                {getCountryName(option, locale)}
              </span>
            ) : (
              <span aria-hidden="true" className="text-xs font-extrabold opacity-0">
                ·
              </span>
            )}
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
