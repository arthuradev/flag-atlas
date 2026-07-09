import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { isContinentId } from "@/entities/continent/continent.types";
import { listCountriesByContinent } from "@/entities/country/country.selectors";
import { countLearnedCountriesIn } from "@/entities/progress/progress.selectors";
import { CountryCard } from "@/features/collection/components/CountryCard";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useStartSession } from "@/features/training/hooks/useStartSession";
import { Button } from "@/shared/components/Button";
import { PageShell } from "@/shared/components/PageShell";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { CONTINENTS } from "@/shared/data/continents";
import { COUNTRIES } from "@/shared/data/countries";

/** Número estável do país na Pokédex (ordem canônica do dataset). */
const COUNTRY_NUMBERS = new Map(COUNTRIES.map((country, index) => [country.id, index + 1]));

export function ContinentPage() {
  const { t } = useTranslation();
  const { continentId } = useParams();
  const locale = useSettingsStore((state) => state.locale);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const progress = useProgressStore((state) => state.progress);
  const startTraining = useStartSession();

  const continent = isContinentId(continentId)
    ? CONTINENTS.find((item) => item.id === continentId)
    : undefined;

  if (!continent) {
    return <Navigate to="/continents" replace />;
  }

  const countries = listCountriesByContinent(continent.id).sort((a, b) =>
    a.names[locale].localeCompare(b.names[locale], locale),
  );
  const learned = countLearnedCountriesIn(progress, continent.countryIds);
  const total = continent.countryIds.length;

  const handleTrain = () => {
    startTraining({
      mode: "continent",
      questionType: "choice",
      continentId: continent.id,
      size: defaultSessionSize,
    });
  };

  return (
    <PageShell title={continent.names[locale]} backTo="/continents">
      <div className="flex flex-col gap-4 pb-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-text-muted">
            {t("continents.countriesCount", { learned, total })}
          </span>
          <ProgressBar
            value={learned}
            max={total}
            label={t("continents.countriesCount", { learned, total })}
            colorClassName="bg-primary"
          />
        </div>

        <Button size="lg" fullWidth onClick={handleTrain}>
          {t("continents.trainContinent")}
        </Button>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {countries.map((country) => (
            <CountryCard
              key={country.id}
              country={country}
              number={COUNTRY_NUMBERS.get(country.id) ?? 0}
              progress={progress.countries[country.id]}
              locale={locale}
            />
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
