import { useTranslation } from "react-i18next";
import { PageShell } from "@/shared/components/PageShell";

export function TrainingPage() {
  const { t } = useTranslation();

  return (
    <PageShell title={t("training.title")} backTo="/home">
      <p className="py-10 text-center text-text-muted">{t("training.whichCountry")}</p>
    </PageShell>
  );
}
