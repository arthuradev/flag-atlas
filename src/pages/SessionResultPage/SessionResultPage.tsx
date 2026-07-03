import { useTranslation } from "react-i18next";
import { PageShell } from "@/shared/components/PageShell";

export function SessionResultPage() {
  const { t } = useTranslation();

  return (
    <PageShell title={t("result.title")} backTo="/home">
      <p className="py-10 text-center text-text-muted">{t("result.title")}</p>
    </PageShell>
  );
}
