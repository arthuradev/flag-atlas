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
    <div className={`flex flex-col gap-5 ${animate ? "fa-onb-in" : ""}`}>
      <div>
        <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-pine-soft px-3 py-1 text-xs font-black uppercase text-primary">
          <Icon name="sparkles" size={14} />
          {t("onboarding.lesson.badge")}
        </p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-[26px] font-black leading-[1.12] text-text outline-none lg:text-[34px]"
        >
          {t("onboarding.lesson.title")}
        </h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {countries.map((country) => {
          const countryName = getCountryName(country, locale);
          const isSelected = selectedCountryId === country.id;
          return (
            <button
              key={country.id}
              type="button"
              data-testid="lesson-zero-option"
              aria-pressed={isSelected}
              onClick={() => onSelect(country.id)}
              className={`group flex min-h-40 flex-col gap-3 rounded-card border-2 bg-surface p-3 text-left shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isSelected
                  ? "border-ring bg-pine-soft"
                  : "border-line hover:-translate-y-0.5 hover:bg-surface-2"
              }`}
            >
              <span className="flex h-24 items-center justify-center overflow-hidden rounded-btn border border-line bg-white p-2 shadow-sm">
                <FlagImage
                  flagPath={country.flagPath}
                  alt={t("onboarding.lesson.flagAlt", { country: countryName })}
                  className="max-h-full max-w-full rounded-md object-contain"
                />
              </span>
              <span className="flex items-center justify-between gap-2">
                <span className="font-black text-text">{countryName}</span>
                {isSelected && (
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
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
