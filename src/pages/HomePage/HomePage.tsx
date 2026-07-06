import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  countLearnedCountries,
  countSeenCountries,
  listCountriesNeedingReview,
} from "@/entities/progress/progress.selectors";
import { CoinBalance } from "@/features/cosmetics/components/CoinBalance";
import { Mascot } from "@/features/cosmetics/components/Mascot";
import { DailyMissionsCard } from "@/features/missions/components/DailyMissionsCard";
import { DailyStreakLine } from "@/features/progress/components/DailyStreakLine";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useSessionStore } from "@/features/training/store/sessionStore";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Icon, type IconName } from "@/shared/components/Icon";
import { PageTransition } from "@/shared/components/PageTransition";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { COUNTRIES } from "@/shared/data/countries";

const SHORTCUTS = [
  { to: "/challenges", icon: "target", labelKey: "home.challenges" },
  { to: "/continents", icon: "compass", labelKey: "home.continents" },
  { to: "/collection", icon: "collection", labelKey: "home.collection" },
  { to: "/achievements", icon: "trophy", labelKey: "home.achievements" },
  { to: "/stats", icon: "chart", labelKey: "home.stats" },
  { to: "/settings", icon: "settings", labelKey: "home.settings" },
] satisfies readonly { icon: IconName; labelKey: string; to: string }[];

function FirstStepsCard() {
  const { t } = useTranslation();
  const steps = ["home.firstSteps.train", "home.firstSteps.xp", "home.firstSteps.badge"] as const;

  return (
    <Card className="flex flex-col gap-3 p-4">
      <h2 className="text-sm font-extrabold text-text-muted">{t("home.firstSteps.title")}</h2>
      <ul className="flex flex-col gap-2">
        {steps.map((step) => (
          <li key={step} className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex size-6 items-center justify-center rounded-full bg-pine-soft text-primary">
              <Icon name="check" size={15} strokeWidth={2.6} />
            </span>
            {t(step)}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const progress = useProgressStore((state) => state.progress);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const startSession = useSessionStore((state) => state.startSession);
  const learned = countLearnedCountries(progress);
  const seen = countSeenCountries(progress);
  const total = COUNTRIES.length;
  const reviewCount = listCountriesNeedingReview(progress).length;
  const isFirstRun = progress.completedSessions === 0 && progress.totalXp === 0 && seen === 0;

  const handleContinueTraining = () => {
    startSession({ mode: "continue", questionType: "choice", size: defaultSessionSize });
    navigate("/training");
  };

  const handleReview = () => {
    startSession({ mode: "review", questionType: "choice", size: defaultSessionSize });
    navigate("/training");
  };

  return (
    <PageTransition className="mx-auto flex min-h-full w-full max-w-5xl flex-col justify-center gap-6 py-4 lg:min-h-0">
      <header className="text-center lg:text-left">
        <div className="mx-auto flex size-16 items-center justify-center rounded-xl2 bg-ink text-platinum shadow-card lg:mx-0">
          <Icon name="globe" size={34} strokeWidth={2.1} />
        </div>
        <h1 className="mt-3 text-3xl font-black">{t("app.name")}</h1>
        <p className="mt-1 font-semibold text-text-muted">{t("app.tagline")}</p>
        <Mascot size="md" className="mt-2" />
      </header>

      <Card className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="font-extrabold">{t("home.learnedCount", { learned, total })}</span>
          <span className="text-sm font-bold text-text-muted">
            {t("home.level", { level: progress.level })} /{" "}
            {t("home.totalXp", { xp: progress.totalXp })}
          </span>
        </div>
        <ProgressBar
          value={learned}
          max={total}
          label={t("home.learnedCount", { learned, total })}
        />
      </Card>

      <Link
        to="/shop"
        className="flex items-center justify-between rounded-card border border-line bg-surface px-4 py-3 shadow-card transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="inline-flex items-center gap-2 font-extrabold">
          <Icon name="shop" size={19} className="text-primary" />
          {t("home.shop")}
        </span>
        <CoinBalance />
      </Link>

      <DailyStreakLine streak={progress.dailyStreak} />

      {isFirstRun ? <FirstStepsCard /> : <DailyMissionsCard />}

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" fullWidth onClick={handleContinueTraining}>
            <Icon name="play" size={20} fill="currentColor" strokeWidth={1.8} />
            {t(isFirstRun ? "home.startFirstTraining" : "home.continueTraining")}
          </Button>
          {!isFirstRun && reviewCount > 0 && (
            <Button variant="secondary" size="lg" fullWidth onClick={handleReview}>
              <Icon name="refresh" size={20} />
              {t("review.cta")}
            </Button>
          )}
        </div>
        {isFirstRun && (
          <p className="text-center text-sm font-semibold text-text-muted sm:text-left">
            {t("home.firstTrainingHint", { count: defaultSessionSize })}
          </p>
        )}
      </div>

      <nav
        aria-label={t("app.name")}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
      >
        {SHORTCUTS.map((shortcut) => (
          <Link
            key={shortcut.to}
            to={shortcut.to}
            className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-card border border-line bg-surface p-3 text-center shadow-card transition hover:-translate-y-0.5 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span
              className="flex size-10 items-center justify-center rounded-btn bg-pine-soft text-primary"
              aria-hidden="true"
            >
              <Icon name={shortcut.icon} size={21} />
            </span>
            <span className="text-sm font-extrabold">{t(shortcut.labelKey)}</span>
          </Link>
        ))}
      </nav>
    </PageTransition>
  );
}
