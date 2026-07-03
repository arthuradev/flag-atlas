import { useTranslation } from "react-i18next";
import { PageShell } from "@/shared/components/PageShell";

export function OnboardingPage() {
  const { t } = useTranslation();

  return (
    <PageShell>
      <p className="py-10 text-center text-text-muted">{t("onboarding.welcomeTitle")}</p>
    </PageShell>
  );
}
