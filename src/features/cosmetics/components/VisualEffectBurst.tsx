import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  resolveVisualEffectKind,
  type VisualEffectKind,
} from "@/features/cosmetics/logic/visualEffects";
import { useEquippedId } from "@/features/cosmetics/store/useCosmetics";
import { useSettingsStore } from "@/features/settings/store/settingsStore";

type VisualEffectBurstProps = {
  /** Muda (incrementa) para disparar o efeito uma vez. */
  playKey: number;
  className?: string;
};

const CONFETTI = ["#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#a855f7"];
const CONFETTI_X = [8, 24, 40, 56, 72, 88, 16, 48, 80, 64];
const STAR_POS = [
  [12, 20],
  [80, 16],
  [28, 70],
  [64, 78],
  [46, 34],
  [90, 60],
  [6, 52],
  [52, 8],
];

function EffectLayer({ kind }: { kind: VisualEffectKind }) {
  if (kind === "glow") {
    return (
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, var(--fa-progress) 0%, transparent 60%)",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.5, 0], scale: [0.6, 1.1, 1.2] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      />
    );
  }

  if (kind === "neonPulse") {
    return (
      <motion.div
        className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-4"
        style={{ borderColor: "var(--fa-ring)" }}
        initial={{ opacity: 0.7, scale: 0.3 }}
        animate={{ opacity: 0, scale: 2.4 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    );
  }

  if (kind === "confetti") {
    return (
      <>
        {CONFETTI_X.map((x, i) => (
          <motion.span
            key={`confetti-${x}`}
            className="absolute top-0 block h-2 w-2 rounded-[1px]"
            style={{ left: `${x}%`, backgroundColor: CONFETTI[i % CONFETTI.length] }}
            initial={{ y: "-10%", opacity: 0, rotate: 0 }}
            animate={{ y: "110%", opacity: [0, 1, 1, 0], rotate: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: (i % 5) * 0.05, ease: "easeIn" }}
          />
        ))}
      </>
    );
  }

  if (kind === "stars") {
    return (
      <>
        {STAR_POS.map(([x, y], i) => (
          <motion.span
            key={`${x}-${y}`}
            className="absolute block text-lg"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.1, 0.4] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, delay: (i % 4) * 0.08 }}
          >
            ✨
          </motion.span>
        ))}
      </>
    );
  }

  return null;
}

/**
 * Camada de efeito visual cosmético sutil, disparada em momentos de feedback.
 * Absoluta e sem captura de clique: nunca bloqueia a interação. Respeita
 * reduced motion (efeito desativado) e "nenhum"/inválido (não renderiza).
 * O contêiner pai deve ser `relative`.
 */
export function VisualEffectBurst({ playKey, className = "" }: VisualEffectBurstProps) {
  const effectId = useEquippedId("visualEffect");
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);
  const kind = resolveVisualEffectKind(effectId, reduceMotion);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (playKey <= 0 || kind === "none") {
      return;
    }
    setActive(true);
    const timer = setTimeout(() => setActive(false), 1200);
    return () => clearTimeout(timer);
  }, [playKey, kind]);

  if (kind === "none") {
    return null;
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <AnimatePresence>{active && <EffectLayer key={playKey} kind={kind} />}</AnimatePresence>
    </div>
  );
}
