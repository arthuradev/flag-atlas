import { useNavigate } from "react-router-dom";
import type { SessionConfig } from "@/entities/session/session.types";
import { useSessionStore } from "@/features/training/store/sessionStore";

/**
 * Inicia uma sessão e navega para o treino. O config viaja pelo store,
 * nunca pela URL — este é o único caminho para entrar em /training com
 * uma sessão configurada.
 */
export function useStartSession(): (config: SessionConfig) => void {
  const navigate = useNavigate();
  const startSession = useSessionStore((state) => state.startSession);

  return (config) => {
    startSession(config);
    navigate("/training");
  };
}
