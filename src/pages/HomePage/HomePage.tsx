import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { countLearnedCountries } from "@/entities/progress/progress.selectors";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { COUNTRIES } from "@/shared/data/countries";

const SHORTCUTS = [
  { to: "/continents", emoji: "🧭", labelKey: "home.continents" },
  { to: "/collection", emoji: "🎒", labelKey: "home.collection" },
  { to: "/settings", emoji: "⚙️", labelKey: "home.settings" },
] as const;

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const progress = useProgressStore((state) => state.progress);
  const learned = countLearnedCountries(progress);
  const total = COUNTRIES.length;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-4 py-8">
      <header className="text-center">
        <p className="text-5xl" aria-hidden="true">
          🌍
        </p>
        <h1 className="mt-2 text-3xl font-extrabold">{t("app.name")}</h1>
        <p className="mt-1 text-text-muted">{t("app.tagline")}</p>
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

      <Button size="lg" fullWidth onClick={() => navigate("/training")}>
        {t("home.continueTraining")}
      </Button>

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
    </div>
  );
}
