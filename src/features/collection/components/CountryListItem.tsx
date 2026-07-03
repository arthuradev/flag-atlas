import { useTranslation } from "react-i18next";
import { getCountryName } from "@/entities/country/country.selectors";
import type { Country } from "@/entities/country/country.types";
import type { CountryProgress, MasteryLevel } from "@/entities/progress/progress.types";
import { FlagImage } from "@/shared/components/FlagImage";
import type { Locale } from "@/shared/i18n/locale";

const MASTERY_CHIP_CLASSES: Record<MasteryLevel, string> = {
  new: "bg-border/50 text-text-muted",
  recognized: "bg-primary/10 text-primary",
  learned: "bg-success/15 text-success",
  dominated: "bg-warning/15 text-warning",
  master: "bg-progress/25 text-warning",
};

type CountryListItemProps = {
  country: Country;
  progress: CountryProgress | undefined;
  locale: Locale;
};

export function CountryListItem({ country, progress, locale }: CountryListItemProps) {
  const { t } = useTranslation();
  const masteryLevel: MasteryLevel = progress?.masteryLevel ?? "new";
  const seen = (progress?.seenCount ?? 0) > 0;

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-2.5">
      <FlagImage
        flagPath={country.flagPath}
        alt=""
        className={`h-7 w-10 rounded-sm object-cover shadow-sm ${seen ? "" : "opacity-45 grayscale"}`}
      />
      <span className={`flex-1 font-bold ${seen ? "" : "text-text-muted"}`}>
        {getCountryName(country, locale)}
      </span>
      {progress?.needsReview && (
        <span
          className="text-sm"
          role="img"
          aria-label={t("collection.statusReview")}
          title={t("collection.statusReview")}
        >
          🔁
        </span>
      )}
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${MASTERY_CHIP_CLASSES[masteryLevel]}`}
      >
        {masteryLevel === "master" && "⭐ "}
        {t(`mastery.${masteryLevel}`)}
      </span>
    </li>
  );
}
