import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { getCountryById, getCountryName } from "@/entities/country/country.selectors";
import {
  countLearnedCountries,
  countSeenCountries,
  listCountriesNeedingReview,
} from "@/entities/progress/progress.selectors";
import { CoinBalance } from "@/features/cosmetics/components/CoinBalance";
import { DailyMissionsCard } from "@/features/missions/components/DailyMissionsCard";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import { DailyStreakLine } from "@/features/progress/components/DailyStreakLine";
import { MasteryBadge } from "@/features/progress/components/MasteryBadge";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useSessionStore } from "@/features/training/store/sessionStore";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { FlagImage } from "@/shared/components/FlagImage";
import { Icon, type IconName } from "@/shared/components/Icon";
import { PageTransition } from "@/shared/components/PageTransition";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { COUNTRIES } from "@/shared/data/countries";
import { getLocalDateKey } from "@/shared/utils/dateKey";

type TrainingMode = {
  icon: IconName;
  labelKey: string;
  descriptionKey: string;
  action: "typing" | "survival" | "similar" | "review";
};

const TRAINING_MODES = [
  {
    action: "typing",
    icon: "keyboard",
    labelKey: "home.trainingModes.typing.title",
    descriptionKey: "home.trainingModes.typing.body",
  },
  {
    action: "survival",
    icon: "heart",
    labelKey: "home.trainingModes.survival.title",
    descriptionKey: "home.trainingModes.survival.body",
  },
  {
    action: "similar",
    icon: "layers",
    labelKey: "home.trainingModes.similar.title",
    descriptionKey: "home.trainingModes.similar.body",
  },
  {
    action: "review",
    icon: "refresh",
    labelKey: "home.trainingModes.review.title",
    descriptionKey: "home.trainingModes.review.body",
  },
] satisfies readonly TrainingMode[];

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
  const playerName = useOnboardingStore((state) => state.playerName);
  const dailyGoal = useOnboardingStore((state) => state.dailyGoal);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const locale = useSettingsStore((state) => state.locale);
  const startSession = useSessionStore((state) => state.startSession);

  const learned = countLearnedCountries(progress);
  const seen = countSeenCountries(progress);
  const total = COUNTRIES.length;
  const reviewCountryIds = listCountriesNeedingReview(progress);
  const reviewCountries = reviewCountryIds
    .slice(0, 4)
    .map((id) => getCountryById(id))
    .filter((country): country is NonNullable<ReturnType<typeof getCountryById>> =>
      Boolean(country),
    );
  const reviewCount = reviewCountryIds.length;
  const isFirstRun = progress.completedSessions === 0 && progress.totalXp === 0 && seen === 0;
  const goal = dailyGoal ?? defaultSessionSize;
  const playedToday = progress.lastPlayedAt
    ? getLocalDateKey(new Date(progress.lastPlayedAt)) === getLocalDateKey()
    : false;
  const dailyGoalProgress = playedToday ? 1 : 0;

  const handleContinueTraining = () => {
    startSession({ mode: "continue", questionType: "choice", size: defaultSessionSize });
    navigate("/training");
  };

  const handleReview = () => {
    startSession({ mode: "review", questionType: "choice", size: defaultSessionSize });
    navigate("/training");
  };

  const handleMode = (mode: TrainingMode["action"]) => {
    if (mode === "typing") {
      startSession({ mode: "continue", questionType: "typing", size: defaultSessionSize });
    }
    if (mode === "survival") {
      startSession({ mode: "survival", questionType: "choice", size: defaultSessionSize });
    }
    if (mode === "similar") {
      startSession({ mode: "similar", questionType: "choice", size: defaultSessionSize });
    }
    if (mode === "review") {
      handleReview();
      return;
    }
    navigate("/training");
  };

  return (
    <PageTransition className="mx-auto grid min-h-full w-full max-w-7xl gap-5 py-1 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <section className="flex min-w-0 flex-col gap-5">
        <header className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold text-primary">
              {playerName ? t("home.greeting", { name: playerName }) : t("home.greetingFallback")}
            </p>
            <h1 className="mt-1 text-3xl font-black leading-tight text-text">
              {t("home.dashboardTitle")}
            </h1>
            <p className="mt-1 max-w-2xl font-semibold text-text-muted">{t("app.tagline")}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to="/achievements"
              className="inline-flex items-center justify-center gap-2 rounded-btn border border-line bg-surface-2 px-4 py-3 font-extrabold text-text transition hover:bg-pine-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon name="trophy" size={19} className="text-primary" />
              {t("home.achievements")}
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-between gap-3 rounded-btn border border-line bg-surface-2 px-4 py-3 font-extrabold text-text transition hover:bg-pine-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="inline-flex items-center gap-2">
                <Icon name="shop" size={19} className="text-primary" />
                {t("home.shop")}
              </span>
              <CoinBalance />
            </Link>
          </div>
        </header>

        <Card className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="flex flex-col justify-between gap-5 bg-primary p-5 text-primary-foreground sm:p-6">
              <div>
                <p className="text-xs font-black uppercase opacity-80">
                  {t("home.continueWhereLeft")}
                </p>
                <h2 className="mt-2 text-3xl font-black leading-tight">
                  {isFirstRun ? t("home.firstTrainingTitle") : t("home.continueTraining")}
                </h2>
                <p className="mt-2 max-w-md text-sm font-bold opacity-88">
                  {isFirstRun
                    ? t("home.firstTrainingHint", { count: defaultSessionSize })
                    : t("home.continueTrainingHint", { count: defaultSessionSize })}
                </p>
              </div>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleContinueTraining}
                className="w-full bg-white text-primary hover:bg-white/90 sm:w-fit"
              >
                <Icon name="play" size={20} fill="currentColor" strokeWidth={1.8} />
                {t(isFirstRun ? "home.startFirstTraining" : "home.continueTraining")}
              </Button>
            </div>

            <div className="flex flex-col justify-center gap-4 p-5 sm:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-extrabold text-text">
                  {t("home.learnedCount", { learned, total })}
                </span>
                <span className="text-sm font-bold text-text-muted">
                  {t("home.totalXp", { xp: progress.totalXp })}
                </span>
              </div>
              <ProgressBar
                value={learned}
                max={total}
                label={t("home.learnedCount", { learned, total })}
                colorClassName="bg-primary"
              />
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-btn bg-surface-2 p-3">
                  <span className="block text-xl font-black">{seen}</span>
                  <span className="text-xs font-bold text-text-muted">{t("home.seen")}</span>
                </div>
                <div className="rounded-btn bg-surface-2 p-3">
                  <span className="block text-xl font-black">{progress.level}</span>
                  <span className="text-xs font-bold text-text-muted">{t("home.levelShort")}</span>
                </div>
                <div className="rounded-btn bg-surface-2 p-3">
                  <span className="block text-xl font-black">{reviewCount}</span>
                  <span className="text-xs font-bold text-text-muted">{t("home.toReview")}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-black text-text">{t("home.trainingModes.title")}</h2>
            <Link
              to="/challenges"
              className="text-sm font-extrabold text-primary hover:text-pine-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("home.trainingModes.all")}
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {TRAINING_MODES.map((mode) => {
              const isReviewDisabled = mode.action === "review" && reviewCount === 0;
              return (
                <button
                  key={mode.action}
                  type="button"
                  disabled={isReviewDisabled}
                  onClick={() => handleMode(mode.action)}
                  className="flex min-h-28 items-start gap-3 rounded-card border border-line bg-surface p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-btn bg-pine-soft text-primary">
                    <Icon name={mode.icon} size={22} />
                  </span>
                  <span>
                    <span className="block font-black text-text">{t(mode.labelKey)}</span>
                    <span className="mt-1 block text-sm font-semibold text-text-muted">
                      {t(mode.descriptionKey)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {isFirstRun && <FirstStepsCard />}
      </section>

      <aside className="flex min-w-0 flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <Card className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-text-muted">
                {t("home.dailyGoal.title")}
              </h2>
              <Icon name="target" size={20} className="text-primary" />
            </div>
            <div>
              <span className="text-3xl font-black text-text">{goal}</span>
              <span className="ml-1 text-sm font-bold text-text-muted">
                {t("home.dailyGoal.questions")}
              </span>
            </div>
            <ProgressBar
              value={dailyGoalProgress}
              max={goal}
              label={t("home.dailyGoal.title")}
              colorClassName="bg-primary"
            />
          </Card>

          <Card className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-text-muted">{t("home.streakTitle")}</h2>
              <Icon name="flame" size={20} className="text-danger" />
            </div>
            <div>
              <span className="text-3xl font-black text-text">
                {progress.dailyStreak.currentStreak}
              </span>
              <span className="ml-1 text-sm font-bold text-text-muted">{t("home.streakDays")}</span>
            </div>
            <DailyStreakLine streak={progress.dailyStreak} />
          </Card>
        </div>

        <DailyMissionsCard />

        <Card className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-text-muted">{t("home.reviewCountries")}</h2>
            {reviewCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleReview}>
                {t("review.cta")}
              </Button>
            )}
          </div>
          {reviewCountries.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {reviewCountries.map((country) => {
                const countryProgress = progress.countries[country.id];
                const countryName = getCountryName(country, locale);
                return (
                  <li
                    key={country.id}
                    className="flex items-center gap-3 rounded-btn bg-surface-2 p-2"
                  >
                    <span className="flex h-10 w-14 items-center justify-center overflow-hidden rounded-md border border-line bg-white p-1">
                      <FlagImage
                        flagPath={country.flagPath}
                        alt={countryName}
                        className="max-h-full max-w-full object-contain"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-black">{countryName}</span>
                      {countryProgress && (
                        <MasteryBadge
                          masteryLevel={countryProgress.masteryLevel}
                          size="sm"
                          showLabel={false}
                        />
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm font-semibold text-text-muted">{t("home.noReviewCountries")}</p>
          )}
        </Card>
      </aside>
    </PageTransition>
  );
}
