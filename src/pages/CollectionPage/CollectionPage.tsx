import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { countSeenCountries } from "@/entities/progress/progress.selectors";
import { MASTERY_LEVELS } from "@/entities/progress/progress.types";
import { CountryCard } from "@/features/collection/components/CountryCard";
import {
  type CollectionFilters,
  type CollectionStatusFilter,
  DEFAULT_COLLECTION_FILTERS,
  filterCollection,
} from "@/features/collection/logic/filterCollection";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { Icon } from "@/shared/components/Icon";
import { PageTransition } from "@/shared/components/PageTransition";
import { CONTINENTS } from "@/shared/data/continents";
import { COUNTRIES } from "@/shared/data/countries";

/** Número estável do país na Pokédex (ordem canônica do dataset). */
const COUNTRY_NUMBERS = new Map(COUNTRIES.map((country, index) => [country.id, index + 1]));

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-9 shrink-0 cursor-pointer rounded-full px-3.5 text-[0.8rem] font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "border border-line bg-surface text-text-muted hover:bg-surface-2 hover:text-text"
      }`}
    >
      {label}
    </button>
  );
}

const STATUS_CHIPS: CollectionStatusFilter[] = ["all", "seen", "unseen", "review"];

const STATUS_CHIP_LABEL_KEYS: Record<CollectionStatusFilter, string> = {
  all: "common.all",
  seen: "collection.statusSeen",
  unseen: "collection.statusUnseen",
  review: "collection.statusReview",
};

export function CollectionPage() {
  const { t } = useTranslation();
  const locale = useSettingsStore((state) => state.locale);
  const progress = useProgressStore((state) => state.progress);
  const [filters, setFilters] = useState<CollectionFilters>(DEFAULT_COLLECTION_FILTERS);

  const results = useMemo(
    () => filterCollection(COUNTRIES, progress, filters, locale),
    [progress, filters, locale],
  );
  const seenCount = countSeenCountries(progress);

  const setFilter = <K extends keyof CollectionFilters>(key: K, value: CollectionFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <PageTransition className="mx-auto flex min-h-full w-full max-w-[1180px] flex-col gap-4 py-1">
      <header className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-black text-text sm:text-[1.7rem]">
            {t("collection.title")}
          </h1>
          <p className="text-sm font-semibold text-text-muted">
            {t("collection.subtitle", { seen: seenCount, total: COUNTRIES.length })}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-black text-text shadow-sm">
          <Icon name="collection" size={16} className="text-primary" />
          {seenCount} / {COUNTRIES.length}
        </span>
      </header>

      <div className="relative">
        <Icon
          name="search"
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint"
        />
        <input
          type="search"
          value={filters.search}
          onChange={(event) => setFilter("search", event.target.value)}
          placeholder={t("collection.searchPlaceholder")}
          aria-label={t("common.search")}
          className="min-h-12 w-full rounded-btn border border-line bg-surface pl-11 pr-4 font-bold text-text shadow-sm placeholder:font-semibold placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="sr-only">{t("collection.filterContinent")}</legend>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <FilterChip
            label={t("common.all")}
            active={filters.continentId === "all"}
            onClick={() => setFilter("continentId", "all")}
          />
          {CONTINENTS.map((continent) => (
            <FilterChip
              key={continent.id}
              label={continent.names[locale]}
              active={filters.continentId === continent.id}
              onClick={() => setFilter("continentId", continent.id)}
            />
          ))}
          <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-line-strong" />
          {STATUS_CHIPS.filter((status) => status !== "all").map((status) => (
            <FilterChip
              key={status}
              label={t(STATUS_CHIP_LABEL_KEYS[status])}
              active={filters.status === status}
              onClick={() => setFilter("status", filters.status === status ? "all" : status)}
            />
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p aria-live="polite" className="text-sm font-bold text-text-muted">
          {t("collection.resultsCount", { count: results.length })}
        </p>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-text-muted">
            {t("collection.filterMastery")}
            <select
              value={filters.mastery}
              onChange={(event) =>
                setFilter("mastery", event.target.value as CollectionFilters["mastery"])
              }
              className="min-h-9 cursor-pointer rounded-chip border border-line bg-surface px-2 text-xs font-bold text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">{t("common.all")}</option>
              {MASTERY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {t(`mastery.${level}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-xs font-bold text-text-muted">
            {t("collection.sort")}
            <select
              value={filters.sort}
              onChange={(event) =>
                setFilter("sort", event.target.value as CollectionFilters["sort"])
              }
              className="min-h-9 cursor-pointer rounded-chip border border-line bg-surface px-2 text-xs font-bold text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="name">{t("collection.sortByName")}</option>
              <option value="mastery">{t("collection.sortByMastery")}</option>
            </select>
          </label>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="py-10 text-center font-semibold text-text-muted">{t("collection.empty")}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {results.map((country) => (
            <CountryCard
              key={country.id}
              country={country}
              number={COUNTRY_NUMBERS.get(country.id) ?? 0}
              progress={progress.countries[country.id]}
              locale={locale}
            />
          ))}
        </ul>
      )}

      <p className="pb-2 text-center text-xs font-semibold text-text-muted">
        {t("collection.detailHint")}
      </p>
    </PageTransition>
  );
}
