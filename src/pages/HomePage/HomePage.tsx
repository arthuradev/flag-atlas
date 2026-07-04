import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  countLearnedCountries,
  listCountriesNeedingReview,
} from "@/entities/progress/progress.selectors";
import { CoinBalance } from "@/features/cosmetics/components/CoinBalance";
import { Mascot } from "@/features/cosmetics/components/Mascot";
import { DailyMissionsCard } from "@/features/missions/components/DailyMissionsCard";
import { DailyStreakLine } from "@/features/progress/components/DailyStreakLine";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useSessionStore } from "@/features/training/store/sessionStore";
import { playSound } from "@/shared/audio/soundPlayer";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { COUNTRIES } from "@/shared/data/countries";

const SHORTCUTS = [
  { to: "/challenges", emoji: "🎯", labelKey: "home.challenges" },
  { to: "/continents", emoji: "🧭", labelKey: "home.continents" },
  { to: "/collection", emoji: "🎒", labelKey: "home.collection" },
  { to: "/achievements", emoji: "🏆", labelKey: "home.achievements" },
  { to: "/stats", emoji: "📊", labelKey: "home.stats" },
  { to: "/settings", emoji: "⚙️", labelKey: "home.settings" },
] as const;

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const progress = useProgressStore((state) => state.progress);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const startSession = useSessionStore((state) => state.startSession);
  const learned = countLearnedCountries(progress);
  const total = COUNTRIES.length;
  const reviewCount = listCountriesNeedingReview(progress).length;

  const handleContinueTraining = () => {
    playSound("click");
    navigate("/training");
  };

  const handleReview = () => {
    playSound("click");
    navigate("/training");
    startSession({ mode: "review", questionType: "choice", size: defaultSessionSize });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-4 py-8"
    >
      <header className="text-center">
        <p className="text-5xl" aria-hidden="true">
          🌍
        </p>
        <h1 className="mt-2 text-3xl font-extrabold">{t("app.name")}</h1>
        <p className="mt-1 text-text-muted">{t("app.tagline")}</p>
        <Mascot size="md" className="mt-2" />
      </header>

      <Card className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="font-bold">{t("home.learnedCount", { learned, total })}</span>
          <span className="text-sm text-text-muted">
            {t("home.level", { level: progress.level })} ·{" "}
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
        className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm transition hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="inline-flex items-center gap-2 font-bold">
          <span aria-hidden="true">🛍️</span>
          {t("home.shop")}
        </span>
        <CoinBalance />
      </Link>

      <DailyStreakLine streak={progress.dailyStreak} />

      <DailyMissionsCard />

      <div className="flex flex-col gap-3">
        <Button size="lg" fullWidth onClick={handleContinueTraining}>
          {t("home.continueTraining")}
        </Button>
        {reviewCount > 0 && (
          <Button variant="secondary" size="lg" fullWidth onClick={handleReview}>
            🔁 {t("review.cta")}
          </Button>
        )}
      </div>

      <nav aria-label={t("app.name")} className="grid grid-cols-3 gap-3">
        {SHORTCUTS.map((shortcut) => (
          <Link
            key={shortcut.to}
            to={shortcut.to}
            className="flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-3xl border border-border bg-surface p-3 text-center shadow-sm transition hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="text-2xl" aria-hidden="true">
              {shortcut.emoji}
            </span>
            <span className="text-sm font-bold">{t(shortcut.labelKey)}</span>
          </Link>
        ))}
      </nav>
    </motion.div>
  );
}
