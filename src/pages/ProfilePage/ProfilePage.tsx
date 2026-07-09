import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { playerInitials } from "@/app/AppShell";
import {
  countUnlockedAchievements,
  listAchievementViews,
} from "@/entities/achievement/achievement.selectors";
import { countLearnedCountries } from "@/entities/progress/progress.selectors";
import { CoinBalance } from "@/features/cosmetics/components/CoinBalance";
import { avatarStyleClass } from "@/features/cosmetics/logic/avatarStyles";
import { useEquippedId } from "@/features/cosmetics/store/useCosmetics";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import { getLevelProgress } from "@/features/progress/logic/xp";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { Orbi } from "@/shared/brand/Orbi";
import { Card } from "@/shared/components/Card";
import { Icon, type IconName } from "@/shared/components/Icon";
import { PageTransition } from "@/shared/components/PageTransition";

type StatTile = {
  icon: IconName;
  iconClass: string;
  value: number;
  labelKey: string;
};

/** Linha de acesso do Perfil (Loja, Conquistas, Estatísticas, Configurações). */
function ProfileLinkRow({
  to,
  icon,
  label,
  trailing,
}: {
  to: string;
  icon: IconName;
  label: string;
  trailing?: string;
}) {
  return (
    <Link
      to={to}
      className="flex min-h-12 items-center gap-3 rounded-btn border border-line bg-surface px-3.5 shadow-sm transition hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-chip bg-pine-soft text-primary">
        <Icon name={icon} size={18} />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-extrabold text-text">{label}</span>
      {trailing && <span className="shrink-0 text-xs font-bold text-text-muted">{trailing}</span>}
      <Icon name="chevron-right" size={17} className="shrink-0 text-faint" />
    </Link>
  );
}

export function ProfilePage() {
  const { t } = useTranslation();
  const progress = useProgressStore((state) => state.progress);
  const playerName = useOnboardingStore((state) => state.playerName);
  const avatarCosmeticId = useEquippedId("avatarCosmetic");

  const displayName = playerName.trim() || t("profile.player");
  const initials = playerInitials(displayName);
  const level = progress.level;
  const levelProgress = getLevelProgress(progress.totalXp);
  const learned = countLearnedCountries(progress);
  const unlockedAchievements = countUnlockedAchievements(progress);
  const recentAchievements = listAchievementViews(progress)
    .filter((view) => view.unlocked)
    .sort((a, b) => (b.unlockedAt ?? "").localeCompare(a.unlockedAt ?? ""))
    .slice(0, 4);

  const statTiles: StatTile[] = [
    {
      icon: "flame",
      iconClass: "bg-danger-soft text-danger",
      value: progress.dailyStreak.currentStreak,
      labelKey: "profile.stats.streak",
    },
    {
      icon: "globe",
      iconClass: "bg-pine-soft text-primary",
      value: learned,
      labelKey: "profile.stats.countries",
    },
    {
      icon: "trophy",
      iconClass: "bg-accent-soft text-warning",
      value: unlockedAchievements,
      labelKey: "profile.stats.achievements",
    },
    {
      icon: "check-circle",
      iconClass: "bg-success-soft text-success",
      value: progress.completedSessions,
      labelKey: "profile.stats.sessions",
    },
  ];

  return (
    <PageTransition className="mx-auto grid min-h-full w-full max-w-[1080px] gap-4 py-1 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <section className="flex min-w-0 flex-col gap-4">
        <Card className="flex flex-col gap-5 p-6">
          <div className="flex items-center gap-4">
            <span className="relative inline-flex">
              <span
                className={`flex size-16 items-center justify-center rounded-[18px] text-xl font-black text-white shadow-card ${avatarStyleClass(avatarCosmeticId)}`}
              >
                {initials || <Icon name="user" size={28} />}
              </span>
              <span className="absolute -bottom-1.5 -right-1.5 flex size-7 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground ring-2 ring-surface">
                {level}
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-black text-text sm:text-2xl">{displayName}</h1>
              <p className="text-sm font-bold text-text-muted">
                {t("profile.levelTitle", { level, title: t("profile.player") })}
              </p>
            </div>
            <Link
              to="/settings"
              aria-label={t("home.settings")}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-btn border border-line bg-surface text-muted shadow-sm transition hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon name="settings" size={20} />
            </Link>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 text-sm font-extrabold">
              <span>{t("profile.levelProgress", { level, next: level + 1 })}</span>
              <span className="text-text-muted">
                {levelProgress.currentLevelXp} / {Math.max(1, levelProgress.xpForNextLevel)} XP
              </span>
            </div>
            <span className="mt-2 block h-2.5 overflow-hidden rounded-full bg-line">
              <span
                className="block h-full rounded-full bg-primary transition-[width] duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(
                      (levelProgress.currentLevelXp / Math.max(1, levelProgress.xpForNextLevel)) *
                        100,
                    ),
                  )}%`,
                }}
              />
            </span>
          </div>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {statTiles.map((tile) => (
              <li
                key={tile.labelKey}
                className="flex flex-col items-center gap-1 rounded-btn border border-line bg-surface-raised px-2 py-3 text-center"
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-chip ${tile.iconClass}`}
                >
                  <Icon name={tile.icon} size={18} />
                </span>
                <span className="text-xl font-black text-text">{tile.value}</span>
                <span className="text-[0.68rem] font-bold text-text-muted">{t(tile.labelKey)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold text-text">{t("profile.recentAchievements")}</h2>
            <Link
              to="/achievements"
              className="text-sm font-extrabold text-primary transition hover:text-pine-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("profile.viewAll")}
            </Link>
          </div>
          {recentAchievements.length > 0 ? (
            <ul className="flex flex-wrap gap-3">
              {recentAchievements.map((achievement) => (
                <li
                  key={achievement.id}
                  className="flex size-14 items-center justify-center rounded-btn bg-accent-soft text-warning"
                  title={t(`achievements.items.${achievement.id}.title`)}
                >
                  <Icon
                    name={achievement.icon}
                    size={26}
                    title={t(`achievements.items.${achievement.id}.title`)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-semibold text-text-muted">{t("profile.noAchievements")}</p>
          )}
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <span className="w-16 shrink-0">
            <Orbi expression="piscada" flag={false} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-extrabold text-text">{t("profile.avatarTitle")}</h2>
            <p className="text-xs font-semibold text-text-muted">{t("profile.avatarBody")}</p>
          </div>
          <Link
            to="/shop"
            className="shrink-0 rounded-btn bg-pine-soft px-4 py-2.5 text-sm font-extrabold text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("nav.shop")}
          </Link>
        </Card>
      </section>

      <aside className="flex min-w-0 flex-col gap-2.5">
        <Link
          to="/shop"
          className="flex min-h-14 items-center gap-3 rounded-card border border-line bg-surface px-4 shadow-card transition hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-btn bg-accent-soft text-warning">
            <Icon name="shop" size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold text-text">{t("nav.shop")}</span>
            <CoinBalance className="text-xs" />
          </span>
          <Icon name="chevron-right" size={17} className="shrink-0 text-faint" />
        </Link>

        <h2 className="mt-2 px-1 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-text-muted">
          {t("profile.sectionsTitle")}
        </h2>
        <ProfileLinkRow
          to="/achievements"
          icon="trophy"
          label={t("nav.achievements")}
          trailing={`${unlockedAchievements}`}
        />
        <ProfileLinkRow to="/stats" icon="chart" label={t("home.stats")} />
        <ProfileLinkRow to="/settings" icon="settings" label={t("home.settings")} />
      </aside>
    </PageTransition>
  );
}
