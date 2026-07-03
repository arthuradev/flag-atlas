import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MASTERY_LEVELS } from "@/entities/progress/progress.types";
import { CountryListItem } from "@/features/collection/components/CountryListItem";
import {
  type CollectionFilters,
  DEFAULT_COLLECTION_FILTERS,
  filterCollection,
} from "@/features/collection/logic/filterCollection";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { PageShell } from "@/shared/components/PageShell";
import { CONTINENTS } from "@/shared/data/continents";
import { COUNTRIES } from "@/shared/data/countries";

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-bold text-text-muted">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="min-h-11 cursor-pointer rounded-2xl border-2 border-border bg-surface px-3 text-sm font-bold text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CollectionPage() {
  const { t } = useTranslation();
  const locale = useSettingsStore((state) => state.locale);
  const progress = useProgressStore((state) => state.progress);
  const [filters, setFilters] = useState<CollectionFilters>(DEFAULT_COLLECTION_FILTERS);

  const results = useMemo(
    () => filterCollection(COUNTRIES, progress, filters, locale),
    [progress, filters, locale],
  );

  const setFilter = <K extends keyof CollectionFilters>(key: K, value: CollectionFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <PageShell title={t("collection.title")} backTo="/home">
      <div className="flex flex-col gap-3 pb-4">
        <input
          type="search"
          value={filters.search}
          onChange={(event) => setFilter("search", event.target.value)}
          placeholder={t("collection.searchPlaceholder")}
          aria-label={t("common.search")}
          className="min-h-12 rounded-2xl border-2 border-border bg-surface px-4 font-bold text-text placeholder:font-semibold placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="flex flex-wrap gap-2">
          <FilterSelect
            label={t("collection.filterContinent")}
            value={filters.continentId}
            options={[
              { value: "all" as const, label: t("common.all") },
              ...CONTINENTS.map((continent) => ({
                value: continent.id,
                label: continent.names[locale],
              })),
            ]}
            onChange={(value) => setFilter("continentId", value)}
          />
          <FilterSelect
            label={t("collection.filterMastery")}
            value={filters.mastery}
            options={[
              { value: "all" as const, label: t("common.all") },
              ...MASTERY_LEVELS.map((level) => ({ value: level, label: t(`mastery.${level}`) })),
            ]}
            onChange={(value) => setFilter("mastery", value)}
          />
          <FilterSelect
            label={t("collection.filterStatus")}
            value={filters.status}
            options={[
              { value: "all" as const, label: t("common.all") },
              { value: "seen" as const, label: t("collection.statusSeen") },
              { value: "unseen" as const, label: t("collection.statusUnseen") },
              { value: "review" as const, label: t("collection.statusReview") },
            ]}
            onChange={(value) => setFilter("status", value)}
          />
          <FilterSelect
            label={t("collection.sort")}
            value={filters.sort}
            options={[
              { value: "name" as const, label: t("collection.sortByName") },
              { value: "mastery" as const, label: t("collection.sortByMastery") },
            ]}
            onChange={(value) => setFilter("sort", value)}
          />
        </div>

        <p aria-live="polite" className="text-sm font-bold text-text-muted">
          {t("collection.resultsCount", { count: results.length })}
        </p>

        {results.length === 0 ? (
          <p className="py-8 text-center text-text-muted">{t("collection.empty")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {results.map((country) => (
              <CountryListItem
                key={country.id}
                country={country}
                progress={progress.countries[country.id]}
                locale={locale}
              />
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}
