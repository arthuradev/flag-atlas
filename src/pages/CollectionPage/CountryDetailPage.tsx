import { useTranslation } from "react-i18next";
import { Link, Navigate, useParams } from "react-router-dom";
import { getCountryById, getCountryName } from "@/entities/country/country.selectors";
import { isCountryDueForReview } from "@/entities/progress/progress.selectors";
import {
  type CollectionCardStatus,
  collectionCardStatus,
} from "@/features/collection/components/CountryCard";
import { MasteryBadge } from "@/features/progress/components/MasteryBadge";
import { MAX_MASTERY_POINTS } from "@/features/progress/logic/mastery";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useStartSession } from "@/features/training/hooks/useStartSession";
import { Card } from "@/shared/components/Card";
import { FlagImage } from "@/shared/components/FlagImage";
import { Icon, type IconName } from "@/shared/components/Icon";
import { PageTransition } from "@/shared/components/PageTransition";
import { CONTINENTS } from "@/shared/data/continents";
import { COUNTRIES } from "@/shared/data/countries";

const STATUS_CHIP_CLASSES: Record<CollectionCardStatus, string> = {
  locked: "bg-surface-2 text-text-muted",
  learning: "bg-accent-soft text-ocre-ink",
  mastered: "bg-success-soft text-success",
};

/** Campos factuais ainda sem dataset confiável: o layout fica pronto, o valor diz "Em breve". */
const FACT_TILES: { key: string; icon: IconName }[] = [
  { key: "capital", icon: "map" },
  { key: "currency", icon: "coin" },
  { key: "language", icon: "globe" },
  { key: "population", icon: "user" },
];

export function CountryDetailPage() {
  const { t } = useTranslation();
  const { countryId } = useParams<{ countryId: string }>();
  const locale = useSettingsStore((state) => state.locale);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const progress = useProgressStore((state) => state.progress);
  const startTraining = useStartSession();

  const country = countryId ? getCountryById(countryId) : undefined;
  if (!country) {
    return <Navigate to="/collection" replace />;
  }

  const countryProgress = progress.countries[country.id];
  const status = collectionCardStatus(countryProgress);
  const continent = CONTINENTS.find((entry) => entry.id === country.continentId);
  const number = COUNTRIES.findIndex((entry) => entry.id === country.id) + 1;
  const points = countryProgress?.masteryPoints ?? 0;
  const reviewDue = isCountryDueForReview(countryProgress);
  const name = getCountryName(country, locale);

  const handlePractice = () => {
    startTraining({
      mode: "continent",
      continentId: country.continentId,
      questionType: "choice",
      size: defaultSessionSize,
    });
  };

  const handleReview = () => {
    startTraining({ mode: "review", questionType: "choice", size: defaultSessionSize });
  };

  return (
    <PageTransition className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-4 py-1">
      <header className="flex items-center gap-3">
        <Link
          to="/collection"
          aria-label={t("common.back")}
          className="inline-flex size-11 items-center justify-center rounded-btn border border-line bg-surface text-muted shadow-sm transition hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon name="chevron-left" size={23} strokeWidth={2.4} />
        </Link>
        <h1 className="text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-text-muted">
          {t("collection.detailTitle")}
        </h1>
      </header>

      <Card className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex min-h-44 items-center justify-center rounded-card border border-line bg-surface-raised p-5 sm:min-h-56">
          {status === "locked" ? (
            <span className="flex flex-col items-center gap-2 text-faint">
              <Icon name="lock" size={40} />
              <span className="text-lg font-black">???</span>
            </span>
          ) : (
            <FlagImage
              flagPath={country.flagPath}
              alt={t("collection.flagAlt", { country: name })}
              className="max-h-40 max-w-full rounded-lg object-contain shadow-flag sm:max-h-48"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-2xl font-black text-text">{name}</h2>
          <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs font-extrabold text-text-muted">
            #{String(number).padStart(3, "0")}
          </span>
          <span
            className={`ml-auto rounded-full px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-wide ${STATUS_CHIP_CLASSES[status]}`}
          >
            {t(`collection.cardStatus.${status}`)}
          </span>
        </div>

        {continent && (
          <p className="flex items-center gap-2 text-sm font-bold text-text-muted">
            <Icon name={continent.icon} size={18} className="text-primary" />
            {continent.names[locale]}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-btn border border-line bg-surface-raised px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-wide text-text-muted">
              {t("collection.badgeProgress")}
            </p>
            <p className="text-lg font-black text-text">
              {points}/{MAX_MASTERY_POINTS}
            </p>
          </div>
          <MasteryBadge masteryLevel={countryProgress?.masteryLevel ?? "new"} showTier />
        </div>

        <ul className="grid grid-cols-2 gap-3">
          {FACT_TILES.map((tile) => (
            <li key={tile.key} className="rounded-btn border border-line bg-surface-raised p-3.5">
              <p className="flex items-center gap-1.5 text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-primary">
                <Icon name={tile.icon} size={14} />
                {t(`collection.facts.${tile.key}`)}
              </p>
              <p className="mt-1 text-sm font-bold text-text-muted">{t("collection.factSoon")}</p>
            </li>
          ))}
        </ul>

        <div className="mt-1 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={handlePractice}
            className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-btn bg-primary px-5 font-extrabold text-primary-foreground shadow-btn transition hover:bg-pine-hover active:translate-y-[3px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon name="play" size={17} fill="currentColor" strokeWidth={1.8} />
            {t("collection.practiceCta")}
          </button>
          {reviewDue && (
            <button
              type="button"
              onClick={handleReview}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-btn border border-line-strong bg-surface px-5 font-extrabold text-primary shadow-sm transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon name="refresh" size={17} />
              {t("review.cta")}
            </button>
          )}
        </div>
      </Card>
    </PageTransition>
  );
}
