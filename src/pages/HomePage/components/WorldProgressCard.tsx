import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  countLearnedCountries,
  countLearnedCountriesIn,
} from "@/entities/progress/progress.selectors";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { Icon } from "@/shared/components/Icon";
import { CONTINENTS } from "@/shared/data/continents";
import { COUNTRIES } from "@/shared/data/countries";

/** Cores fixas das barras por continente, na ordem do design. */
const CONTINENT_BAR_COLORS = ["#22B07A", "#12C2D6", "#FF6F5C", "#F5A836", "#8A79D6"];

/** Progresso geral do mundo, por continente, com atalho para Continentes. */
export function WorldProgressCard() {
  const { t } = useTranslation();
  const progress = useProgressStore((state) => state.progress);
  const locale = useSettingsStore((state) => state.locale);

  const learned = countLearnedCountries(progress);
  const total = COUNTRIES.length;
  const orderedContinents = [...CONTINENTS].sort((a, b) => a.order - b.order);

  return (
    <section
      aria-labelledby="world-title"
      className="rounded-[18px] border border-line bg-surface p-[18px] shadow-card"
    >
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h2
          id="world-title"
          className="text-[13px] font-black uppercase tracking-[0.08em] text-text-muted"
        >
          {t("learn.world")}
        </h2>
        <span className="text-xs font-extrabold text-text">
          {learned}/{total}
        </span>
      </div>
      <p className="mb-3.5 text-[11.5px] font-semibold text-text-muted">
        {t("home.learnedCount", { learned, total })}
      </p>

      <ul className="flex flex-col gap-3">
        {orderedContinents.map((continent, index) => {
          const continentLearned = countLearnedCountriesIn(progress, continent.countryIds);
          const continentTotal = continent.countryIds.length;
          return (
            <li key={continent.id} className="flex items-center gap-[11px]">
              <span className="w-24 truncate text-[12.5px] font-bold text-text">
                {continent.names[locale]}
              </span>
              <span className="block h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${continentTotal > 0 ? Math.round((continentLearned / continentTotal) * 100) : 0}%`,
                    background: CONTINENT_BAR_COLORS[index % CONTINENT_BAR_COLORS.length],
                  }}
                />
              </span>
              <span className="w-10 text-right text-[11.5px] font-extrabold text-text-muted">
                {continentLearned}/{continentTotal}
              </span>
            </li>
          );
        })}
      </ul>

      <Link
        to="/continents"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-[11px] bg-pine-soft py-2.5 text-[12.5px] font-extrabold text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {t("learn.exploreContinents")}
        <Icon name="chevron-right" size={15} />
      </Link>
    </section>
  );
}
