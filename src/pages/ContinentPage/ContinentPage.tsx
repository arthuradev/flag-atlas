import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PageShell } from "@/shared/components/PageShell";

export function ContinentPage() {
  const { t } = useTranslation();
  const { continentId } = useParams();

  return (
    <PageShell title={t("continents.title")} backTo="/continents">
      <p className="py-10 text-center text-text-muted">{continentId}</p>
    </PageShell>
  );
}
