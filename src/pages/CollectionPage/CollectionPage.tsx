import { useTranslation } from "react-i18next";
import { PageShell } from "@/shared/components/PageShell";

export function CollectionPage() {
  const { t } = useTranslation();

  return (
    <PageShell title={t("collection.title")} backTo="/home">
      <p className="py-10 text-center text-text-muted">{t("collection.empty")}</p>
    </PageShell>
  );
}
