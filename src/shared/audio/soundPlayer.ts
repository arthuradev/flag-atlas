import { Howl } from "howler";
import { useSettingsStore } from "@/features/settings/store/settingsStore";

export type SoundName = "click" | "success" | "error" | "complete";

const howls = new Map<SoundName, Howl>();

function getHowl(name: SoundName): Howl {
  let howl = howls.get(name);
  if (!howl) {
    howl = new Howl({
      src: [`${import.meta.env.BASE_URL}sounds/${name}.wav`],
      preload: true,
    });
    howls.set(name, howl);
  }
  return howl;
}

/**
 * Toca um som respeitando as configurações do usuário.
 * Com sons desligados ou volume zero, nada é carregado nem tocado.
 */
export function playSound(name: SoundName): void {
  const { soundEnabled, volume } = useSettingsStore.getState();
  if (!soundEnabled || volume <= 0) {
    return;
  }
  const howl = getHowl(name);
  howl.volume(volume);
  howl.play();
}
