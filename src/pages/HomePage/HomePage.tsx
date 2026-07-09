import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { countSeenCountries } from "@/entities/progress/progress.selectors";
import { CoinBalance } from "@/features/cosmetics/components/CoinBalance";
import { DailyMissionsCard } from "@/features/missions/components/DailyMissionsCard";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { PageTransition } from "@/shared/components/PageTransition";
import { FirstStepsCard } from "./components/FirstStepsCard";
import { LearnHero } from "./components/LearnHero";
import { QuickTrainingCard } from "./components/QuickTrainingCard";
import { TodayCard } from "./components/TodayCard";
import { WorldProgressCard } from "./components/WorldProgressCard";

/** Saudação enxuta: nome, nível e atalhos contextuais (moedas/perfil no mobile). */
function LearnHeader() {
  const { t } = useTranslation();
  const level = useProgressStore((state) => state.progress.level);
  const playerName = useOnboardingStore((state) => state.playerName);

  return (
    <header className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-black text-text sm:text-[1.7rem]">
          {playerName ? t("home.greeting", { name: playerName }) : t("home.greetingFallback")}
        </h1>
        <p className="text-sm font-semibold text-text-muted">{t("learn.headerHint")}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Link
          to="/shop"
          aria-label={t("home.shop")}
          className="inline-flex min-h-9 items-center rounded-full border border-line bg-surface px-3 shadow-sm transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CoinBalance className="text-sm" />
        </Link>
        <Link
          to="/profile"
          aria-label={t("nav.profile")}
          className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          {level}
        </Link>
      </div>
    </header>
  );
}

export function HomePage() {
  const progress = useProgressStore((state) => state.progress);
  const isFirstRun =
    progress.completedSessions === 0 &&
    progress.totalXp === 0 &&
    countSeenCountries(progress) === 0;

  return (
    <PageTransition className="mx-auto grid min-h-full w-full max-w-[1180px] gap-4 py-1 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="flex min-w-0 flex-col gap-4">
        <LearnHeader />
        <LearnHero isFirstRun={isFirstRun} />
        <DailyMissionsCard />
        <QuickTrainingCard />
        {isFirstRun && <FirstStepsCard />}
      </section>

      <aside className="flex min-w-0 flex-col gap-4">
        <TodayCard />
        <WorldProgressCard />
      </aside>
    </PageTransition>
  );
}
