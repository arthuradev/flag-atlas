import { useTranslation } from "react-i18next";

/**
 * Continuous onboarding progress indicator, announced to assistive tech as
 * "Step X of Y".
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
      className={`flex w-full items-center gap-3 ${className}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={stepCount}
      aria-valuenow={stepIndex + 1}
      aria-valuetext={label}
    >
      <progress
        className="fa-onb-progress h-3 flex-1"
        value={stepIndex + 1}
        max={stepCount}
        aria-hidden
      />
      <span className="min-w-10 text-right text-xs font-black text-text-muted">
        {stepIndex + 1}/{stepCount}
      </span>
    </div>
  );
}
