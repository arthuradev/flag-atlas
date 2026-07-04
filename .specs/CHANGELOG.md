# Changelog

Este arquivo deve ser atualizado pelo Claude Code durante a implementação.

## Unreleased

### Versão 3 — Retenção e diversão

- Conquistas locais: catálogo com 18 conquistas (marcos de progresso, domínio, 5 continentes, sessão perfeita, sequência quente, modos da V2 e sobrevivência); desbloqueio persistido com data no progresso (`achievementsUnlocked`), progresso parcial exibido; página `/achievements` e seção no resumo da sessão, sem popups.
- Missões diárias locais: 3 por dia, determinísticas pela data local (base "complete 1 sessão" + 2 rotativas), persistidas em `flag-atlas:daily-missions` e renovadas na virada do dia; XP bônus pequeno concedido uma única vez por missão; bloco "Missões de hoje" na Home e no resumo.
- Streak diário saudável: conta 1 vez por dia ao concluir sessão; 1 descanso (🧊) cobre um dia pulado e recarrega a cada 7 dias ativos; perda recomeça leve com mensagem sem culpa; exibido discretamente na Home e no resumo. Independente da streak de acertos na sessão.
- Modo sobrevivência: 3 vidas, erro tira vida, acerto pontua; fila de até 100 perguntas sem repetição; corações + score na tela de treino; resumo com "Fim da sobrevivência!", recorde anterior e novo recorde; recordes em `progress.survival`.
- Página Desafios reorganizada com 6 cards (digitação, parecidas, revisar erros, sobrevivência, rápido, perfeito) com tipo de pergunta e duração; recorde de sobrevivência no card.
- Compartilhar resultado: texto i18n do resumo (normal e sobrevivência) via Web Share API → Clipboard → fallback selecionável; apenas texto local, sem backend nem dados sensíveis.
- Storage: schema de progresso permanece v1 com campos novos normalizados por defaults (progresso V1/V2 preservado); 72 novos testes unitários (192 no total) e 6 novos fluxos E2E (38 no total, desktop + mobile); i18n pt-BR/en-US completo.

### Versão 2 — Aprendizado real

- Modo digitação: bandeira + input com foco automático, Enter envia, resposta vazia bloqueada; aceita nomes pt-BR/en-US e aliases com normalização robusta (acentos, pontuação, espaços); erros marcam revisão; XP/streak/domínio preservados.
- Revisão inteligente inicial: `mode: "review"` prioriza países com `needsReview` e completa com países fracos, sem repetir; CTA “Revisar erros” na Home e no resumo; fallback amigável quando não há nada a revisar.
- Bandeiras parecidas: 10 grupos curados em `similarFlags.ts`; alternativas erradas priorizam o mesmo grupo, completando com continente/global; acessível pela nova página Desafios (`/challenges`).
- Estatísticas locais (`/stats`): países vistos/aprendidos/dominados, precisão geral, sessões, mais difíceis, para revisar, baixo domínio e confusões comuns (registradas ao errar alternativa); schema de progresso permanece v1, campo `confusions` opcional e normalizado — progresso antigo preservado.
- 33 novos testes unitários e 5 novos fluxos E2E (desktop + mobile); i18n pt-BR/en-US completo; docs atualizadas (SESSION_ALGORITHM, DATA_MODEL, V2_ACCEPTANCE_CRITERIA).

### MVP

- Tela de treino redesenhada para desktop: container `max-w-5xl` (PageShell ganhou variante `wide`), bandeira maior (até ~720px de largura em telas grandes, `object-contain`), alternativas em grade 2×2 com botões de 80px/`text-xl` no desktop (64px/1 coluna no mobile); stack de fontes agora inclui `"Nunito"` como fallback nomeado (a fonte já era Nunito via `@fontsource-variable/nunito`, local e offline).
- Project package created.
- Fase 0: scaffold Vite + React + TypeScript strict com pnpm, Tailwind CSS 4, Biome, Vitest e Playwright configurados; estrutura modular de pastas criada; repositório privado `arthuradev/flag-atlas` criado.
- Fase 9: README completo com status, comandos, scripts auxiliares, deploy e pendências futuras; deploy do Pages protegido pela variável de repositório `ENABLE_PAGES` até o Pages poder ser ativado; validação final completa (lint, typecheck, 74 testes unitários, build, 16 E2E).
- Fase 8: PWA com vite-plugin-pwa (manifest, ícones PNG gerados por `scripts/generate-icons.mjs`, service worker com precache do shell + 195 bandeiras MVP + sons + fontes, ~3,5 MB); 8 testes E2E Playwright (fluxo principal, continente, coleção, configurações, reset e smoke offline) rodando em desktop e mobile; workflow GitHub Actions com lint/typecheck/test/build e deploy para Pages. Observação: ativar o Pages exige repo público ou plano GitHub Pro — bloqueado no plano atual com repo privado.
- Fase 7: sons de click/acerto/erro/sessão gerados localmente (WAV sintetizados por `scripts/generate-sounds.mjs`, sem assets de terceiros) tocados via Howler com toggle e volume efetivos; microanimações com Motion (transição de pergunta, feedback, resultado, onboarding) respeitando reduzir animações e `prefers-reduced-motion` via MotionConfig.
- Fase 6: tela de continentes com progresso por continente; tela de continente com CTA “Treinar este continente” e lista de países com domínio; coleção com busca sem acentos, filtros por continente/domínio/status e ordenação por nome/domínio; 8 novos testes da lógica de filtro.
- Fase 5: progresso persistido em localStorage versionado com validação e fallback seguro (nível público sempre recalculado dos pontos); página de Configurações completa (idioma, tema, sons, volume, reduzir animações, tamanho da sessão); reset de progresso com confirmação; seletores de progresso por continente; 17 novos testes de storage/domínio.
- Fase 4: ciclo de treino completo — seleção de sessão por prioridade (revisão/novos/em progresso), 4 alternativas com erro do mesmo continente, feedback de acerto/erro com XP e evolução de domínio, avanço automático (1,2s/2s) com botão Continuar, HUD discreto, resumo final e “Jogar mais uma”; lógica pura de XP e domínio com 28 novos testes.
- Fase 3: onboarding de 3 passos com persistência local e redirecionamento na raiz; Home com progresso geral (países aprendidos, nível, XP), CTA “Continuar treino” e atalhos para Continentes, Coleção e Configurações; tipos e seletores de progresso criados.
- Fase 2: HashRouter com todas as rotas do MVP e páginas placeholder; i18next com traduções pt-BR/en-US; tema claro/escuro/sistema via CSS Variables + Tailwind; componentes base Button, Card, ProgressBar e PageShell; storage versionado de configurações com validação; fonte Nunito Variable local (offline-first, sem CDN).
- Fase 1: 195 bandeiras MVP + 59 extras importadas para `public/flags/`; dataset adaptado para schema `pt-BR`/`en-US` em `src/shared/data/` (gerado por `scripts/generate-data.mjs`); nomes públicos amigáveis aplicados (Vaticano, República Tcheca, Turkey) com formais preservados como aliases; atribuição Flagpedia preservada em `docs/attribution/`; 21 testes de integridade de dados e segurança de SVG.
