import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  countLearnedCountries,
  countLearnedCountriesIn,
} from "@/entities/progress/progress.selectors";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { Card } from "@/shared/components/Card";
import { CONTINENTS } from "@/shared/data/continents";
import { COUNTRIES } from "@/shared/data/countries";

const CONTINENT_BAR_COLORS = ["bg-success", "bg-primary", "bg-danger", "bg-warning", "bg-ring"];

/** Progresso geral do mundo, por continente, com atalho para Continentes. */
export function WorldProgressCard() {
  const { t } = useTranslation();
  const progress = useProgressStore((state) => state.progress);
  const locale = useSettingsStore((state) => state.locale);

  const learned = countLearnedCountries(progress);
  const total = COUNTRIES.length;
  const orderedContinents = [...CONTINENTS].sort((a, b) => a.order - b.order);

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-text-muted">
          {t("learn.world")}
        </h2>
        <span className="text-sm font-black text-text">
          {learned}/{total}
        </span>
      </div>
      <p className="-mt-2 text-xs font-semibold text-text-muted">
        {t("home.learnedCount", { learned, total })}
      </p>

      <ul className="flex flex-col gap-2.5">
        {orderedContinents.map((continent, index) => {
          const continentLearned = countLearnedCountriesIn(progress, continent.countryIds);
          const continentTotal = continent.countryIds.length;
          return (
            <li key={continent.id} className="grid gap-1">
              <span className="flex items-center justify-between gap-3">
                <span className="truncate text-[0.8rem] font-extrabold text-text">
                  {continent.names[locale]}
                </span>
                <span className="text-xs font-bold text-text-muted">
                  {continentLearned}/{continentTotal}
                </span>
              </span>
              <span className="block h-1.5 overflow-hidden rounded-full bg-line">
                <span
                  className={`block h-full rounded-full ${CONTINENT_BAR_COLORS[index % CONTINENT_BAR_COLORS.length]}`}
                  style={{
                    width: `${continentTotal > 0 ? Math.round((continentLearned / continentTotal) * 100) : 0}%`,
                  }}
                />
              </span>
            </li>
          );
        })}
      </ul>

      <Link
        to="/continents"
        className="mt-1 inline-flex min-h-10 items-center justify-center gap-1 rounded-btn bg-pine-soft text-sm font-extrabold text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {t("learn.exploreContinents")}
        <span aria-hidden="true">›</span>
      </Link>
    </Card>
  );
}
