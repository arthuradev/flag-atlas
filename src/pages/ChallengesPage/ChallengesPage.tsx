import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { SessionConfig } from "@/entities/session/session.types";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useSessionStore } from "@/features/training/store/sessionStore";
import { playSound } from "@/shared/audio/soundPlayer";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { PageShell } from "@/shared/components/PageShell";

export function ChallengesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const defaultSessionSize = useSettingsStore((state) => state.defaultSessionSize);
  const startSession = useSessionStore((state) => state.startSession);

  const challenges = [
    {
      emoji: "⌨️",
      titleKey: "challenges.typingTitle",
      descriptionKey: "challenges.typingDescription",
      config: {
        mode: "continue",
        questionType: "typing",
        size: defaultSessionSize,
      } satisfies SessionConfig,
    },
    {
      emoji: "🎭",
      titleKey: "challenges.similarTitle",
      descriptionKey: "challenges.similarDescription",
      config: {
        mode: "similar",
        questionType: "choice",
        size: defaultSessionSize,
      } satisfies SessionConfig,
    },
  ] as const;

  const handleStart = (config: SessionConfig) => {
    playSound("click");
    navigate("/training");
    startSession(config);
  };

  return (
    <PageShell title={t("challenges.title")} backTo="/home">
      <div className="flex flex-col gap-4 pb-4">
        {challenges.map((challenge) => (
          <Card key={challenge.titleKey} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">
                {challenge.emoji}
              </span>
              <div>
                <h2 className="text-lg font-extrabold">{t(challenge.titleKey)}</h2>
                <p className="text-sm text-text-muted">{t(challenge.descriptionKey)}</p>
              </div>
            </div>
            <Button onClick={() => handleStart(challenge.config)}>{t("challenges.start")}</Button>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
