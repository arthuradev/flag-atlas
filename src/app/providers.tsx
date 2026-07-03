import type { ReactNode } from "react";
import "@/shared/i18n";
import { useLocaleSync } from "@/shared/i18n/useLocaleSync";
import { useTheme } from "@/shared/theme/useTheme";

type ProvidersProps = {
  children: ReactNode;
};

/** Efeitos globais do app: tema e idioma sincronizados com as configurações. */
export function Providers({ children }: ProvidersProps) {
  useTheme();
  useLocaleSync();
  return children;
}
