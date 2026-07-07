import { useTranslation } from "react-i18next";
import { getCountryById, getCountryName } from "@/entities/country/country.selectors";
import type { LessonZeroOutcome } from "@/features/onboarding/logic/lessonZero";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { FlagImage } from "@/shared/components/FlagImage";
import { Icon } from "@/shared/components/Icon";
import { useFocusOnMount } from "../hooks/useFocusOnMount";

type LessonFeedbackStepProps = {
  outcome: LessonZeroOutcome;
  animate?: boolean;
};

export function LessonFeedbackStep({ outcome, animate = true }: LessonFeedbackStepProps) {
  const { t } = useTranslation();
  const locale = useSettingsStore((state) => state.locale);
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const correctCountry = getCountryById(outcome.correctCountryId);
  const selectedCountry = outcome.selectedCountryId
    ? getCountryById(outcome.selectedCountryId)
    : undefined;
  const correctName = correctCountry ? getCountryName(correctCountry, locale) : "";
  const selectedName = selectedCountry ? getCountryName(selectedCountry, locale) : "";
  const title = outcome.wasSkipped
    ? t("onboarding.feedback.skippedTitle")
    : outcome.isCorrect
      ? t("onboarding.feedback.correctTitle")
      : t("onboarding.feedback.wrongTitle");
  const body = outcome.wasSkipped
    ? t("onboarding.feedback.skippedBody", { country: correctName })
    : outcome.isCorrect
      ? t("onboarding.feedback.correctBody", { country: correctName })
      : t("onboarding.feedback.wrongBody", { country: correctName, selected: selectedName });

  return (
    <div
      aria-live="polite"
      className={`mx-auto flex w-full max-w-xl flex-col items-center text-center ${
        animate ? "fa-onb-in" : ""
      }`}
    >
      <div
        className={`mb-5 flex size-20 items-center justify-center rounded-full ring-1 ${
          outcome.isCorrect
            ? "bg-success-soft text-success ring-success/25"
            : "bg-ocre-soft text-warning ring-warning/25"
        }`}
        aria-hidden
      >
        <Icon name={outcome.isCorrect ? "check-circle" : "sparkles"} size={40} />
      </div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-[30px] font-black leading-[1.1] text-text outline-none lg:text-[40px]"
      >
        {title}
      </h1>
      <p className="mt-3 max-w-[42ch] text-base font-semibold leading-relaxed text-text-muted lg:text-lg">
        {body}
      </p>

      {correctCountry && (
        <div className="mt-7 flex w-full max-w-md items-center gap-4 rounded-[18px] border-2 border-success/40 bg-success-soft/60 p-3 text-left shadow-card">
          <span className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-btn border border-line bg-white p-1.5 shadow-flag">
            <FlagImage
              flagPath={correctCountry.flagPath}
              alt={t("onboarding.lesson.flagAlt", { country: correctName })}
              className="max-h-full max-w-full rounded-md object-contain"
            />
          </span>
          <span>
            <span className="block text-xs font-black uppercase text-text-muted">
              {t("onboarding.feedback.correctAnswer")}
            </span>
            <span className="block text-lg font-black text-text">{correctName}</span>
          </span>
        </div>
      )}

      {!outcome.wasSkipped && !outcome.isCorrect && selectedCountry && (
        <div className="mt-3 flex w-full max-w-md items-center gap-3 rounded-[18px] border border-danger/30 bg-danger-soft/60 p-3 text-left">
          <span className="flex size-9 items-center justify-center rounded-full bg-danger-soft text-danger">
            <Icon name="x" size={19} strokeWidth={2.8} />
          </span>
          <span>
            <span className="block text-xs font-black uppercase text-text-muted">
              {t("onboarding.feedback.yourChoice")}
            </span>
            <span className="block font-black text-text">{selectedName}</span>
          </span>
        </div>
      )}
    </div>
  );
}
