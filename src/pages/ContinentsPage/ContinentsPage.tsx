import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { countLearnedCountriesIn } from "@/entities/progress/progress.selectors";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { PageShell } from "@/shared/components/PageShell";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { CONTINENTS } from "@/shared/data/continents";

export function ContinentsPage() {
  const { t } = useTranslation();
  const locale = useSettingsStore((state) => state.locale);
  const progress = useProgressStore((state) => state.progress);

  const orderedContinents = [...CONTINENTS].sort((a, b) => a.order - b.order);

  return (
    <PageShell title={t("continents.title")} backTo="/home">
      <ul className="flex flex-col gap-3 pb-4">
        {orderedContinents.map((continent) => {
          const learned = countLearnedCountriesIn(progress, continent.countryIds);
          const total = continent.countryIds.length;
          return (
            <li key={continent.id}>
              <Link
                to={`/continents/${continent.id}`}
                className="flex flex-col gap-2 rounded-3xl border border-border bg-surface p-5 shadow-sm transition hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-lg font-extrabold">
                    <span aria-hidden="true">{continent.emoji}</span>
                    {continent.names[locale]}
                  </span>
                  <span className="text-sm font-bold text-text-muted">
                    {t("continents.countriesCount", { learned, total })}
                  </span>
                </span>
                <ProgressBar
                  value={learned}
                  max={total}
                  label={`${continent.names[locale]}: ${t("continents.countriesCount", { learned, total })}`}
                  colorClassName="bg-primary"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
