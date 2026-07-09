import { useTranslation } from "react-i18next";
import { ACHIEVEMENTS } from "@/entities/achievement/achievement.catalog";
import {
  countUnlockedAchievements,
  listAchievementViews,
} from "@/entities/achievement/achievement.selectors";
import { ACHIEVEMENT_CATEGORIES } from "@/entities/achievement/achievement.types";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { Card } from "@/shared/components/Card";
import { Icon } from "@/shared/components/Icon";
import { PageTransition } from "@/shared/components/PageTransition";
import { ProgressBar } from "@/shared/components/ProgressBar";

export function AchievementsPage() {
  const { t } = useTranslation();
  const progress = useProgressStore((state) => state.progress);
  const views = listAchievementViews(progress);
  const unlockedCount = countUnlockedAchievements(progress);

  const recent = views
    .filter((view) => view.unlocked)
    .sort((a, b) => (b.unlockedAt ?? "").localeCompare(a.unlockedAt ?? ""))
    .slice(0, 3);

  const categories = ACHIEVEMENT_CATEGORIES.map((category) => {
    const inCategory = views.filter((view) => view.category === category);
    return {
      category,
      unlocked: inCategory.filter((view) => view.unlocked).length,
      total: inCategory.length,
    };
  }).filter((entry) => entry.total > 0);

  return (
    <PageTransition className="mx-auto flex min-h-full w-full max-w-[1080px] flex-col gap-4 py-1">
      <header className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-black text-text sm:text-[1.7rem]">
            {t("achievements.title")}
          </h1>
          <p className="text-sm font-semibold text-text-muted">
            {t("achievements.unlockedCount", {
              unlocked: unlockedCount,
              total: ACHIEVEMENTS.length,
            })}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-black text-text shadow-sm">
          <Icon name="trophy" size={16} className="text-warning" />
          {unlockedCount} / {ACHIEVEMENTS.length}
        </span>
      </header>

      {recent.length > 0 && (
        <section aria-labelledby="achievements-recent" className="flex flex-col gap-2">
          <h2
            id="achievements-recent"
            className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-text-muted"
          >
            {t("achievements.recentTitle")}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-3">
            {recent.map((view) => (
              <li
                key={view.id}
                className="flex items-center gap-3 rounded-card border border-line bg-gradient-to-br from-accent-soft/70 to-transparent p-4 shadow-card"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-btn bg-accent-soft text-warning ring-1 ring-gold/25">
                  <Icon name={view.icon} size={24} strokeWidth={1.9} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-extrabold text-text">
                    {t(`achievements.items.${view.id}.title`)}
                  </span>
                  <span className="block text-xs font-bold text-text-muted">
                    {t("achievements.unlocked")}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {categories.length > 0 && (
        <section aria-labelledby="achievements-categories" className="flex flex-col gap-2">
          <h2
            id="achievements-categories"
            className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-text-muted"
          >
            {t("achievements.byCategory")}
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {categories.map((entry) => (
              <li
                key={entry.category}
                className="flex flex-col gap-1.5 rounded-card border border-line bg-surface p-3.5 shadow-card"
              >
                <span className="flex items-center justify-between gap-2 text-[0.8rem] font-extrabold text-text">
                  {t(`achievements.categories.${entry.category}`)}
                  <span className="text-xs font-bold text-text-muted">
                    {entry.unlocked}/{entry.total}
                  </span>
                </span>
                <span className="block h-1.5 overflow-hidden rounded-full bg-line">
                  <span
                    className="block h-full rounded-full bg-warning"
                    style={{
                      width: `${entry.total > 0 ? Math.round((entry.unlocked / entry.total) * 100) : 0}%`,
                    }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="achievements-gallery" className="flex flex-col gap-2 pb-4">
        <h2
          id="achievements-gallery"
          className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-text-muted"
        >
          {t("achievements.galleryTitle")}
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {views.map((view) => (
            <li key={view.id}>
              <Card
                data-testid="achievement-card"
                data-unlocked={view.unlocked}
                className={`flex h-full flex-col gap-2 p-4 ${view.unlocked ? "" : "opacity-70"}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl ${
                      view.unlocked
                        ? "bg-ocre-soft text-gold ring-1 ring-gold/25"
                        : "bg-surface-2 text-faint"
                    }`}
                  >
                    <Icon name={view.unlocked ? view.icon : "lock"} size={28} strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-extrabold">{t(`achievements.items.${view.id}.title`)}</h3>
                    <p className="text-sm text-text-muted">
                      {t(`achievements.items.${view.id}.description`)}
                    </p>
                  </div>
                </div>
                {view.unlocked ? (
                  <p className="inline-flex items-center gap-1.5 text-sm font-bold text-success">
                    <Icon name="check-circle" size={16} />
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
      </section>
    </PageTransition>
  );
}
