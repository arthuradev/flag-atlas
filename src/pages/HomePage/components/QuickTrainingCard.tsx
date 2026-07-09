import { useTranslation } from "react-i18next";
import { useStartSession } from "@/features/training/hooks/useStartSession";
import { Icon } from "@/shared/components/Icon";

/** Treino rápido como ação secundária: uma rodada curta, sem virar "Modos". */
export function QuickTrainingCard() {
  const { t } = useTranslation();
  const startTraining = useStartSession();

  const handleQuickTraining = () => {
    startTraining({ mode: "continue", questionType: "choice", size: 5 });
  };

  return (
    <button
      type="button"
      onClick={handleQuickTraining}
      className="flex w-full cursor-pointer items-center gap-3 rounded-card border border-line bg-surface p-4 text-left shadow-card transition hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-btn bg-accent-soft text-warning">
        <Icon name="zap" size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold text-text">
          {t("learn.quickTrainingTitle")}
        </span>
        <span className="block text-xs font-semibold text-text-muted">
          {t("learn.quickTrainingBody")}
        </span>
      </span>
      <Icon name="chevron-right" size={18} className="shrink-0 text-faint" />
    </button>
  );
}
