import { countSeenCountries } from "@/entities/progress/progress.selectors";
import { DailyMissionsCard } from "@/features/missions/components/DailyMissionsCard";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { PageTransition } from "@/shared/components/PageTransition";
import { CoinShortcutCard } from "./components/CoinShortcutCard";
import { ContinentProgressCard } from "./components/ContinentProgressCard";
import { DailyGoalCard } from "./components/DailyGoalCard";
import { FirstStepsCard } from "./components/FirstStepsCard";
import { HeroTrainingCard } from "./components/HeroTrainingCard";
import { HomeHeader } from "./components/HomeHeader";
import { HomeStatsRow } from "./components/HomeStatsRow";
import { ReviewCountriesCard } from "./components/ReviewCountriesCard";
import { StreakCard } from "./components/StreakCard";
import { TrainingModesSection } from "./components/TrainingModesSection";

export function HomePage() {
  const progress = useProgressStore((state) => state.progress);
  const isFirstRun =
    progress.completedSessions === 0 &&
    progress.totalXp === 0 &&
    countSeenCountries(progress) === 0;

  return (
    <PageTransition className="mx-auto grid min-h-full w-full max-w-[1180px] gap-4 py-1 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="flex min-w-0 flex-col gap-4">
        <HomeHeader />
        <HeroTrainingCard isFirstRun={isFirstRun} />
        <HomeStatsRow />
        <TrainingModesSection />
        <ContinentProgressCard />
        {isFirstRun && <FirstStepsCard />}
      </section>

      <aside className="flex min-w-0 flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <DailyGoalCard />
          <StreakCard />
        </div>

        <DailyMissionsCard />
        <CoinShortcutCard />
        <ReviewCountriesCard />
      </aside>
    </PageTransition>
  );
}
