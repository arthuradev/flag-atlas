import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { playerInitials } from "@/app/AppShell";
import {
  countUnlockedAchievements,
  listAchievementViews,
} from "@/entities/achievement/achievement.selectors";
import { countLearnedCountries } from "@/entities/progress/progress.selectors";
import { avatarStyleClass } from "@/features/cosmetics/logic/avatarStyles";
import { useCoins, useEquippedId } from "@/features/cosmetics/store/useCosmetics";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import { getLevelProgress } from "@/features/progress/logic/xp";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { Icon, type IconName } from "@/shared/components/Icon";
import { PageTransition } from "@/shared/components/PageTransition";

type StatTile = {
  icon: IconName;
  iconClass: string;
  value: number;
  labelKey: string;
};

/** Cores dos chips circulares de conquistas recentes, na ordem do design. */
const RECENT_CHIP_COLORS = ["#E7A81E", "#FF6F5C", "#12C2D6", "#22B07A"];

function AccountRow({
  to,
  icon,
  label,
  trailing,
  isLast,
}: {
  to: string;
  icon: IconName;
  label: string;
  trailing?: string;
  isLast?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-1 py-3 transition hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        isLast ? "" : "border-b border-line"
      }`}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-surface-raised text-muted">
        <Icon name={icon} size={16} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[13.5px] font-extrabold text-text">
        {label}
      </span>
      {trailing && <span className="shrink-0 text-xs font-bold text-text-muted">{trailing}</span>}
      <Icon name="chevron-right" size={16} className="shrink-0 text-faint" />
    </Link>
  );
}

export function ProfilePage() {
  const { t } = useTranslation();
  const progress = useProgressStore((state) => state.progress);
  const playerName = useOnboardingStore((state) => state.playerName);
  const avatarCosmeticId = useEquippedId("avatarCosmetic");
  const coins = useCoins();

  const displayName = playerName.trim() || t("profile.player");
  const initials = playerInitials(displayName);
  const level = progress.level;
  const levelProgress = getLevelProgress(progress.totalXp);
  const levelPercent = Math.min(
    100,
    Math.round((levelProgress.currentLevelXp / Math.max(1, levelProgress.xpForNextLevel)) * 100),
  );
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
      icon: "collection",
      iconClass: "bg-pine-soft text-primary",
      value: learned,
      labelKey: "profile.stats.countries",
    },
    {
      icon: "trophy",
      iconClass: "bg-accent-soft text-gold",
      value: unlockedAchievements,
      labelKey: "profile.stats.achievements",
    },
    {
      icon: "zap",
      iconClass: "bg-success-soft text-success",
      value: progress.completedSessions,
      labelKey: "profile.stats.sessions",
    },
  ];

  return (
    <PageTransition className="mx-auto grid min-h-full w-full max-w-[1080px] gap-[22px] py-1 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
      <section className="flex min-w-0 flex-col gap-[18px]">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <span
              className={`flex size-[72px] items-center justify-center rounded-full text-2xl font-black tracking-tight text-white shadow-[0_10px_22px_-8px_rgba(229,83,63,0.5)] ${avatarStyleClass(avatarCosmeticId)}`}
            >
              {initials || <Icon name="user" size={30} />}
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 flex size-6 items-center justify-center rounded-full border-2 border-surface bg-primary text-[11px] font-black text-primary-foreground">
              {level}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[22px] font-black text-text">{displayName}</h1>
            <p className="mt-0.5 text-[13px] font-bold text-text-muted">
              {t("profile.levelTitle", { level, title: t("profile.player") })}
            </p>
          </div>
          <Link
            to="/settings"
            aria-label={t("home.settings")}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon name="settings" size={19} />
          </Link>
        </div>

        <div className="rounded-[15px] border border-line bg-surface px-4 py-3.5">
          <div className="mb-2 flex justify-between text-[12.5px] font-extrabold text-text">
            <span>{t("profile.levelProgress", { level, next: level + 1 })}</span>
            <span className="text-text-muted">
              {levelProgress.currentLevelXp} / {Math.max(1, levelProgress.xpForNextLevel)} XP
            </span>
          </div>
          <span className="block h-[9px] overflow-hidden rounded-full bg-surface-2">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-primary to-pine-hover transition-[width] duration-300"
              style={{ width: `${levelPercent}%` }}
            />
          </span>
        </div>

        <ul className="flex gap-3">
          {statTiles.map((tile) => (
            <li
              key={tile.labelKey}
              className="flex flex-1 flex-col items-center gap-1.5 rounded-[15px] border border-line bg-surface px-2.5 py-3.5"
            >
              <span
                className={`flex size-[34px] items-center justify-center rounded-[10px] ${tile.iconClass}`}
              >
                <Icon name={tile.icon} size={18} />
              </span>
              <span className="text-[17px] font-black leading-none text-text">{tile.value}</span>
              <span className="text-center text-[10.5px] font-bold text-text-muted">
                {t(tile.labelKey)}
              </span>
            </li>
          ))}
        </ul>

        <div className="rounded-[15px] border border-line bg-surface p-4">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-[13px] font-black text-text">{t("profile.recentAchievements")}</h2>
            <Link
              to="/achievements"
              className="text-xs font-extrabold text-primary transition hover:text-pine-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("profile.viewAll")}
            </Link>
          </div>
          {recentAchievements.length > 0 ? (
            <ul className="flex gap-2.5">
              {recentAchievements.map((achievement, index) => {
                const color = RECENT_CHIP_COLORS[index % RECENT_CHIP_COLORS.length];
                return (
                  <li
                    key={achievement.id}
                    className="flex size-[38px] items-center justify-center rounded-full"
                    style={{
                      background: `${color}22`,
                      color,
                      boxShadow: `0 0 0 2px ${color}18`,
                    }}
                    title={t(`achievements.items.${achievement.id}.title`)}
                  >
                    <Icon
                      name={achievement.icon}
                      size={18}
                      title={t(`achievements.items.${achievement.id}.title`)}
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-[12.5px] font-semibold text-text-muted">
              {t("profile.noAchievements")}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 rounded-[15px] border border-dashed border-line-strong px-4 py-3.5">
          <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[11px] bg-pine-soft text-primary">
            <Icon name="user" size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-extrabold text-text">{t("profile.avatarTitle")}</p>
            <p className="text-[11.5px] font-semibold text-text-muted">{t("profile.avatarBody")}</p>
          </div>
        </div>
      </section>

      <aside className="flex min-w-0 flex-col gap-4">
        <Link
          to="/shop"
          className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-[#173A5C] to-[#0F2A44] p-4 text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.12]">
            <Icon name="shop" size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13.5px] font-black">{t("nav.shop")}</span>
            <span className="block text-[11.5px] font-semibold text-[#EAF2F8]/75">
              {t("profile.coinsCount", { coins })}
            </span>
          </span>
          <Icon name="chevron-right" size={18} className="shrink-0" />
        </Link>

        <nav
          aria-label={t("profile.sectionsTitle")}
          className="rounded-[15px] border border-line bg-surface px-3.5 py-1.5"
        >
          <h2 className="px-1 pb-1 pt-2.5 text-[11px] font-black uppercase tracking-[0.08em] text-text-muted">
            {t("profile.sectionsTitle")}
          </h2>
          <AccountRow
            to="/achievements"
            icon="trophy"
            label={t("nav.achievements")}
            trailing={`${unlockedAchievements}`}
          />
          <AccountRow to="/stats" icon="chart" label={t("home.stats")} />
          <AccountRow to="/settings" icon="settings" label={t("home.settings")} isLast />
        </nav>
      </aside>
    </PageTransition>
  );
}
