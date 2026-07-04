# Critérios de aceite — Versão 4 (Personalização cosmética)

A Versão 4 adiciona Moedas Atlas locais, uma loja cosmética e cosméticos
equipáveis (temas, sons, molduras, mascotes e efeitos) — tudo estético, local e
offline. **Sem dinheiro real, sem microtransação, sem backend, sem login, sem
ranking global e sem vantagem de gameplay.**

## Status: ✅ completa

| #  | Critério | Status | Verificação |
|----|----------|--------|-------------|
| 1  | Treino normal continua funcionando | ✅ | E2E `app.spec.ts` + `v4.spec.ts` |
| 2  | Treino por continente continua funcionando | ✅ | E2E `app.spec.ts` |
| 3  | Modo digitação (V2) continua funcionando | ✅ | E2E `v2.spec.ts` + `v4.spec.ts` |
| 4  | Revisão e bandeiras parecidas (V2) continuam | ✅ | E2E `v2.spec.ts` |
| 5  | Conquistas, missões, streak, sobrevivência e compartilhar (V3) continuam | ✅ | E2E `v3.spec.ts` |
| 6  | Moedas locais existem e são salvas | ✅ | `progress.cosmetics.coins`; `storageSchema.test.ts` |
| 7  | Moedas são ganhas jogando | ✅ | `coinRewards.test.ts` + `progressStore.test.ts` + E2E `result-coins` |
| 8  | Loja cosmética existe em `/shop` | ✅ | Rota + `ShopPage`; E2E `v4.spec.ts` |
| 9  | Loja permite comprar itens com moedas | ✅ | E2E compra Oceano; `cosmetic.selectors.test.ts` |
| 10 | Loja impede compra sem saldo | ✅ | Botão desabilitado; `canPurchaseCosmetic`; E2E |
| 11 | Loja impede compra duplicada | ✅ | `canPurchaseCosmetic` (`alreadyOwned`); teste unitário |
| 12 | Itens comprados podem ser equipados | ✅ | `equipCosmetic`; E2E equipa e aplica |
| 13 | Itens não comprados não podem ser equipados | ✅ | `equipCosmetic` (no-op); teste unitário + store |
| 14 | Temas cosméticos funcionam | ✅ | CSS Variables; E2E verifica `data-theme="oceano"` |
| 15 | Sound packs respeitam mute/volume | ✅ | `soundPlayer` lê pacote equipado; `cosmeticVisuals.test.ts` |
| 16 | Molduras no card da bandeira sem distorcer | ✅ | `flagFrameClass` aplicado ao card, não à `<img>` |
| 17 | Mascote discreto e desativável | ✅ | `Mascot` (none = nada); Home/resumo |
| 18 | Efeitos sutis respeitam reduced motion | ✅ | `resolveVisualEffectKind` desativa; teste unitário |
| 19 | Progresso V1/V2/V3 não é apagado | ✅ | Schema v1; `cosmetics` normalizado; `storageSchema.test.ts` |
| 20 | i18n pt-BR/en-US completo | ✅ | Blocos `shop`/`cosmetics` nos dois locales |
| 21 | Layout desktop e mobile ok | ✅ | E2E em chromium + mobile-chrome |
| 22 | PWA/offline continua funcionando | ✅ | E2E smoke offline; sons dos pacotes no precache |
| 23 | Sem dinheiro real, backend, login ou vantagem | ✅ | Tudo local; moedas cosméticas; sem gameplay |
| 24 | lint, typecheck, test e build passam | ✅ | Validação final |
| 25 | E2E passa | ✅ | 54/54 (desktop + mobile) |

## Decisões de produto registradas

- **Moedas são cosméticas e locais**: sem valor real, sem compra com dinheiro,
  sem alterar dificuldade/XP real/domínio. Concedidas uma única vez por evento;
  saldo nunca negativo; não bloqueiam aprendizado.
- **Tema × Configurações**: `settings.theme` (claro/escuro/sistema) segue
  controlando o modo claro/escuro; o tema cosmético `Padrão` o respeita e os
  temas especiais trazem paleta própria. Sem duplicação de estado nem migração
  destrutiva — a preferência antiga é preservada.
- **Loja calma**: sem "oferta limitada", "compre agora" ou "premium"; linguagem
  "Personalize sua jornada", "Sem dinheiro real", "Apenas cosmético". A Home não
  foi poluída e "Continuar treino" segue como CTA principal.
- **Inventário na própria loja**: comprar e equipar acontecem no mesmo lugar;
  não foi criada página `/customization` separada para manter simples.
- **Reduced motion manda**: mascote não fica flutuando e efeitos visuais somem
  quando "Reduzir animações" está ligado.
- **Continua fora de escopo**: cultura dos países, estados/regiões, backend,
  login, ranking global, multiplayer, app nativo, compras reais, anúncios e
  qualquer item que mude resposta, XP real, domínio ou dificuldade.
