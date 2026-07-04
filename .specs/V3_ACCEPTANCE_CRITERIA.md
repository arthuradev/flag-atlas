# Critérios de aceite — Versão 3 (Retenção e diversão)

A Versão 3 adiciona conquistas, missões diárias, streak diário saudável, página
de desafios completa, modo sobrevivência e compartilhamento de resultado —
tudo local, sem backend, sem login e sem mecânicas punitivas.

## Status: ✅ completa

| # | Critério | Status | Verificação |
|---|----------|--------|-------------|
| 1 | Treino normal continua funcionando | ✅ | E2E `app.spec.ts` (sessão completa, feedback, resumo) |
| 2 | Treino por continente continua funcionando | ✅ | E2E `app.spec.ts` (Oceania) |
| 3 | Modo digitação (V2) continua funcionando | ✅ | E2E `v2.spec.ts` |
| 4 | Revisão inteligente (V2) continua funcionando | ✅ | E2E `v2.spec.ts` |
| 5 | Bandeiras parecidas (V2) continua funcionando | ✅ | E2E `v2.spec.ts` |
| 6 | Home mostra missões diárias sem poluição | ✅ | Bloco compacto abaixo do CTA principal; E2E `v3.spec.ts` |
| 7 | Home mostra streak diário discreto | ✅ | Linha única de texto; some sem histórico; E2E `v3.spec.ts` |
| 8 | Conquistas desbloqueiam corretamente | ✅ | 12 testes em `achievement.selectors.test.ts` + store |
| 9 | Página de conquistas existe | ✅ | `/achievements` com 18 cards, progresso parcial |
| 10 | Missões geradas/persistidas/renovadas | ✅ | Determinísticas por data; testes de store com fake timers |
| 11 | Streak diário não duplica no mesmo dia | ✅ | `dailyStreak.test.ts` + `progressStore.test.ts` |
| 12 | Sobrevivência com vidas, score e fim | ✅ | `sessionStore.test.ts` + E2E jogando até o fim |
| 13 | Resultado normal compartilhável | ✅ | `shareText.test.ts` + E2E com clipboard stub |
| 14 | Resultado de sobrevivência compartilhável | ✅ | Texto próprio com pontuação; E2E |
| 15 | Progresso V1/V2 não é apagado | ✅ | Schema v1 mantido; defaults em `storageSchema.test.ts` |
| 16 | i18n pt-BR/en-US completo | ✅ | Todas as strings novas nos dois locales |
| 17 | Layout desktop e mobile ok | ✅ | E2E roda em chromium + mobile-chrome |
| 18 | PWA/offline continua funcionando | ✅ | E2E smoke offline segue passando |
| 19 | lint, typecheck, test e build passam | ✅ | Validação final da entrega |
| 20 | E2E passa | ✅ | 38/38 (desktop + mobile) |

## Decisões de produto registradas

- **Streak saudável, não punitivo**: mesmo dia nunca conta duas vezes; 1 dia
  pulado é coberto por 1 descanso (recarrega a cada 7 dias ativos); pausas
  maiores recomeçam do 1 com o descanso devolvido e mensagem leve
  ("Sem pressão. O mundo continua aqui quando você voltar."). Sem tela
  vermelha, sem perda de XP, sem vidas que bloqueiem aprendizado.
- **Sobrevivência é modo extra**: não substitui o treino normal; vidas só
  existem dentro dele; perder apenas encerra a rodada e mostra o resumo.
- **Conquistas são locais e silenciosas**: derivadas do progresso local,
  informadas no resumo da sessão; nada de popups nem bloqueio de fluxo.
- **Missões são leves**: 3 por dia, sem moedas e sem loja; a recompensa é um
  XP bônus pequeno pago uma única vez.
- **Compartilhamento é só texto**: Web Share → Clipboard → texto selecionável;
  nenhum dado sensível, nenhum backend, nenhuma imagem gerada.
- **Continua fora de escopo**: loja, moedas, mascote, temas desbloqueáveis,
  cultura dos países, estados/regiões, backend, login, ranking global,
  multiplayer, app nativo, dinheiro real.
