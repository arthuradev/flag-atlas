import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { Continent } from "@/entities/continent/continent.types";
import { getCountryById } from "@/entities/country/country.selectors";
import {
  countLearnedCountries,
  countLearnedCountriesIn,
} from "@/entities/progress/progress.selectors";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { pickActiveContinent } from "@/pages/HomePage/components/LearnHero";
import { FlagImage } from "@/shared/components/FlagImage";
import { Icon } from "@/shared/components/Icon";
import { PageTransition } from "@/shared/components/PageTransition";
import { CONTINENTS } from "@/shared/data/continents";
import { COUNTRIES } from "@/shared/data/countries";

const CARD_TINTS = [
  "from-pine-soft/70",
  "from-danger-soft/70",
  "from-accent-soft/70",
  "from-success-soft/70",
  "from-pine-soft/70",
];

/** Leque de bandeiras do continente (até 3), levemente inclinadas. */
function FlagFan({ continent }: { continent: Continent }) {
  const flags = continent.countryIds
    .slice(0, 3)
    .map((id) => getCountryById(id))
    .filter((country): country is NonNullable<ReturnType<typeof getCountryById>> =>
      Boolean(country),
    );
  const tilts = ["-rotate-6", "rotate-2", "rotate-6"];

  return (
    <span aria-hidden="true" className="flex items-center">
      {flags.map((country, index) => (
        <span
          key={country.id}
          className={`-ml-2 flex h-9 w-13 items-center justify-center overflow-hidden rounded-md border border-white/60 bg-white p-0.5 shadow-sm first:ml-0 ${tilts[index % tilts.length]}`}
        >
          <FlagImage
            flagPath={country.flagPath}
            alt=""
            className="max-h-full max-w-full rounded-[3px] object-contain"
          />
        </span>
      ))}
    </span>
  );
}

type ContinentStatus = "notStarted" | "inProgress" | "completed";

function continentStatus(learned: number, total: number, seen: number): ContinentStatus {
  if (learned >= total && total > 0) {
    return "completed";
  }
  return seen > 0 ? "inProgress" : "notStarted";
}

const STATUS_CHIP_CLASSES: Record<ContinentStatus, string> = {
  notStarted: "bg-surface-2 text-text-muted",
  inProgress: "bg-pine-soft text-primary",
  completed: "bg-success-soft text-success",
};

export function ContinentsPage() {
  const { t } = useTranslation();
  const locale = useSettingsStore((state) => state.locale);
  const progress = useProgressStore((state) => state.progress);

  const orderedContinents = [...CONTINENTS].sort((a, b) => a.order - b.order);
  const learnedTotal = countLearnedCountries(progress);
  const featured = pickActiveContinent(progress.countries, (ids) =>
    countLearnedCountriesIn(progress, ids),
  );
  const featuredLearned = countLearnedCountriesIn(progress, featured.countryIds);
  const featuredTotal = featured.countryIds.length;
  const featuredPercent =
    featuredTotal > 0 ? Math.round((featuredLearned / featuredTotal) * 100) : 0;

  return (
    <PageTransition className="mx-auto flex min-h-full w-full max-w-[1180px] flex-col gap-4 py-1">
      <header className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-black text-text sm:text-[1.7rem]">
            {t("continents.exploreTitle")}
          </h1>
          <p className="text-sm font-semibold text-text-muted">
            {t("continents.exploreSubtitle", { count: orderedContinents.length })}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-black text-text shadow-sm">
          {learnedTotal} / {COUNTRIES.length}
        </span>
      </header>

      <Link
        to={`/continents/${featured.id}`}
        className="group relative overflow-hidden rounded-[22px] bg-gradient-to-br from-primary to-pine-hover p-6 text-white shadow-[0_22px_44px_-26px_rgba(0,0,0,0.55)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="pointer-events-none absolute -right-10 -top-16 size-44 rounded-full bg-white/10" />
        <div className="relative flex flex-wrap items-center gap-5">
          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-full bg-white/18 px-2.5 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.14em]">
              {t("continents.status.inProgress")}
            </span>
            <span className="mt-2 block text-2xl font-black leading-tight">
              {featured.names[locale]}
            </span>
            <span className="mt-1 block text-sm font-semibold text-white/85">
              {t("continents.youAreHere")}
            </span>
            <span className="mt-3 flex max-w-[320px] items-center gap-3">
              <span className="block h-2 flex-1 overflow-hidden rounded-full bg-white/25">
                <span
                  className="block h-full rounded-full bg-white"
                  style={{ width: `${featuredPercent}%` }}
                />
              </span>
              <span className="whitespace-nowrap text-[0.8rem] font-extrabold">
                {featuredLearned} / {featuredTotal}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <FlagFan continent={featured} />
            <span className="inline-flex min-h-11 items-center gap-2 rounded-btn bg-white px-5 text-sm font-black uppercase tracking-[0.04em] text-primary shadow-[0_6px_0_rgba(0,0,0,0.18)] transition group-active:translate-y-[2px]">
              <Icon name="play" size={16} fill="currentColor" strokeWidth={1.8} />
              {t("common.continue")}
            </span>
          </div>
        </div>
      </Link>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {orderedContinents.map((continent, index) => {
          const learned = countLearnedCountriesIn(progress, continent.countryIds);
          const total = continent.countryIds.length;
          const seen = continent.countryIds.filter(
            (id) => (progress.countries[id]?.seenCount ?? 0) > 0,
          ).length;
          const status = continentStatus(learned, total, seen);
          const percent = total > 0 ? Math.round((learned / total) * 100) : 0;
          return (
            <li key={continent.id}>
              <Link
                to={`/continents/${continent.id}`}
                className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  className={`flex items-center justify-between gap-3 bg-gradient-to-br to-transparent px-5 pb-3 pt-5 ${CARD_TINTS[index % CARD_TINTS.length]}`}
                >
                  <FlagFan continent={continent} />
                  {status === "notStarted" && <Icon name="lock" size={17} className="text-faint" />}
                </span>
                <span className="flex flex-1 flex-col gap-2 px-5 pb-5 pt-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-lg font-extrabold text-text">
                      <Icon name={continent.icon} size={21} className="text-primary" />
                      {continent.names[locale]}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[0.62rem] font-extrabold uppercase tracking-wide ${STATUS_CHIP_CLASSES[status]}`}
                    >
                      {t(`continents.status.${status}`)}
                    </span>
                  </span>
                  <span className="block h-1.5 overflow-hidden rounded-full bg-line">
                    <span
                      className={`block h-full rounded-full ${status === "completed" ? "bg-success" : "bg-primary"}`}
                      style={{ width: `${percent}%` }}
                    />
                  </span>
                  <span className="flex items-center justify-between gap-2 text-xs font-bold text-text-muted">
                    {t("continents.flagsCount", { learned, total })}
                    <span className="font-extrabold text-primary">
                      {status === "notStarted" ? t("continents.exploreCta") : t("common.continue")}{" "}
                      ›
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}

        <li>
          <Link
            to="/collection"
            className="flex h-full min-h-40 flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-line-strong bg-surface-raised p-5 text-center transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-10 items-center justify-center rounded-btn bg-pine-soft text-primary">
              <Icon name="collection" size={22} />
            </span>
            <span className="text-sm font-extrabold text-text">{t("continents.viewAll")}</span>
            <span className="text-xs font-bold text-text-muted">
              {t("continents.viewAllCount", { count: COUNTRIES.length })}
            </span>
          </Link>
        </li>
      </ul>
    </PageTransition>
  );
}
