/**
 * Estilos do avatar do jogador (categoria "Meu Avatar" da Loja).
 *
 * O sistema completo de avatar (cabelo, roupas, poses) ainda não existe;
 * a primeira geração de itens são fundos de perfil — gradientes aplicados
 * ao chip de iniciais no Perfil e na sidebar. Ids desconhecidos caem no
 * padrão para nunca quebrar o avatar.
 */
export const AVATAR_STYLE_CLASSES: Record<string, string> = {
  "avatar-explorer": "bg-gradient-to-br from-[#F5A836] to-[#E5533F]",
  "avatar-ocean": "bg-gradient-to-br from-[#12C2D6] to-[#0A5E90]",
  "avatar-forest": "bg-gradient-to-br from-[#4DBB63] to-[#1D6A44]",
  "avatar-sand": "bg-gradient-to-br from-[#E8C989] to-[#B08040]",
  "avatar-mint": "bg-gradient-to-br from-[#7FE6D0] to-[#22B07A]",
  "avatar-slate": "bg-gradient-to-br from-[#7E93A5] to-[#33475A]",
  "avatar-sunset": "bg-gradient-to-br from-[#FF9D6B] to-[#C2427C]",
  "avatar-lagoon": "bg-gradient-to-br from-[#4FD8C6] to-[#1666A8]",
  "avatar-rose": "bg-gradient-to-br from-[#FF9DB0] to-[#D5476C]",
  "avatar-berry": "bg-gradient-to-br from-[#B26BD8] to-[#5F2E92]",
  "avatar-midnight": "bg-gradient-to-br from-[#33475A] to-[#0A1E33]",
  "avatar-ember": "bg-gradient-to-br from-[#FFB13D] to-[#C2371B]",
  "avatar-aurora": "bg-gradient-to-br from-[#4FD8C6] via-[#6E8BF5] to-[#A76BF0]",
  "avatar-royal": "bg-gradient-to-br from-[#5B7CFA] to-[#2B2E8C]",
  "avatar-gold": "bg-gradient-to-br from-[#FFD98A] to-[#C1901F]",
  "avatar-nebula": "bg-gradient-to-br from-[#7B5CD6] via-[#3D2C8D] to-[#12C2D6]",
  "avatar-prism": "bg-gradient-to-br from-[#FF8574] via-[#F5A836] to-[#12C2D6]",
  "avatar-carnival": "bg-gradient-to-br from-[#FFC24B] via-[#FF6F5C] to-[#B26BD8]",
};

const DEFAULT_AVATAR_ID = "avatar-explorer";

/** Classe de gradiente do avatar equipado, com fallback seguro para o padrão. */
export function avatarStyleClass(avatarId: string): string {
  return AVATAR_STYLE_CLASSES[avatarId] ?? AVATAR_STYLE_CLASSES[DEFAULT_AVATAR_ID] ?? "";
}
