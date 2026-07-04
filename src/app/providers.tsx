import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import "@/shared/i18n";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useUiClickSound } from "@/shared/audio/useUiClickSound";
import { useLocaleSync } from "@/shared/i18n/useLocaleSync";
import { useTheme } from "@/shared/theme/useTheme";

type ProvidersProps = {
  children: ReactNode;
};

/** Efeitos globais do app: tema, idioma e política de animação. */
export function Providers({ children }: ProvidersProps) {
  useTheme();
  useLocaleSync();
  useUiClickSound();
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);

  return <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>{children}</MotionConfig>;
}
