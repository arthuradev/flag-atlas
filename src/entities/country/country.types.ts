import type { ContinentId } from "@/entities/continent/continent.types";
import type { Locale } from "@/shared/i18n/locale";

export type Country = {
  id: string;
  iso2: string;
  names: Record<Locale, string>;
  aliases?: Partial<Record<Locale, readonly string[]>>;
  continentId: ContinentId;
  /** Relative to the app base URL, e.g. "flags/mvp/br.svg". */
  flagPath: string;
  slug: string;
};

export type ExtraFlag = {
  id: string;
  nameEn: string;
  /** Relative to the app base URL, e.g. "flags/extras/ai.svg". */
  flagPath: string;
};
