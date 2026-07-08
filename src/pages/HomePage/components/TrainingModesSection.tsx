import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { listCountriesNeedingReview } from "@/entities/progress/progress.selectors";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useStartSession } from "@/features/training/hooks/useStartSession";
import { Icon, type IconName } from "@/shared/components/Icon";

type TrainingMode = {
  icon: IconName;
  labelKey: string;
  descriptionKey: string;
  action: "typing" | "survival" | "similar" | "review";
};

const TRAINING_MODES = [
  {
    action: "typing",
    icon: "keyboard",
    labelKey: "home.trainingModes.typing.title",
    descriptionKey: "home.trainingModes.typing.body",
  },
  {
    action: "survival",
    icon: "heart",
    labelKey: "home.trainingModes.survival.title",
    descriptionKey: "home.trainingModes.survival.body",
  },
  {
    action: "similar",
    icon: "layers",
    labelKey: "home.trainingModes.similar.title",
    descriptionKey: "home.trainingModes.similar.body",
  },
  {
    action: "review",
    icon: "refresh",
    labelKey: "home.trainingModes.review.title",
    descriptionKey: "home.trainingModes.review.body",
  },
] satisfies readonly TrainingMode[];

/** Grid de atalhos de modos de treino + link para a página de desafios. */
export function TrainingModesSection() {
  const { t } = useTranslation();
  const progress = useProgressStore((state) => state.progress);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const startTraining = useStartSession();

  const reviewCount = listCountriesNeedingReview(progress).length;

  const handleMode = (mode: TrainingMode["action"]) => {
    if (mode === "typing") {
      startTraining({ mode: "continue", questionType: "typing", size: defaultSessionSize });
      return;
    }
    if (mode === "survival") {
      startTraining({ mode: "survival", questionType: "choice", size: defaultSessionSize });
      return;
    }
    if (mode === "similar") {
      startTraining({ mode: "similar", questionType: "choice", size: defaultSessionSize });
      return;
    }
    startTraining({ mode: "review", questionType: "choice", size: defaultSessionSize });
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-black text-text">{t("home.trainingModes.title")}</h2>
        <Link
          to="/challenges"
          className="text-sm font-extrabold text-primary hover:text-pine-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("home.trainingModes.all")}
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {TRAINING_MODES.map((mode) => {
          const isReviewDisabled = mode.action === "review" && reviewCount === 0;
          return (
            <button
              key={mode.action}
              type="button"
              disabled={isReviewDisabled}
              onClick={() => handleMode(mode.action)}
              className="flex min-h-28 items-start gap-3 rounded-card border border-line bg-surface p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-btn bg-pine-soft text-primary">
                <Icon name={mode.icon} size={22} />
              </span>
              <span>
                <span className="block font-black text-text">{t(mode.labelKey)}</span>
                <span className="mt-1 block text-sm font-semibold text-text-muted">
                  {t(mode.descriptionKey)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
