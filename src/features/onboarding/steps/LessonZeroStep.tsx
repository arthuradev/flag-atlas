import { useTranslation } from "react-i18next";
import { getCountryName } from "@/entities/country/country.selectors";
import type { Country } from "@/entities/country/country.types";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { FlagImage } from "@/shared/components/FlagImage";
import { Icon } from "@/shared/components/Icon";
import { useFocusOnMount } from "../hooks/useFocusOnMount";

type LessonZeroStepProps = {
  countries: readonly Country[];
  selectedCountryId: string | null;
  onSelect: (countryId: string) => void;
  animate?: boolean;
};

export function LessonZeroStep({
  countries,
  selectedCountryId,
  onSelect,
  animate = true,
}: LessonZeroStepProps) {
  const { t } = useTranslation();
  const locale = useSettingsStore((state) => state.locale);
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  return (
    <div className={`flex flex-col gap-6 ${animate ? "fa-onb-in" : ""}`}>
      <div className="max-w-2xl">
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-pine-soft px-3 py-1 text-xs font-black uppercase tracking-[0.04em] text-primary">
          <Icon name="sparkles" size={14} />
          {t("onboarding.lesson.badge")}
        </p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-[28px] font-black leading-[1.08] text-text outline-none sm:text-[34px] lg:text-[38px]"
        >
          {t("onboarding.lesson.title")}
        </h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {countries.map((country, index) => {
          const countryName = getCountryName(country, locale);
          const isSelected = selectedCountryId === country.id;
          return (
            <button
              key={country.id}
              type="button"
              data-testid="lesson-zero-option"
              aria-pressed={isSelected}
              onClick={() => onSelect(country.id)}
              className={`group relative flex min-h-48 flex-col gap-3 rounded-[18px] border-2 bg-surface p-3 text-left shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isSelected
                  ? "border-ring bg-pine-soft shadow-[0_18px_40px_-26px_var(--fa-ring)]"
                  : "border-line hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2"
              }`}
            >
              <span
                className={`absolute right-2 top-2 flex size-6 items-center justify-center rounded-full text-xs font-black ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-2 text-text-muted ring-1 ring-line"
                }`}
                aria-hidden
              >
                {index + 1}
              </span>
              <span className="flex h-28 items-center justify-center overflow-hidden rounded-btn border border-line bg-white p-2 shadow-flag sm:h-32 xl:h-28">
                <FlagImage
                  flagPath={country.flagPath}
                  alt={t("onboarding.lesson.flagAlt", { country: countryName })}
                  className="max-h-full max-w-full rounded-md object-contain"
                />
              </span>
              <span className="flex min-h-8 items-center justify-between gap-2">
                <span className="font-black leading-tight text-text">{countryName}</span>
                {isSelected && (
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon name="check" size={15} strokeWidth={3} />
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
