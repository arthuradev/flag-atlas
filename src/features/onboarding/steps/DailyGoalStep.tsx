import { useTranslation } from "react-i18next";
import { Icon } from "@/shared/components/Icon";
import { DAILY_GOALS, type OnboardingDailyGoal } from "@/shared/storage/onboardingRepository";
import { useFocusOnMount } from "../hooks/useFocusOnMount";

type DailyGoalStepProps = {
  selectedGoal: OnboardingDailyGoal | null;
  onSelect: (goal: OnboardingDailyGoal) => void;
  animate?: boolean;
};

export function DailyGoalStep({ selectedGoal, onSelect, animate = true }: DailyGoalStepProps) {
  const { t } = useTranslation();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <div className={`flex flex-col gap-5 ${animate ? "fa-onb-in" : ""}`}>
      <div>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-[28px] font-black leading-[1.1] text-text outline-none lg:text-[36px]"
        >
          {t("onboarding.goal.title")}
        </h1>
        <p className="mt-2 max-w-[34ch] text-base font-semibold leading-relaxed text-text-muted">
          {t("onboarding.goal.body")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {DAILY_GOALS.map((goal) => {
          const isSelected = selectedGoal === goal;
          return (
            <button
              key={goal}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(goal)}
              className={`flex min-h-28 flex-col items-center justify-center rounded-card border-2 bg-surface p-4 text-center shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isSelected
                  ? "border-ring bg-pine-soft"
                  : "border-line hover:-translate-y-0.5 hover:bg-surface-2"
              }`}
            >
              <span className="text-4xl font-black leading-none text-text">{goal}</span>
              <span className="mt-1 text-sm font-extrabold text-text-muted">
                {t("onboarding.goal.questionsPerDay")}
              </span>
              {isSelected && (
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-extrabold text-primary-foreground">
                  <Icon name="check" size={14} strokeWidth={3} />
                  {t("onboarding.goal.selected")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="inline-flex items-center gap-2 rounded-btn bg-pine-soft px-3 py-2 text-sm font-bold text-primary">
        <Icon name="shield-check" size={18} />
        {t("onboarding.goal.hint")}
      </p>
    </div>
  );
}
