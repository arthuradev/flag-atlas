import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getCountryById, getCountryName } from "@/entities/country/country.selectors";
import { listCountriesNeedingReview } from "@/entities/progress/progress.selectors";
import {
  computeOverallStats,
  listAlmostPlatinumCountries,
  listHardestCountries,
  listLowestMasteryCountries,
  listTopConfusions,
} from "@/entities/progress/progress.stats";
import { MasteryBadge } from "@/features/progress/components/MasteryBadge";
import { MAX_MASTERY_POINTS } from "@/features/progress/logic/mastery";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { playSound } from "@/shared/audio/soundPlayer";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { FlagImage } from "@/shared/components/FlagImage";
import { PageShell } from "@/shared/components/PageShell";
import type { Locale } from "@/shared/i18n/locale";

function CountryLabel({ countryId, locale }: { countryId: string; locale: Locale }) {
  const country = getCountryById(countryId);
  if (!country) {
    return null;
  }
  return (
    <span className="inline-flex items-center gap-2">
      <FlagImage
        flagPath={country.flagPath}
        alt=""
        className="h-5 w-7 rounded-sm object-cover shadow-sm"
      />
      <span className="font-bold">{getCountryName(country, locale)}</span>
    </span>
  );
}

function StatsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <h2 className="mb-2 font-extrabold">{title}</h2>
      {children}
    </Card>
  );
}

export function StatsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = useSettingsStore((state) => state.locale);
  const progress = useProgressStore((state) => state.progress);

  const stats = computeOverallStats(progress);
  const hardest = listHardestCountries(progress);
  const lowMastery = listLowestMasteryCountries(progress);
  const almostPlatinum = listAlmostPlatinumCountries(progress);
  const confusions = listTopConfusions(progress);
  const toReview = listCountriesNeedingReview(progress).slice(0, 8);

  if (stats.totalAnswers === 0) {
    return (
      <PageShell title={t("stats.title")} backTo="/home">
        <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 text-center">
          <p className="text-4xl" aria-hidden="true">
            📊
          </p>
          <p className="text-text-muted">{t("stats.empty")}</p>
          <Button
            size="lg"
            onClick={() => {
              playSound("click");
              navigate("/training");
            }}
          >
            {t("stats.trainNow")}
          </Button>
        </div>
      </PageShell>
    );
  }

  const summaryCards = [
    { labelKey: "stats.seen", value: String(stats.seenCount) },
    { labelKey: "stats.learned", value: String(stats.learnedCount) },
    { labelKey: "stats.gold", value: String(stats.goldCount) },
    { labelKey: "stats.platinum", value: String(stats.platinumCount) },
    { labelKey: "stats.toReview", value: String(stats.dueReviewCount) },
    { labelKey: "stats.accuracy", value: `${stats.accuracyPercent}%` },
    { labelKey: "stats.sessions", value: String(stats.completedSessions) },
  ];

  return (
    <PageShell title={t("stats.title")} backTo="/home">
      <div className="flex flex-col gap-4 pb-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {summaryCards.map((card) => (
            <Card key={card.labelKey} className="flex flex-col gap-1 p-4 text-center">
              <span className="text-2xl font-extrabold text-primary">{card.value}</span>
              <span className="text-xs font-bold text-text-muted">{t(card.labelKey)}</span>
            </Card>
          ))}
        </div>

        <StatsSection title={t("stats.badges")}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { level: "recognized" as const, value: stats.bronzeCount },
              { level: "learned" as const, value: stats.silverCount },
              { level: "dominated" as const, value: stats.goldCount },
              { level: "master" as const, value: stats.platinumCount },
            ].map((entry) => (
              <div
                key={entry.level}
                className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface-raised px-3 py-2"
              >
                <MasteryBadge masteryLevel={entry.level} size="sm" showTier />
                <span className="font-extrabold text-primary">{entry.value}</span>
              </div>
            ))}
          </div>
        </StatsSection>

        {hardest.length > 0 && (
          <StatsSection title={t("stats.hardest")}>
            <ul className="flex flex-col gap-2">
              {hardest.map((entry) => (
                <li key={entry.countryId} className="flex items-center justify-between gap-3">
                  <CountryLabel countryId={entry.countryId} locale={locale} />
                  <span className="text-sm font-bold text-danger">
                    {t("stats.wrongCount", { count: entry.wrongCount })}
                  </span>
                </li>
              ))}
            </ul>
          </StatsSection>
        )}

        {toReview.length > 0 && (
          <StatsSection title={t("stats.toReviewList")}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {toReview.map((countryId) => (
                <li key={countryId}>
                  <CountryLabel countryId={countryId} locale={locale} />
                </li>
              ))}
            </ul>
          </StatsSection>
        )}

        {almostPlatinum.length > 0 && (
          <StatsSection title={t("stats.almostPlatinum")}>
            <ul className="flex flex-col gap-2">
              {almostPlatinum.map((entry) => (
                <li key={entry.countryId} className="flex items-center justify-between gap-3">
                  <CountryLabel countryId={entry.countryId} locale={locale} />
                  <span className="text-right text-sm font-bold text-text-muted">
                    {t(`stats.masteryRequirementReasons.${entry.missing[0] ?? "points"}`)}
                    {" · "}
                    {entry.masteryPoints}/{MAX_MASTERY_POINTS}
                  </span>
                </li>
              ))}
            </ul>
          </StatsSection>
        )}

        {confusions.length > 0 && (
          <StatsSection title={t("stats.confusions")}>
            <ul className="flex flex-col gap-2">
              {confusions.map((entry) => (
                <li
                  key={`${entry.countryId}-${entry.confusedWithCountryId}`}
                  className="flex flex-wrap items-center gap-2"
                >
                  <CountryLabel countryId={entry.countryId} locale={locale} />
                  <span aria-hidden="true" className="text-text-muted">
                    →
                  </span>
                  <span className="sr-only">{t("stats.confusedWith")}</span>
                  <CountryLabel countryId={entry.confusedWithCountryId} locale={locale} />
                  <span className="ml-auto text-sm font-bold text-text-muted">{entry.count}×</span>
                </li>
              ))}
            </ul>
          </StatsSection>
        )}

        {lowMastery.length > 0 && (
          <StatsSection title={t("stats.lowMastery")}>
            <ul className="flex flex-col gap-2">
              {lowMastery.map((entry) => (
                <li key={entry.countryId} className="flex items-center justify-between gap-3">
                  <CountryLabel countryId={entry.countryId} locale={locale} />
                  <MasteryBadge masteryLevel={entry.masteryLevel} size="sm" showTier />
                </li>
              ))}
            </ul>
          </StatsSection>
        )}
      </div>
    </PageShell>
  );
}
