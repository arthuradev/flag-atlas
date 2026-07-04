import { Howl } from "howler";
import { getEquippedId } from "@/entities/cosmetic/cosmetic.selectors";
import { soundFileForPack } from "@/features/cosmetics/logic/soundPacks";
import { useProgressStore } from "@/features/progress/store/progressStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";

export type SoundName = "click" | "success" | "error" | "complete";

// Cache por (pacote + som): trocar de pacote não recarrega os já usados.
const howls = new Map<string, Howl>();

function getHowl(cacheKey: string, relativePath: string): Howl {
  let howl = howls.get(cacheKey);
  if (!howl) {
    howl = new Howl({
      src: [`${import.meta.env.BASE_URL}${relativePath}`],
      preload: true,
    });
    howls.set(cacheKey, howl);
  }
  return howl;
}

/**
 * Toca um som respeitando as configurações do usuário e o pacote de som
 * cosmético equipado. Com sons desligados, volume zero ou pacote silencioso,
 * nada é carregado nem tocado. Um som que falhe nunca bloqueia o app.
 */
export function playSound(name: SoundName): void {
  const { soundEnabled, volume } = useSettingsStore.getState();
  if (!soundEnabled || volume <= 0) {
    return;
  }
  const packId = getEquippedId(useProgressStore.getState().progress.cosmetics, "soundPack");
  const relativePath = soundFileForPack(packId, name);
  if (relativePath === null) {
    // Pacote silencioso: nada a tocar.
    return;
  }
  const howl = getHowl(`${packId}:${name}`, relativePath);
  howl.volume(volume);
  howl.play();
}
