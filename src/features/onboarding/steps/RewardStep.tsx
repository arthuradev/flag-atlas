import { useTranslation } from "react-i18next";
import type { LessonZeroOutcome } from "@/features/onboarding/logic/lessonZero";
import { MasteryBadge } from "@/features/progress/components/MasteryBadge";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { Icon, type IconName } from "@/shared/components/Icon";
import { ProgressBar } from "@/shared/components/ProgressBar";
import type { OnboardingDailyGoal } from "@/shared/storage/onboardingRepository";
import { useFocusOnMount } from "../hooks/useFocusOnMount";

type RewardStepProps = {
  outcome: LessonZeroOutcome | null;
  dailyGoal: OnboardingDailyGoal | null;
  animate?: boolean;
};

export function RewardStep({ outcome, dailyGoal, animate = true }: RewardStepProps) {
  const { t } = useTranslation();
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const goal = dailyGoal ?? 5;
  const completedQuestions = 1;
  const xpGained = outcome?.xpGained ?? 15;
  const accuracy = outcome?.accuracy ?? 100;
  const masteryLevel = outcome?.masteryAfter ?? "recognized";

  const stats: { icon: IconName; label: string; value: string }[] = [
    {
      icon: "zap",
      label: t("onboarding.reward.xp"),
      value: t("onboarding.reward.xpValue", { xp: xpGained }),
    },
    {
      icon: "percent",
      label: t("onboarding.reward.accuracy"),
      value: t("onboarding.reward.accuracyValue", { accuracy }),
    },
    {
      icon: "shield-check",
      label: t("onboarding.reward.firstFlag"),
      value: t("onboarding.reward.firstFlagValue"),
    },
  ];

  return (
    <div
      className={`flex flex-col items-center text-center lg:items-start lg:text-left ${
        animate ? "fa-onb-in" : ""
      }`}
    >
      <div className="relative mb-5 flex size-24 items-center justify-center rounded-full bg-pine-soft text-primary ring-1 ring-ring/30">
        {animate && (
          <>
            <span className="fa-onb-confetti fa-onb-confetti-one absolute size-2 rounded-full bg-accent" />
            <span className="fa-onb-confetti fa-onb-confetti-two absolute size-2 rounded-full bg-success" />
            <span className="fa-onb-confetti fa-onb-confetti-three absolute size-2 rounded-full bg-danger" />
          </>
        )}
        <Icon name="trophy" size={48} />
      </div>

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-[28px] font-black leading-[1.1] text-text outline-none lg:text-[38px]"
      >
        {t("onboarding.reward.title")}
      </h1>

      <div className="mt-6 grid w-full gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-2 rounded-card border border-line bg-surface p-4 text-center shadow-card"
          >
            <span className="flex size-10 items-center justify-center rounded-btn bg-pine-soft text-primary">
              <Icon name={stat.icon} size={20} />
            </span>
            <span className="text-2xl font-black text-text">{stat.value}</span>
            <span className="text-xs font-black uppercase text-text-muted">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex w-full flex-col gap-3 rounded-card border border-line bg-surface p-4 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-black text-text">{t("onboarding.reward.dailyGoal")}</span>
          <span className="text-sm font-extrabold text-text-muted">
            {t("onboarding.reward.goalProgress", { current: completedQuestions, goal })}
          </span>
        </div>
        <ProgressBar
          value={completedQuestions}
          max={goal}
          label={t("onboarding.reward.dailyGoal")}
          animate={!reduceMotion}
        />
      </div>

      <div className="mt-4">
        <MasteryBadge masteryLevel={masteryLevel} showTier />
      </div>
    </div>
  );
}
