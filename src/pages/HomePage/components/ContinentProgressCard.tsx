import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { countLearnedCountriesIn } from "@/entities/progress/progress.selectors";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { Card } from "@/shared/components/Card";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { CONTINENTS } from "@/shared/data/continents";

/** Barras de progresso por continente + link para a trilha completa. */
export function ContinentProgressCard() {
  const { t } = useTranslation();
  const progress = useProgressStore((state) => state.progress);
  const locale = useSettingsStore((state) => state.locale);

  return (
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
                <span className="text-sm font-extrabold text-text">{continent.names[locale]}</span>
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
  );
}
