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
  const selectedCountry = getCountryById(outcome.selectedCountryId);
  const correctName = correctCountry ? getCountryName(correctCountry, locale) : "";
  const selectedName = selectedCountry ? getCountryName(selectedCountry, locale) : "";

  return (
    <div
      aria-live="polite"
      className={`flex flex-col items-center text-center lg:items-start lg:text-left ${
        animate ? "fa-onb-in" : ""
      }`}
    >
      <div
        className={`mb-5 flex size-16 items-center justify-center rounded-full ${
          outcome.isCorrect ? "bg-success-soft text-success" : "bg-ocre-soft text-warning"
        }`}
        aria-hidden
      >
        <Icon name={outcome.isCorrect ? "check-circle" : "sparkles"} size={34} />
      </div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-[27px] font-black leading-[1.12] text-text outline-none lg:text-[36px]"
      >
        {outcome.isCorrect
          ? t("onboarding.feedback.correctTitle")
          : t("onboarding.feedback.wrongTitle")}
      </h1>
      <p className="mt-3 max-w-[34ch] text-base font-semibold leading-relaxed text-text-muted lg:text-lg">
        {outcome.isCorrect
          ? t("onboarding.feedback.correctBody", { country: correctName })
          : t("onboarding.feedback.wrongBody", { country: correctName, selected: selectedName })}
      </p>

      {correctCountry && (
        <div className="mt-6 flex w-full max-w-sm items-center gap-3 rounded-card border border-line bg-surface p-3 text-left shadow-card">
          <span className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-btn border border-line bg-white p-1.5">
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
    </div>
  );
}
