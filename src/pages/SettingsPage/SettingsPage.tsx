import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SESSION_SIZES } from "@/entities/settings/settings.types";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { OptionGroup } from "@/features/settings/components/OptionGroup";
import { ToggleRow } from "@/features/settings/components/ToggleRow";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Icon } from "@/shared/components/Icon";
import { PageShell } from "@/shared/components/PageShell";
import { SUPPORTED_LOCALES } from "@/shared/i18n/locale";

const LOCALE_LABELS: Record<string, string> = {
  "pt-BR": "Português (Brasil)",
  "en-US": "English (US)",
};

export function SettingsPage() {
  const { t } = useTranslation();
  const settings = useSettingsStore();
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    resetProgress();
    setConfirmingReset(false);
    setResetDone(true);
  };

  return (
    <PageShell title={t("settings.title")} backTo="/home">
      <div className="flex flex-col gap-4 pb-4">
        <Card>
          <OptionGroup
            label={t("settings.language")}
            options={SUPPORTED_LOCALES.map((locale) => ({
              value: locale,
              label: LOCALE_LABELS[locale] ?? locale,
            }))}
            value={settings.locale}
            onChange={settings.setLocale}
          />
        </Card>

        <Card>
          <OptionGroup
            label={t("settings.theme")}
            options={[
              { value: "light" as const, label: t("settings.themeLight") },
              { value: "dark" as const, label: t("settings.themeDark") },
              { value: "system" as const, label: t("settings.themeSystem") },
            ]}
            value={settings.theme}
            onChange={settings.setTheme}
          />
        </Card>

        <Card className="flex flex-col gap-3">
          <div>
            <p className="font-bold">{t("settings.customization")}</p>
            <p className="text-sm text-text-muted">{t("settings.customizationBody")}</p>
          </div>
          <Link
            to="/shop"
            className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-2xl border border-border bg-surface px-5 font-bold transition hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon name="shop" size={19} />
            {t("settings.openShop")}
          </Link>
        </Card>

        <Card className="flex flex-col gap-4">
          <ToggleRow
            label={t("settings.sound")}
            checked={settings.soundEnabled}
            onChange={settings.setSoundEnabled}
          />
          <label className="flex items-center gap-3">
            <span className="font-bold">{t("settings.volume")}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(settings.volume * 100)}
              disabled={!settings.soundEnabled}
              onChange={(event) => settings.setVolume(Number(event.target.value) / 100)}
              className="h-2 flex-1 cursor-pointer accent-(--fa-primary) disabled:cursor-not-allowed disabled:opacity-40"
            />
          </label>
        </Card>

        <Card>
          <ToggleRow
            label={t("settings.reduceMotion")}
            checked={settings.reduceMotion}
            onChange={settings.setReduceMotion}
          />
        </Card>

        <Card>
          <OptionGroup
            label={t("settings.sessionSize")}
            options={SESSION_SIZES.map((size) => ({
              value: size,
              label: t("training.questionsCount", { count: size }),
            }))}
            value={settings.defaultSessionSize}
            onChange={settings.setDefaultSessionSize}
          />
        </Card>

        <Card className="flex flex-col gap-3">
          {confirmingReset ? (
            <>
              <p className="font-extrabold">{t("settings.resetConfirmTitle")}</p>
              <p className="text-sm text-text-muted">{t("settings.resetConfirmBody")}</p>
              <div className="flex gap-3">
                <Button variant="danger" onClick={handleReset}>
                  {t("settings.resetConfirmAction")}
                </Button>
                <Button variant="secondary" onClick={() => setConfirmingReset(false)}>
                  {t("common.cancel")}
                </Button>
              </div>
            </>
          ) : (
            <Button
              variant="danger"
              onClick={() => {
                setResetDone(false);
                setConfirmingReset(true);
              }}
            >
              {t("settings.resetProgress")}
            </Button>
          )}
          <p aria-live="polite" className="text-sm font-bold text-success">
            {resetDone ? t("settings.resetDone") : ""}
          </p>
        </Card>

        <p className="px-2 text-center text-xs text-text-muted">{t("settings.flagAttribution")}</p>
      </div>
    </PageShell>
  );
}
