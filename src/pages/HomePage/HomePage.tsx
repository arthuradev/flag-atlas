import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getCountryById, getCountryName } from "@/entities/country/country.selectors";
import {
  countLearnedCountries,
  countLearnedCountriesIn,
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
import { useStartSession } from "@/features/training/hooks/useStartSession";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { FlagImage } from "@/shared/components/FlagImage";
import { Icon, type IconName } from "@/shared/components/Icon";
import { PageTransition } from "@/shared/components/PageTransition";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { CONTINENTS } from "@/shared/data/continents";
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

const HERO_FLAG_IDS = ["br", "jp", "za"] as const;

function HeroFlagStack() {
  const { t } = useTranslation();
  const locale = useSettingsStore((state) => state.locale);
  const flags = HERO_FLAG_IDS.map((id) => getCountryById(id)).filter(
    (country): country is NonNullable<ReturnType<typeof getCountryById>> => Boolean(country),
  );

  return (
    <div className="fa-home-flag-stage pointer-events-none absolute right-3 top-10 hidden h-36 w-36 sm:block lg:right-4 lg:top-12">
      {flags.map((country, index) => (
        <span
          key={country.id}
          className={`fa-home-flag-card fa-home-flag-card-${index + 1} absolute flex h-20 w-28 items-center justify-center overflow-hidden rounded-btn border border-white/50 bg-white p-1.5 shadow-flag`}
        >
          <FlagImage
            flagPath={country.flagPath}
            alt={t("onboarding.lesson.flagAlt", { country: country.names[locale] })}
            className="max-h-full max-w-full rounded-md object-contain"
          />
        </span>
      ))}
    </div>
  );
}

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
  const progress = useProgressStore((state) => state.progress);
  const playerName = useOnboardingStore((state) => state.playerName);
  const dailyGoal = useOnboardingStore((state) => state.dailyGoal);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const locale = useSettingsStore((state) => state.locale);
  const startTraining = useStartSession();

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
    startTraining({ mode: "continue", questionType: "choice", size: defaultSessionSize });
  };

  const handleReview = () => {
    startTraining({ mode: "review", questionType: "choice", size: defaultSessionSize });
  };

  const handleMode = (mode: TrainingMode["action"]) => {
    if (mode === "typing") {
      startTraining({ mode: "continue", questionType: "typing", size: defaultSessionSize });
      return;
    }
    if (mode === "survival") {
      startTraining({ mode: "survival", questionType: "choice", size: defaultSessionSize });
      return;
    }
    if (mode === "similar") {
      startTraining({ mode: "similar", questionType: "choice", size: defaultSessionSize });
      return;
    }
    handleReview();
  };

  return (
    <PageTransition className="mx-auto grid min-h-full w-full max-w-[1180px] gap-4 py-1 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="flex min-w-0 flex-col gap-4">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-black text-primary-foreground shadow-card">
              {progress.level}
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-black text-text">
                {playerName ? t("home.greeting", { name: playerName }) : t("home.greetingFallback")}
              </p>
              <p className="text-sm font-bold text-text-muted">
                {t("home.level", { level: progress.level })} -{" "}
                {t("home.totalXp", { xp: progress.totalXp })}
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

        <Card className="overflow-hidden p-0">
          <div className="relative min-h-[235px] bg-primary p-5 text-primary-foreground sm:p-6">
            <HeroFlagStack />
            <div className="relative z-[2] max-w-[380px]">
              <p className="text-xs font-black uppercase tracking-[0.08em] opacity-80">
                {t("home.continueWhereLeft")}
              </p>
              <h1 className="mt-2 text-3xl font-black leading-tight sm:text-[38px]">
                {isFirstRun ? t("home.firstTrainingTitle") : t("home.dashboardTitle")}
              </h1>
              <div className="mt-4 max-w-sm">
                <ProgressBar
                  value={learned}
                  max={total}
                  label={t("home.learnedCount", { learned, total })}
                />
                <div className="mt-2 flex items-center justify-between gap-3 text-sm font-extrabold opacity-90">
                  <span>{t("home.learnedCount", { learned, total })}</span>
                  <span>{t("home.totalXp", { xp: progress.totalXp })}</span>
                </div>
              </div>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleContinueTraining}
                className="mt-5 bg-white text-primary hover:bg-white/90"
              >
                <Icon name="play" size={19} fill="currentColor" strokeWidth={1.8} />
                {t(isFirstRun ? "home.startFirstTraining" : "home.continueTraining")}
              </Button>
            </div>
          </div>
        </Card>

        <section className="grid gap-3 sm:grid-cols-3">
          <Card className="p-4">
            <span className="text-2xl font-black text-text">{seen}</span>
            <p className="text-xs font-black uppercase tracking-[0.04em] text-text-muted">
              {t("home.seen")}
            </p>
          </Card>
          <Card className="p-4">
            <span className="text-2xl font-black text-text">{learned}</span>
            <p className="text-xs font-black uppercase tracking-[0.04em] text-text-muted">
              {t("stats.learned")}
            </p>
          </Card>
          <Card className="p-4">
            <span className="text-2xl font-black text-text">{reviewCount}</span>
            <p className="text-xs font-black uppercase tracking-[0.04em] text-text-muted">
              {t("home.toReview")}
            </p>
          </Card>
        </section>

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
                  className="flex min-h-28 items-start gap-3 rounded-card border border-line bg-surface p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
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

        <Card className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-black text-text">{t("home.continentProgress")}</h2>
            <Link
              to="/continents"
              className="text-sm font-extrabold text-primary hover:text-pine-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("home.continents")}
            </Link>
          </div>
          <div className="grid gap-3">
            {CONTINENTS.map((continent) => {
              const continentLearned = countLearnedCountriesIn(progress, continent.countryIds);
              return (
                <div key={continent.id} className="grid gap-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-extrabold text-text">
                      {continent.names[locale]}
                    </span>
                    <span className="text-xs font-bold text-text-muted">
                      {continentLearned}/{continent.countryIds.length}
                    </span>
                  </div>
                  <ProgressBar
                    value={continentLearned}
                    max={continent.countryIds.length}
                    label={`${continent.names[locale]} ${continentLearned}/${continent.countryIds.length}`}
                    size="thin"
                    colorClassName="bg-primary"
                  />
                </div>
              );
            })}
          </div>
        </Card>

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
              <span className="text-4xl font-black text-text">{goal}</span>
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
              <span className="text-4xl font-black text-text">
                {progress.dailyStreak.currentStreak}
              </span>
              <span className="ml-1 text-sm font-bold text-text-muted">{t("home.streakDays")}</span>
            </div>
            <DailyStreakLine streak={progress.dailyStreak} />
          </Card>
        </div>

        <DailyMissionsCard />

        <Card className="flex items-center gap-3 p-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-btn bg-ocre-soft text-warning">
            <Icon name="coin" size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <CoinBalance className="text-2xl" />
            <p className="text-xs font-bold text-text-muted">{t("cosmetics.coinsName")}</p>
          </div>
          <Link
            to="/shop"
            className="rounded-chip bg-pine-soft px-3 py-2 text-sm font-extrabold text-primary hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("shop.visitShort")}
          </Link>
        </Card>

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
