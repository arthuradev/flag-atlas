import { useTranslation } from "react-i18next";
import { getCountryById } from "@/entities/country/country.selectors";
import { countLearnedCountries } from "@/entities/progress/progress.selectors";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useStartSession } from "@/features/training/hooks/useStartSession";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { FlagImage } from "@/shared/components/FlagImage";
import { Icon } from "@/shared/components/Icon";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { COUNTRIES } from "@/shared/data/countries";

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

type HeroTrainingCardProps = {
  isFirstRun: boolean;
};

/** Hero "continuar treino": progresso geral + CTA principal da Home. */
export function HeroTrainingCard({ isFirstRun }: HeroTrainingCardProps) {
  const { t } = useTranslation();
  const progress = useProgressStore((state) => state.progress);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const startTraining = useStartSession();

  const learned = countLearnedCountries(progress);
  const total = COUNTRIES.length;

  const handleContinueTraining = () => {
    startTraining({ mode: "continue", questionType: "choice", size: defaultSessionSize });
  };

  return (
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
  );
}
