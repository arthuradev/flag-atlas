import { useTranslation } from "react-i18next";
import type { LessonZeroOutcome } from "@/features/onboarding/logic/lessonZero";
import { MasteryBadge } from "@/features/progress/components/MasteryBadge";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { Globi } from "@/shared/components/Globi";
import { Icon, type IconName } from "@/shared/components/Icon";
import { ProgressBar } from "@/shared/components/ProgressBar";
import type { OnboardingDailyGoal } from "@/shared/storage/onboardingRepository";
import { useFocusOnMount } from "../hooks/useFocusOnMount";

type RewardStepProps = {
  outcome: LessonZeroOutcome | null;
  dailyGoal: OnboardingDailyGoal | null;
  coinsEarned?: number;
  animate?: boolean;
};

export function RewardStep({
  outcome,
  dailyGoal,
  coinsEarned = 0,
  animate = true,
}: RewardStepProps) {
  const { t } = useTranslation();
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const goal = dailyGoal ?? 5;
  const completedQuestions = 1;
  const xpGained = outcome?.xpGained ?? 15;
  const accuracy = outcome?.accuracy ?? 100;
  const masteryLevel = outcome?.masteryAfter ?? "recognized";
  const flagValue = outcome?.wasSkipped
    ? t("onboarding.reward.reviewedFlagValue")
    : t("onboarding.reward.firstFlagValue");

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
      value: flagValue,
    },
  ];

  return (
    <div className={`mx-auto w-full max-w-[620px] ${animate ? "fa-onb-in" : ""}`}>
      <div className="relative overflow-hidden rounded-[24px] border border-line bg-surface p-5 text-center shadow-card sm:p-7">
        {animate && (
          <div aria-hidden>
            <span className="fa-onb-confetti fa-onb-confetti-one absolute size-2 rounded-full bg-accent" />
            <span className="fa-onb-confetti fa-onb-confetti-two absolute size-2 rounded-full bg-success" />
            <span className="fa-onb-confetti fa-onb-confetti-three absolute size-2 rounded-full bg-danger" />
          </div>
        )}

        <div className="mx-auto flex size-28 items-center justify-center rounded-full bg-pine-soft p-2 ring-1 ring-ring/30">
          <Globi variant="compact" expression="sorriso" float={animate} blink={animate} />
        </div>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 text-[30px] font-black leading-[1.08] text-text outline-none lg:text-[40px]"
        >
          {t("onboarding.reward.title")}
        </h1>

        <div className="mt-6 grid w-full gap-3 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-[18px] border-2 border-line bg-surface-raised p-4 text-center shadow-card"
            >
              <span
                className={`flex size-11 items-center justify-center rounded-btn ${
                  stat.icon === "zap" ? "bg-ocre-soft text-warning" : "bg-pine-soft text-primary"
                }`}
              >
                <Icon name={stat.icon} size={21} />
              </span>
              <span className="text-3xl font-black leading-none text-text">{stat.value}</span>
              <span className="text-[11px] font-black uppercase tracking-[0.04em] text-text-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex flex-col gap-3 rounded-[18px] border border-line bg-surface-2 p-4 text-left">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-black text-text">
                {t("onboarding.reward.dailyGoal")}
              </span>
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
            {coinsEarned > 0 && (
              <p className="inline-flex items-center gap-2 text-sm font-extrabold text-warning">
                <Icon name="coin" size={17} />
                {t("onboarding.reward.coinsValue", { coins: coinsEarned })}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <MasteryBadge masteryLevel={masteryLevel} showTier />
          </div>
        </div>
      </div>
    </div>
  );
}
