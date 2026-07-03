import { useTranslation } from "react-i18next";
import { PageShell } from "@/shared/components/PageShell";

export function SettingsPage() {
  const { t } = useTranslation();

  return (
    <PageShell title={t("settings.title")} backTo="/home">
      <p className="py-10 text-center text-text-muted">{t("settings.title")}</p>
    </PageShell>
  );
}
