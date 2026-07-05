import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useSettingsStore } from "@/features/settings/store/settingsStore";

type PageTransitionProps = {
  className?: string;
  children: ReactNode;
};

export function PageTransition({ className = "", children }: PageTransitionProps) {
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
