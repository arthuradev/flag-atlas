import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { SessionConfig } from "@/entities/session/session.types";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useSessionStore } from "@/features/training/store/sessionStore";
import { playSound } from "@/shared/audio/soundPlayer";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { PageShell } from "@/shared/components/PageShell";

type ChallengeCard = {
  emoji: string;
  titleKey: string;
  descriptionKey: string;
  /** Chip com o tipo de pergunta. */
  questionTypeKey: string;
  /** Chip com a duração aproximada. */
  duration: { key: string; count?: number };
  config: SessionConfig;
};

export function ChallengesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const startSession = useSessionStore((state) => state.startSession);
  const bestSurvivalScore = useProgressStore((state) => state.progress.survival.bestScore);

  const challenges: ChallengeCard[] = [
    {
      emoji: "⌨️",
      titleKey: "challenges.typingTitle",
      descriptionKey: "challenges.typingDescription",
      questionTypeKey: "challenges.questionTypeTyping",
      duration: { key: "training.questionsCount", count: defaultSessionSize },
      config: { mode: "continue", questionType: "typing", size: defaultSessionSize },
    },
    {
      emoji: "🎭",
      titleKey: "challenges.similarTitle",
      descriptionKey: "challenges.similarDescription",
      questionTypeKey: "challenges.questionTypeChoice",
      duration: { key: "training.questionsCount", count: defaultSessionSize },
      config: { mode: "similar", questionType: "choice", size: defaultSessionSize },
    },
    {
      emoji: "🔁",
      titleKey: "challenges.reviewTitle",
      descriptionKey: "challenges.reviewDescription",
      questionTypeKey: "challenges.questionTypeChoice",
      duration: { key: "training.questionsCount", count: defaultSessionSize },
      config: { mode: "review", questionType: "choice", size: defaultSessionSize },
    },
    {
      emoji: "🛡️",
      titleKey: "challenges.survivalTitle",
      descriptionKey: "challenges.survivalDescription",
      questionTypeKey: "challenges.questionTypeChoice",
      duration: { key: "challenges.durationUntilLives" },
      config: { mode: "survival", questionType: "choice", size: defaultSessionSize },
    },
    {
      emoji: "⚡",
      titleKey: "challenges.quickTitle",
      descriptionKey: "challenges.quickDescription",
      questionTypeKey: "challenges.questionTypeChoice",
      duration: { key: "training.questionsCount", count: 5 },
      config: { mode: "continue", questionType: "choice", size: 5 },
    },
    {
      emoji: "💯",
      titleKey: "challenges.perfectTitle",
      descriptionKey: "challenges.perfectDescription",
      questionTypeKey: "challenges.questionTypeChoice",
      duration: { key: "training.questionsCount", count: 10 },
      config: { mode: "continue", questionType: "choice", size: 10 },
    },
  ];

  const handleStart = (config: SessionConfig) => {
    playSound("click");
    navigate("/training");
    startSession(config);
  };

  return (
    <PageShell title={t("challenges.title")} backTo="/home">
      <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2">
        {challenges.map((challenge) => (
          <Card
            key={challenge.titleKey}
            data-testid="challenge-card"
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">
                {challenge.emoji}
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold">{t(challenge.titleKey)}</h2>
                <p className="text-sm text-text-muted">{t(challenge.descriptionKey)}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-text-muted">
              <span className="rounded-full border border-border px-2.5 py-1">
                {t(challenge.questionTypeKey)}
              </span>
              <span className="rounded-full border border-border px-2.5 py-1">
                {challenge.duration.count !== undefined
                  ? t(challenge.duration.key, { count: challenge.duration.count })
                  : t(challenge.duration.key)}
              </span>
              {challenge.config.mode === "survival" && bestSurvivalScore > 0 && (
                <span className="rounded-full border border-border px-2.5 py-1 text-warning">
                  🏆 {t("challenges.bestScore", { score: bestSurvivalScore })}
                </span>
              )}
            </div>
            <Button className="mt-auto" onClick={() => handleStart(challenge.config)}>
              {t("challenges.start")}
            </Button>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
