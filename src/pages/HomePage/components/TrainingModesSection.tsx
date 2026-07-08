import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { ExerciseType } from "@/entities/exercise/exercise.types";
import { listCountriesNeedingReview } from "@/entities/progress/progress.selectors";
import { buildSessionConfigForExercise } from "@/features/lessons/logic/buildSessionConfig";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useStartSession } from "@/features/training/hooks/useStartSession";
import { Icon, type IconName } from "@/shared/components/Icon";

type TrainingModeCard = {
  icon: IconName;
  labelKey: string;
  descriptionKey: string;
  exerciseType: ExerciseType;
  /** Sobrevivência é modificador de sessão (vidas), ortogonal ao exercício. */
  survival?: boolean;
};

const TRAINING_MODES = [
  {
    exerciseType: "typing",
    icon: "keyboard",
    labelKey: "home.trainingModes.typing.title",
    descriptionKey: "home.trainingModes.typing.body",
  },
  {
    exerciseType: "flag_to_country",
    survival: true,
    icon: "heart",
    labelKey: "home.trainingModes.survival.title",
    descriptionKey: "home.trainingModes.survival.body",
  },
  {
    exerciseType: "similar_flags",
    icon: "layers",
    labelKey: "home.trainingModes.similar.title",
    descriptionKey: "home.trainingModes.similar.body",
  },
  {
    exerciseType: "review",
    icon: "refresh",
    labelKey: "home.trainingModes.review.title",
    descriptionKey: "home.trainingModes.review.body",
  },
] satisfies readonly TrainingModeCard[];

/** Grid de atalhos de exercícios + link para a página de desafios. */
export function TrainingModesSection() {
  const { t } = useTranslation();
  const progress = useProgressStore((state) => state.progress);
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const startTraining = useStartSession();

  const reviewCount = listCountriesNeedingReview(progress).length;

  const handleMode = (card: TrainingModeCard) => {
    startTraining(
      buildSessionConfigForExercise({
        exerciseType: card.exerciseType,
        size: defaultSessionSize,
        ...(card.survival && { modifiers: { survival: true } }),
      }),
    );
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
          const isReviewDisabled = mode.exerciseType === "review" && reviewCount === 0;
          return (
            <button
              key={mode.labelKey}
              type="button"
              disabled={isReviewDisabled}
              onClick={() => handleMode(mode)}
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
