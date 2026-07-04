import type { SoundName } from "@/shared/audio/soundPlayer";

/**
 * Pacotes de som cosméticos (Versão 4). Cada pacote é uma pasta local de
 * assets WAV — nada de URLs externas nem CDN. O pacote "silencioso" não toca
 * som algum; pacotes desconhecidos caem no padrão. Volume e mute globais
 * continuam valendo (tratados no soundPlayer).
 *
 * Diretório por pacote: null = silencioso, "" = raiz sounds/, "x" = sounds/x/.
 */
export const SOUND_PACK_DIRS: Record<string, string | null> = {
  "sound-default": "",
  "sound-silent": null,
  "sound-suave": "suave",
  "sound-arcade": "arcade",
  "sound-digital": "digital",
};

const DEFAULT_PACK_ID = "sound-default";

/** Diretório de um pacote, com fallback para o padrão quando desconhecido. */
export function soundPackDir(packId: string): string | null {
  const dir = SOUND_PACK_DIRS[packId];
  if (dir !== undefined) {
    return dir;
  }
  return SOUND_PACK_DIRS[DEFAULT_PACK_ID] ?? "";
}

/**
 * Caminho relativo (sem BASE_URL) do arquivo de som para um pacote e evento,
 * ou null quando o pacote é silencioso. O soundPlayer prefixa o BASE_URL.
 */
export function soundFileForPack(packId: string, name: SoundName): string | null {
  const dir = soundPackDir(packId);
  if (dir === null) {
    return null;
  }
  return dir === "" ? `sounds/${name}.wav` : `sounds/${dir}/${name}.wav`;
}
