import { useTranslation } from "react-i18next";
import { getCountryById, getCountryName } from "@/entities/country/country.selectors";
import { listCountriesNeedingReview } from "@/entities/progress/progress.selectors";
import { MasteryBadge } from "@/features/progress/components/MasteryBadge";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useStartSession } from "@/features/training/hooks/useStartSession";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { FlagImage } from "@/shared/components/FlagImage";

/** Até 4 países aguardando revisão, com CTA para a sessão de revisão. */
export function ReviewCountriesCard() {
  const { t } = useTranslation();
  const progress = useProgressStore((state) => state.progress);
  const locale = useSettingsStore((state) => state.locale);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const startTraining = useStartSession();

  const reviewCountryIds = listCountriesNeedingReview(progress);
  const reviewCountries = reviewCountryIds
    .slice(0, 4)
    .map((id) => getCountryById(id))
    .filter((country): country is NonNullable<ReturnType<typeof getCountryById>> =>
      Boolean(country),
    );
  const reviewCount = reviewCountryIds.length;

  const handleReview = () => {
    startTraining({ mode: "review", questionType: "choice", size: defaultSessionSize });
  };

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-text-muted">{t("home.reviewCountries")}</h2>
        {reviewCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReview}>
            {t("review.cta")}
          </Button>
        )}
      </div>
      {reviewCountries.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {reviewCountries.map((country) => {
            const countryProgress = progress.countries[country.id];
            const countryName = getCountryName(country, locale);
            return (
              <li key={country.id} className="flex items-center gap-3 rounded-btn bg-surface-2 p-2">
                <span className="flex h-10 w-14 items-center justify-center overflow-hidden rounded-md border border-line bg-white p-1">
                  <FlagImage
                    flagPath={country.flagPath}
                    alt={countryName}
                    className="max-h-full max-w-full object-contain"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black">{countryName}</span>
                  {countryProgress && (
                    <MasteryBadge
                      masteryLevel={countryProgress.masteryLevel}
                      size="sm"
                      showLabel={false}
                    />
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm font-semibold text-text-muted">{t("home.noReviewCountries")}</p>
      )}
    </Card>
  );
}
