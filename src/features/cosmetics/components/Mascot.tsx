import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { mascotEmoji } from "@/features/cosmetics/logic/mascots";
import { useEquippedId } from "@/features/cosmetics/store/useCosmetics";

type MascotSize = "sm" | "md" | "lg";

type MascotProps = {
  size?: MascotSize;
  className?: string;
};

const SIZE_CLASSES: Record<MascotSize, string> = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
};

/**
 * Mascote discreto e opcional. Renderiza nada quando "nenhum" está equipado.
 * A animação sutil de flutuação é desativada sob reduced motion pelo
 * MotionConfig global (animações de transform param), sem quebrar nada.
 */
export function Mascot({ size = "md", className = "" }: MascotProps) {
  const { t } = useTranslation();
  const mascotId = useEquippedId("mascot");
  const emoji = mascotEmoji(mascotId);
  if (!emoji) {
    return null;
  }
  return (
    <motion.span
      className={`inline-block select-none ${SIZE_CLASSES[size]} ${className}`}
      aria-hidden="true"
      title={t(`cosmetics.items.${mascotId}.name`)}
      data-testid="mascot"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      {emoji}
    </motion.span>
  );
}
