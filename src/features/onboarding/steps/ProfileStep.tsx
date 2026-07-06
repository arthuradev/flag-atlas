import { useTranslation } from "react-i18next";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { Button } from "@/shared/components/Button";
import { Globi } from "@/shared/components/Globi";
import { Icon } from "@/shared/components/Icon";
import { type Locale, SUPPORTED_LOCALES } from "@/shared/i18n/locale";
import { useFocusOnMount } from "../hooks/useFocusOnMount";

const LOCALE_LABELS: Record<Locale, string> = {
  "pt-BR": "PT",
  "en-US": "EN",
};

type ProfileStepProps = {
  name: string;
  onNameChange: (name: string) => void;
  onBegin: () => void;
  animate?: boolean;
};

/** Step 4 — name, language and sound, then into the app. */
export function ProfileStep({ name, onNameChange, onBegin, animate = true }: ProfileStepProps) {
  const { t } = useTranslation();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const locale = useSettingsStore((state) => state.locale);
  const setLocale = useSettingsStore((state) => state.setLocale);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const setSoundEnabled = useSettingsStore((state) => state.setSoundEnabled);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onBegin();
      }}
      className={`flex flex-col items-center text-center lg:items-start lg:text-left ${animate ? "fa-onb-in" : ""}`}
    >
      <div className="mb-1.5 size-24 lg:hidden">
        <Globi variant="compact" expression="piscada" blink={animate} float={animate} />
      </div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-[27px] font-black leading-[1.1] tracking-tight text-text outline-none lg:text-[34px]"
      >
        {t("onboarding.profile.title")}
      </h1>
      <p className="mb-5 mt-2 max-w-[28ch] text-[15px] font-medium leading-relaxed text-text-muted lg:max-w-[34ch] lg:text-lg">
        {t("onboarding.profile.body")}
      </p>

      <div className="flex w-full max-w-[290px] flex-col gap-3.5 lg:max-w-[360px]">
        <div>
          <label htmlFor="onboarding-name" className="sr-only">
            {t("onboarding.profile.nameLabel")}
          </label>
          <input
            id="onboarding-name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder={t("onboarding.profile.namePlaceholder")}
            maxLength={20}
            autoComplete="off"
            className="w-full rounded-[14px] border-[1.5px] border-line bg-surface-2 px-4 py-3.5 text-base font-bold text-text outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25"
          />
        </div>

        <div>
          <div className="mb-1.5 text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
            {t("onboarding.profile.language")}
          </div>
          <div className="flex gap-2">
            {SUPPORTED_LOCALES.map((option) => {
              const isActive = locale === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setLocale(option)}
                  className={`flex-1 rounded-xl border-[1.5px] px-3 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isActive
                      ? "border-ring bg-ring/15 text-primary"
                      : "border-line bg-surface-2 text-text-muted hover:text-text"
                  }`}
                >
                  {LOCALE_LABELS[option]}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={soundEnabled}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center justify-between rounded-[14px] border border-line bg-surface-2 px-4 py-3.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex items-center gap-2.5 text-sm font-bold text-text">
            <Icon
              name={soundEnabled ? "volume" : "volume-off"}
              size={17}
              className="text-primary"
            />
            {t("onboarding.profile.sound")}
          </span>
          <span
            className={`relative h-6 w-[42px] rounded-full transition-colors ${
              soundEnabled ? "bg-ring" : "bg-line-strong"
            }`}
            aria-hidden
          >
            <span
              className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${
                soundEnabled ? "left-[20px]" : "left-0.5"
              }`}
            />
          </span>
        </button>

        <Button type="submit" size="lg" fullWidth className="mt-0.5">
          {t("onboarding.profile.begin")}
        </Button>
      </div>
    </form>
  );
}
