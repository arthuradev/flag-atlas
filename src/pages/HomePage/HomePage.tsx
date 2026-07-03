import { useTranslation } from "react-i18next";
import { PageShell } from "@/shared/components/PageShell";

export function HomePage() {
  const { t } = useTranslation();

  return (
    <PageShell>
      <h1 className="py-10 text-center text-3xl font-extrabold">{t("app.name")}</h1>
      <p className="text-center text-text-muted">{t("app.tagline")}</p>
    </PageShell>
  );
}
