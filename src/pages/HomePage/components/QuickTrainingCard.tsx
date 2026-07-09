import { useTranslation } from "react-i18next";
import { useStartSession } from "@/features/training/hooks/useStartSession";
import { Icon } from "@/shared/components/Icon";

/** Treino rápido como ação secundária: card pontilhado com botão "Começar". */
export function QuickTrainingCard() {
  const { t } = useTranslation();
  const startTraining = useStartSession();

  const handleQuickTraining = () => {
    startTraining({ mode: "continue", questionType: "choice", size: 5 });
  };

  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-dashed border-line-strong px-[18px] py-[15px]">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-[13px] bg-accent-soft text-ocre-ink">
        <Icon name="zap" size={22} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] font-extrabold text-text">{t("learn.quickTrainingTitle")}</p>
        <p className="mt-0.5 text-[12.5px] font-semibold text-text-muted">
          {t("learn.quickTrainingBody")}
        </p>
      </div>
      <button
        type="button"
        onClick={handleQuickTraining}
        className="shrink-0 cursor-pointer rounded-xl border-[1.5px] border-line-strong bg-surface px-[18px] py-2.5 text-[13px] font-extrabold text-text transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {t("learn.quickTrainingCta")}
      </button>
    </div>
  );
}
