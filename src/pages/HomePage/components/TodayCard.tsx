import { useTranslation } from "react-i18next";
import { countCountriesDueForReview } from "@/entities/progress/progress.selectors";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import { DailyStreakLine } from "@/features/progress/components/DailyStreakLine";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useStartSession } from "@/features/training/hooks/useStartSession";
import { Card } from "@/shared/components/Card";
import { Icon } from "@/shared/components/Icon";
import { getLocalDateKey } from "@/shared/utils/dateKey";

/** Resumo do dia: sequência, meta diária e revisões pendentes. */
export function TodayCard() {
  const { t } = useTranslation();
  const progress = useProgressStore((state) => state.progress);
  const dailyGoal = useOnboardingStore((state) => state.dailyGoal);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const startTraining = useStartSession();

  const goal = dailyGoal ?? defaultSessionSize;
  const playedToday = progress.lastPlayedAt
    ? getLocalDateKey(new Date(progress.lastPlayedAt)) === getLocalDateKey()
    : false;
  const reviewCount = countCountriesDueForReview(progress);

  const handleReview = () => {
    startTraining({ mode: "review", questionType: "choice", size: defaultSessionSize });
  };

  return (
    <Card className="flex flex-col gap-3 p-5">
      <h2 className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-text-muted">
        {t("learn.today")}
      </h2>

      <div className="flex items-center gap-3 rounded-btn border border-line bg-surface-raised px-3 py-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-chip bg-danger-soft text-danger">
          <Icon name="flame" size={19} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-black leading-tight">
            {progress.dailyStreak.currentStreak}
            <span className="ml-1 text-xs font-bold text-text-muted">{t("home.streakDays")}</span>
          </span>
          <span className="block text-[0.7rem] font-bold text-text-muted">
            {t("home.streakTitle")}
          </span>
        </span>
      </div>

      <div className="flex items-center gap-3 rounded-btn border border-line bg-surface-raised px-3 py-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-chip bg-accent-soft text-warning">
          <Icon name="zap" size={19} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="text-[0.8rem] font-extrabold">{t("home.dailyGoal.title")}</span>
            <span className="text-xs font-bold text-text-muted">
              {playedToday ? t("learn.goalDone") : t("learn.goalPending", { goal })}
            </span>
          </span>
          <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-line">
            <span
              className="block h-full rounded-full bg-warning transition-[width] duration-300"
              style={{ width: playedToday ? "100%" : "0%" }}
            />
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={handleReview}
        disabled={reviewCount === 0}
        className="flex cursor-pointer items-center gap-3 rounded-btn border border-line bg-surface-raised px-3 py-2.5 text-left transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:hover:bg-surface-raised"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-chip bg-pine-soft text-primary">
          <Icon name="refresh" size={19} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.8rem] font-extrabold">{t("learn.reviews")}</span>
          <span className="block text-[0.7rem] font-bold text-text-muted">
            {reviewCount > 0
              ? t("learn.reviewsPending", { count: reviewCount })
              : t("home.noReviewCountries")}
          </span>
        </span>
        {reviewCount > 0 && (
          <span className="text-lg font-black text-primary" aria-hidden="true">
            {reviewCount}
          </span>
        )}
      </button>

      <DailyStreakLine streak={progress.dailyStreak} />
    </Card>
  );
}
