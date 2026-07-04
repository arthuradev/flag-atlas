import { useTranslation } from "react-i18next";
import { ACHIEVEMENTS } from "@/entities/achievement/achievement.catalog";
import {
  countUnlockedAchievements,
  listAchievementViews,
} from "@/entities/achievement/achievement.selectors";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { Card } from "@/shared/components/Card";
import { PageShell } from "@/shared/components/PageShell";
import { ProgressBar } from "@/shared/components/ProgressBar";

export function AchievementsPage() {
  const { t } = useTranslation();
  const progress = useProgressStore((state) => state.progress);
  const views = listAchievementViews(progress);
  const unlockedCount = countUnlockedAchievements(progress);

  return (
    <PageShell title={t("achievements.title")} backTo="/home">
      <div className="flex flex-col gap-4 pb-4">
        <p className="font-bold text-text-muted">
          {t("achievements.unlockedCount", { unlocked: unlockedCount, total: ACHIEVEMENTS.length })}
        </p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {views.map((view) => (
            <li key={view.id}>
              <Card
                data-testid="achievement-card"
                data-unlocked={view.unlocked}
                className={`flex h-full flex-col gap-2 p-4 ${view.unlocked ? "" : "opacity-70"}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl" aria-hidden="true">
                    {view.unlocked ? view.emoji : "🔒"}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-extrabold">{t(`achievements.items.${view.id}.title`)}</h2>
                    <p className="text-sm text-text-muted">
                      {t(`achievements.items.${view.id}.description`)}
                    </p>
                  </div>
                </div>
                {view.unlocked ? (
                  <p className="text-sm font-bold text-success">
                    <span aria-hidden="true">✓ </span>
                    {t("achievements.unlocked")}
                  </p>
                ) : view.progress && view.progress.current > 0 ? (
                  <div className="flex items-center gap-3">
                    <ProgressBar
                      value={view.progress.current}
                      max={view.progress.target}
                      size="thin"
                      label={t(`achievements.items.${view.id}.title`)}
                    />
                    <span className="shrink-0 text-xs font-bold text-text-muted">
                      {view.progress.current}/{view.progress.target}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-text-muted">
                    {t("achievements.locked")}
                  </p>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
