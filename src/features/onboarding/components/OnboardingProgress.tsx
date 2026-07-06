import { useTranslation } from "react-i18next";

/**
 * The step indicator: a row of pill dots where the current step stretches into
 * a wide aqua bar. Announced to assistive tech as "Step X of Y".
 */
type OnboardingProgressProps = {
  stepIndex: number;
  stepCount: number;
  className?: string;
};

export function OnboardingProgress({
  stepIndex,
  stepCount,
  className = "",
}: OnboardingProgressProps) {
  const { t } = useTranslation();
  const label = t("onboarding.stepLabel", { current: stepIndex + 1, total: stepCount });

  return (
    <div
      className={`flex items-center gap-[7px] ${className}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={stepCount}
      aria-valuenow={stepIndex + 1}
      aria-valuetext={label}
    >
      {Array.from({ length: stepCount }, (_, index) => {
        const isActive = index === stepIndex;
        const isReached = index <= stepIndex;
        return (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length, order-stable indicator
            key={index}
            aria-hidden
            className={`h-[9px] rounded-full transition-all duration-300 ease-out ${
              isActive ? "w-[30px]" : "w-[9px]"
            } ${isReached ? "bg-ring" : "bg-line-strong"}`}
          />
        );
      })}
    </div>
  );
}
