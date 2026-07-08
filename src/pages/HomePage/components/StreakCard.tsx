import { useTranslation } from "react-i18next";
import { DailyStreakLine } from "@/features/progress/components/DailyStreakLine";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { Card } from "@/shared/components/Card";
import { Icon } from "@/shared/components/Icon";

/** Sequência diária de dias jogados. */
export function StreakCard() {
  const { t } = useTranslation();
  const dailyStreak = useProgressStore((state) => state.progress.dailyStreak);

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-text-muted">{t("home.streakTitle")}</h2>
        <Icon name="flame" size={20} className="text-danger" />
      </div>
      <div>
        <span className="text-4xl font-black text-text">{dailyStreak.currentStreak}</span>
        <span className="ml-1 text-sm font-bold text-text-muted">{t("home.streakDays")}</span>
      </div>
      <DailyStreakLine streak={dailyStreak} />
    </Card>
  );
}
