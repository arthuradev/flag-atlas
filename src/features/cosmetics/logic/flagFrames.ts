/**
 * Molduras cosméticas da bandeira (Versão 4). A moldura decora apenas o card
 * que envolve a bandeira (borda, anel, sombra) — nunca a própria <img>, então
 * não distorce nem esconde a bandeira. Molduras desconhecidas caem no padrão.
 *
 * As classes são aplicadas por cima do card da bandeira (que já tem borda
 * padrão), então usam utilitários que sobrescrevem borda/anel/sombra.
 */
export const FLAG_FRAME_CLASSES: Record<string, string> = {
  "frame-default": "",
  "frame-atlas": "ring-2 ring-primary/70 ring-offset-2 ring-offset-background",
  "frame-madeira": "border-4 border-amber-700/70 shadow-md",
  "frame-neon": "border-2 border-fuchsia-400/80 shadow-[0_0_16px_2px_rgba(217,70,239,0.45)]",
  "frame-oceano": "border-4 border-sky-500/60 shadow-[0_0_14px_1px_rgba(14,165,233,0.35)]",
  "frame-biblioteca": "border-4 border-double border-amber-800/60 shadow-sm",
};

const DEFAULT_FRAME_ID = "frame-default";

/** Classe da moldura equipada, com fallback seguro para a moldura padrão. */
export function flagFrameClass(frameId: string): string {
  return FLAG_FRAME_CLASSES[frameId] ?? FLAG_FRAME_CLASSES[DEFAULT_FRAME_ID] ?? "";
}
