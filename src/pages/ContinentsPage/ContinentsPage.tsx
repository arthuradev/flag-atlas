import { useTranslation } from "react-i18next";
import { PageShell } from "@/shared/components/PageShell";

export function ContinentsPage() {
  const { t } = useTranslation();

  return (
    <PageShell title={t("continents.title")} backTo="/home">
      <p className="py-10 text-center text-text-muted">{t("continents.title")}</p>
    </PageShell>
  );
}
