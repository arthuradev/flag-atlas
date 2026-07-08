import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { Icon } from "@/shared/components/Icon";

/** Saudação com nível/XP e atalhos para conquistas e loja. */
export function HomeHeader() {
  const { t } = useTranslation();
  const level = useProgressStore((state) => state.progress.level);
  const totalXp = useProgressStore((state) => state.progress.totalXp);
  const playerName = useOnboardingStore((state) => state.playerName);

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-black text-primary-foreground shadow-card">
          {level}
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-black text-text">
            {playerName ? t("home.greeting", { name: playerName }) : t("home.greetingFallback")}
          </p>
          <p className="text-sm font-bold text-text-muted">
            {t("home.level", { level })} - {t("home.totalXp", { xp: totalXp })}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          to="/achievements"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-btn border border-line bg-surface px-3 font-extrabold text-text shadow-sm transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon name="trophy" size={18} className="text-primary" />
          {t("home.achievements")}
        </Link>
        <Link
          to="/shop"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-btn border border-line bg-surface px-3 font-extrabold text-text shadow-sm transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon name="shop" size={18} className="text-primary" />
          {t("home.shop")}
        </Link>
      </div>
    </header>
  );
}
