# Cosméticos — Flag Atlas (Versão 4)

A Versão 4 adiciona **personalização cosmética**. Tudo aqui é estético, local e
offline. Não existe dinheiro real, microtransação, backend, login, ranking
global nem qualquer vantagem de gameplay. Cosmético **nunca** altera
dificuldade, aprendizado, XP real, domínio ou resposta.

## Filosofia

- Recompensar quem joga, sem transformar o app em cassino.
- Personalização visual e sonora que respeita a identidade do app.
- Não poluir a Home: "Continuar treino" continua sendo o CTA principal.
- Não bloquear aprendizado: quem não tem moedas aprende igual.

## Moedas Atlas

Moeda local e cosmética (`progress.cosmetics.coins`). Ganha jogando; sem valor
real; não pode ser comprada com dinheiro.

| Evento                        | Recompensa                         |
| ----------------------------- | ---------------------------------- |
| Sessão comum concluída        | +10                                |
| Sessão perfeita (100%)        | +5 de bônus                        |
| Missão diária concluída       | +15                                |
| Conquista desbloqueada        | +25                                |
| Sobrevivência                 | pelo score, com teto de 30         |

Regras: cada recompensa é concedida **uma única vez**, na transição de
conclusão/desbloqueio (as mesmas transições já usadas para XP/conquistas da V3);
o saldo **nunca fica negativo**. Constantes em
`src/features/cosmetics/logic/coinRewards.ts`.

## Tipos de cosmético

Ids são prefixados pelo tipo. Itens com `price 0` são gratuitos e sempre
possuídos; o item `isDefault` de cada tipo é o padrão equipado (nunca vendável).

### Temas (`theme`) — CSS Variables

`theme-default` segue o claro/escuro/sistema das Configurações
(`settings.theme`). Os demais definem paleta própria via `[data-theme="…"]` em
`src/index.css` e ignoram claro/escuro.

`default` · `mapa-antigo` · `neon` · `oceano` · `espaco` · `biblioteca` ·
`minimalista`.

### Sons (`soundPack`) — Howler

Assets WAV locais em `public/sounds/<pacote>/` (gerados por
`scripts/generate-sounds.mjs`, sem CDN). `sound-default` (raiz) e `sound-silent`
(não toca nada) são grátis. Respeitam mute/volume das Configurações. Pacote
inválido volta ao padrão. Resolução em
`src/features/cosmetics/logic/soundPacks.ts`.

`default` · `silent` · `suave` · `arcade` · `digital`.

### Molduras (`flagFrame`)

Classe Tailwind aplicada só ao **card** que envolve a bandeira no treino (todos
os modos), nunca à `<img>` — não distorce nem esconde a bandeira. Registro em
`src/features/cosmetics/logic/flagFrames.ts`.

`default` · `atlas` · `madeira` · `neon` · `oceano` · `biblioteca`.

### Mascotes (`mascot`)

Emoji discreto na Home e no resumo da sessão, nunca sobre a bandeira. `none` é o
padrão. Animação sutil de flutuação desativada sob reduced motion. Registro em
`src/features/cosmetics/logic/mascots.ts`.

`none` · `globe` · `compass` · `owl` · `rocket`.

### Efeitos visuais (`visualEffect`)

Camada leve e `pointer-events-none` em momentos de feedback (acerto, fim de
sessão, compra). **Sempre** desativada sob reduced motion. Efeito inválido vira
`none`. Registro em `src/features/cosmetics/logic/visualEffects.ts`.

`none` · `glow` · `confetti` · `neonPulse` · `stars`.

## Loja e equipamento

Rota `/shop` (`ShopPage`). Mostra saldo, categorias, preço e estado
(Comprar / Equipar / Equipado), com preview e feedback `aria-live`. Comprar
desconta moedas; equipar aplica imediatamente e nunca custa moedas. Entradas
discretas na Home, no resumo da sessão e nas Configurações.

## Domínio e storage

- Domínio puro: `src/entities/cosmetic/` (`cosmetic.types`, `cosmetic.catalog`,
  `cosmetic.selectors`). Funções: `getCosmeticById`, `getOwnedCosmetics`,
  `canPurchaseCosmetic`, `purchaseCosmetic`, `equipCosmetic`,
  `getEquippedCosmetics`, `normalizeCosmeticInventory`.
- Persistência: campo `cosmetics` em `UserProgress`.
  `PROGRESS_SCHEMA_VERSION` permanece **1**. Progresso V1/V2/V3 sem `cosmetics`
  carrega com defaults; dados inválidos são normalizados com fallback seguro.
  Ver `.specs/DATA_MODEL.md`.
