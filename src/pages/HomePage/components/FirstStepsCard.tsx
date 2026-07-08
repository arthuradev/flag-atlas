import { useTranslation } from "react-i18next";
import { Card } from "@/shared/components/Card";
import { Icon } from "@/shared/components/Icon";

/** Checklist estático dos primeiros passos, visível só na primeira visita. */
export function FirstStepsCard() {
  const { t } = useTranslation();
  const steps = ["home.firstSteps.train", "home.firstSteps.xp", "home.firstSteps.badge"] as const;

  return (
    <Card className="flex flex-col gap-3 p-4">
      <h2 className="text-sm font-extrabold text-text-muted">{t("home.firstSteps.title")}</h2>
      <ul className="flex flex-col gap-2">
        {steps.map((step) => (
          <li key={step} className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex size-6 items-center justify-center rounded-full bg-pine-soft text-primary">
              <Icon name="check" size={15} strokeWidth={2.6} />
            </span>
            {t(step)}
          </li>
        ))}
      </ul>
    </Card>
  );
}
