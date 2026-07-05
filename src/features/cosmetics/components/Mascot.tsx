import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { mascotIcon } from "@/features/cosmetics/logic/mascots";
import { useEquippedId } from "@/features/cosmetics/store/useCosmetics";
import { Icon } from "@/shared/components/Icon";

type MascotSize = "sm" | "md" | "lg";

type MascotProps = {
  size?: MascotSize;
  className?: string;
};

/** Ícone do mascote em medalhão arredondado — discreto, nunca infantil. */
const SIZE_PX: Record<MascotSize, number> = {
  sm: 22,
  md: 34,
  lg: 52,
};

const SIZE_BOX: Record<MascotSize, string> = {
  sm: "h-9 w-9",
  md: "h-14 w-14",
  lg: "h-20 w-20",
};

/**
 * Mascote discreto e opcional. Renderiza nada quando "nenhum" está equipado.
 * A animação sutil de flutuação é desativada sob reduced motion pelo
 * MotionConfig global (animações de transform param), sem quebrar nada.
 */
export function Mascot({ size = "md", className = "" }: MascotProps) {
  const { t } = useTranslation();
  const mascotId = useEquippedId("mascot");
  const icon = mascotIcon(mascotId);
  if (!icon) {
    return null;
  }
  return (
    <motion.span
      className={`inline-flex select-none items-center justify-center rounded-full bg-pine-soft text-primary ring-1 ring-primary/15 ${SIZE_BOX[size]} ${className}`}
      title={t(`cosmetics.items.${mascotId}.name`)}
      data-testid="mascot"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      <Icon name={icon} size={SIZE_PX[size]} strokeWidth={1.8} />
    </motion.span>
  );
}
