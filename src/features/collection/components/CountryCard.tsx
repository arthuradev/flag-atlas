import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getCountryName } from "@/entities/country/country.selectors";
import type { Country } from "@/entities/country/country.types";
import { isMasteryAtLeast } from "@/entities/progress/progress.selectors";
import type { CountryProgress, MasteryLevel } from "@/entities/progress/progress.types";
import { FlagImage } from "@/shared/components/FlagImage";
import { Icon } from "@/shared/components/Icon";
import type { Locale } from "@/shared/i18n/locale";

export type CollectionCardStatus = "locked" | "learning" | "mastered";

/** Estado do card na Pokédex: bloqueado (não visto), aprendendo ou dominado. */
export function collectionCardStatus(progress: CountryProgress | undefined): CollectionCardStatus {
  const seen = (progress?.seenCount ?? 0) > 0;
  if (!seen) {
    return "locked";
  }
  const masteryLevel: MasteryLevel = progress?.masteryLevel ?? "new";
  return isMasteryAtLeast(masteryLevel, "dominated") ? "mastered" : "learning";
}

const STATUS_CHIP_CLASSES: Record<CollectionCardStatus, string> = {
  locked: "bg-surface-2 text-text-muted",
  learning: "bg-accent-soft text-ocre-ink",
  mastered: "bg-success-soft text-success",
};

type CountryCardProps = {
  country: Country;
  number: number;
  progress: CountryProgress | undefined;
  locale: Locale;
};

/**
 * Card colecionável da Pokédex de países. A bandeira tem área própria e usa
 * object-contain — nunca é cortada. Países não vistos guardam a bandeira
 * atrás de um cadeado, mas o card continua bonito e pesquisável pelo nome.
 */
export function CountryCard({ country, number, progress, locale }: CountryCardProps) {
  const { t } = useTranslation();
  const status = collectionCardStatus(progress);
  const name = getCountryName(country, locale);

  return (
    <li className="min-w-0">
      <Link
        to={`/collection/${country.id}`}
        data-testid="collection-card"
        data-country-id={country.id}
        data-status={status}
        className="relative flex h-full flex-col items-center gap-2 rounded-card border border-line bg-surface p-3 pb-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span
          aria-hidden="true"
          className="absolute left-2.5 top-2.5 rounded-md bg-surface-2 px-1.5 py-0.5 text-[0.6rem] font-extrabold text-text-muted"
        >
          #{String(number).padStart(3, "0")}
        </span>

        <span className="mt-4 flex h-16 w-full items-center justify-center sm:h-[4.5rem]">
          {status === "locked" ? (
            <span className="flex size-12 items-center justify-center rounded-full bg-surface-2 text-faint">
              <Icon name="lock" size={22} />
            </span>
          ) : (
            <FlagImage
              flagPath={country.flagPath}
              alt=""
              className="max-h-full max-w-[85%] rounded-md object-contain shadow-sm"
            />
          )}
        </span>

        <span
          className={`line-clamp-2 w-full text-center text-[0.82rem] font-extrabold leading-snug ${
            status === "locked" ? "text-text-muted" : "text-text"
          }`}
        >
          {name}
        </span>

        <span
          className={`mt-auto rounded-full px-2.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-wide ${STATUS_CHIP_CLASSES[status]}`}
        >
          {t(`collection.cardStatus.${status}`)}
        </span>
      </Link>
    </li>
  );
}
