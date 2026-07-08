import { useTranslation } from "react-i18next";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { Card } from "@/shared/components/Card";
import { Icon } from "@/shared/components/Icon";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { getLocalDateKey } from "@/shared/utils/dateKey";

/** Meta diária de perguntas, marcada como cumprida se jogou hoje. */
export function DailyGoalCard() {
  const { t } = useTranslation();
  const lastPlayedAt = useProgressStore((state) => state.progress.lastPlayedAt);
  const dailyGoal = useOnboardingStore((state) => state.dailyGoal);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);

  const goal = dailyGoal ?? defaultSessionSize;
  const playedToday = lastPlayedAt
    ? getLocalDateKey(new Date(lastPlayedAt)) === getLocalDateKey()
    : false;
  const dailyGoalProgress = playedToday ? 1 : 0;

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-text-muted">{t("home.dailyGoal.title")}</h2>
        <Icon name="target" size={20} className="text-primary" />
      </div>
      <div>
        <span className="text-4xl font-black text-text">{goal}</span>
        <span className="ml-1 text-sm font-bold text-text-muted">
          {t("home.dailyGoal.questions")}
        </span>
      </div>
      <ProgressBar
        value={dailyGoalProgress}
        max={goal}
        label={t("home.dailyGoal.title")}
        colorClassName="bg-primary"
      />
    </Card>
  );
}
