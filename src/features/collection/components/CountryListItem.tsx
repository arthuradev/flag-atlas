import { useTranslation } from "react-i18next";
import { getCountryName } from "@/entities/country/country.selectors";
import type { Country } from "@/entities/country/country.types";
import { isCountryDueForReview } from "@/entities/progress/progress.selectors";
import type { CountryProgress, MasteryLevel } from "@/entities/progress/progress.types";
import { MasteryBadge } from "@/features/progress/components/MasteryBadge";
import { MAX_MASTERY_POINTS, pointsUntilNextBadge } from "@/features/progress/logic/mastery";
import { FlagImage } from "@/shared/components/FlagImage";
import type { Locale } from "@/shared/i18n/locale";
import { dateKeyDiffInDays, getLocalDateKey, isDateKey } from "@/shared/utils/dateKey";

type CountryListItemProps = {
  country: Country;
  progress: CountryProgress | undefined;
  locale: Locale;
};

export function CountryListItem({ country, progress, locale }: CountryListItemProps) {
  const { t } = useTranslation();
  const masteryLevel: MasteryLevel = progress?.masteryLevel ?? "new";
  const seen = (progress?.seenCount ?? 0) > 0;
  const reviewDue = isCountryDueForReview(progress);
  const points = progress?.masteryPoints ?? 0;
  const missingPoints = progress ? pointsUntilNextBadge(progress) : 1;
  const nextReviewInDays =
    progress?.nextReviewAt && isDateKey(progress.nextReviewAt)
      ? dateKeyDiffInDays(getLocalDateKey(), progress.nextReviewAt)
      : undefined;

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
      <FlagImage
        flagPath={country.flagPath}
        alt=""
        className={`h-7 w-10 rounded-sm object-cover shadow-sm ${seen ? "" : "opacity-45 grayscale"}`}
      />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={`truncate font-bold ${seen ? "" : "text-text-muted"}`}>
          {getCountryName(country, locale)}
        </span>
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-semibold text-text-muted">
          <span>
            {t("collection.badgeProgress")}: {points}/{MAX_MASTERY_POINTS}
          </span>
          {missingPoints > 0 && (
            <span>{t("collection.pointsMissing", { count: missingPoints })}</span>
          )}
          {reviewDue && <span className="font-bold text-danger">{t("review.cta")}</span>}
          {!reviewDue && nextReviewInDays !== undefined && nextReviewInDays >= 0 && (
            <span>{t("collection.nextReviewInDays", { count: nextReviewInDays })}</span>
          )}
        </span>
      </span>
      <MasteryBadge masteryLevel={masteryLevel} size="sm" showTier />
    </li>
  );
}
