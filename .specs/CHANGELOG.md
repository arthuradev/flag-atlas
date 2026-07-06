# Changelog

Este arquivo deve ser atualizado pelo Claude Code durante a implementação.

## Unreleased

### Identidade visual — Globi

- Globi definido como mascote oficial do Flag Atlas, com fontes da marca preservadas em `public/brand/`.
- Favicon, manifest PWA, ícones de instalação e app icon passam a usar os novos assets oficiais.
- Interface principal atualizada para usar Globi/app icon no onboarding, Home, header mobile e sidebar sem adicionar splash animada complexa.
- `scripts/generate-icons.mjs` agora deriva PNGs PWA, ícones Android e splash estático a partir dos SVGs oficiais da marca.
- Sidebar refinada para mostrar o Globi inteiro em tile claro; tema escuro ajustado para o Azul Atlas e tons oficiais da marca.

### Versão 4.5 — Mastery 2.0 e insígnias

- Domínio por país migrado de escala `0–10` para `0–100`; `masteryLevelForPoints` não concede Mestre por pontos sozinho, e `deriveMasteryLevel` exige pontos altos + evidência real.
- Mestre/Platina agora exige `masteryPoints >= 85`, `correctCount >= 20`, precisão >= 80%, acertos em 3 dias diferentes, 2 acertos por digitação, 2 revisões bem-sucedidas, sem `needsReview` e sem erro recente.
- `CountryProgress` ganhou `masterySystemVersion`, `correctDateKeys`, contadores por tipo/modo, `successfulReviews`, `nextReviewAt`, `lastPromotionAt`, `lastMasteryMode` e `lastMasteryQuestionType`, todos normalizados com defaults seguros.
- Migração conservadora de progresso legado: `10/10` vira `80/100` e `Dominado`, não `Mestre`; `8/10` vira `65`, `5/10` vira `40`, `2/10` vira `15`. `PROGRESS_SCHEMA_VERSION` permanece 1.
- Pontuação de domínio agora diferencia evidência: múltipla escolha +2, digitação +4, revisão +5, parecidas +4, sobrevivência +2 e revisão vencida correta +3.
- Revisão espaçada simples via `nextReviewAt`: erro agenda hoje; acerto agenda 1/3/7/14 dias conforme nível. Home, coleção, stats e seleção de revisão consideram `needsReview` ou revisão vencida. CTA público atualizado para “Revisar hoje”.
- Novo componente `MasteryBadge` para insígnias sem insígnia/Bronze/Prata/Ouro/Platina; usado na Coleção, feedback de treino, resumo da sessão e Estatísticas.
- Estatísticas mostram Bronze, Prata, Ouro, Platina, revisões do dia e lista “Quase Platina” com motivo simples.
- Conquistas ajustadas: `worldMaster` exige todos os países em Mestre/Platina real; `firstMastery` e `collector` continuam em Ouro/Dominado; adicionadas `firstPlatinum` e `platinumCollector`.
- i18n pt-BR/en-US e documentação atualizados. Versão 5 de cultura dos países permanece não implementada.

### Versão 4 — Personalização cosmética

- Modelo de cosméticos (`src/entities/cosmetic/`): tipos `theme`, `soundPack`, `flagFrame`, `mascot`, `visualEffect`; catálogo de 28 itens com id/preço/raridade/preview; funções puras `getCosmeticById`, `getOwnedCosmetics`, `canPurchaseCosmetic`, `purchaseCosmetic`, `equipCosmetic`, `getEquippedCosmetics`, `normalizeCosmeticInventory` (itens gratuitos sempre possuídos, equipar não custa moedas, compra bloqueada sem saldo/duplicada, equipado inválido volta ao padrão).
- Moedas Atlas (locais, cosméticas, sem valor real): +10 por sessão, +5 de bônus por sessão perfeita, +15 por missão diária, +25 por conquista, sobrevivência pelo score com teto de 30; concedidas nas transições de conclusão/desbloqueio (nunca duas vezes); saldo nunca fica negativo. Saldo discreto na Home e no resumo da sessão.
- Loja `/shop`: categorias Temas, Sons, Molduras, Mascotes e Efeitos; saldo, preço, estados comprar/equipar/equipado, preview e feedback com `aria-live`; linguagem calma ("Personalize sua jornada", "Sem dinheiro real", "Apenas cosmético"). Entrada discreta na Home, no resumo e nas Configurações; "Continuar treino" segue como CTA principal.
- Temas cosméticos via CSS Variables: `default` segue claro/escuro/sistema das Configurações; 6 temas especiais (Mapa Antigo, Neon Atlas, Oceano, Espaço, Biblioteca, Minimalista) com paleta própria, offline e sem imagens externas.
- Sound packs (Howler, assets WAV locais sintetizados por `scripts/generate-sounds.mjs`): Padrão, Silencioso (grátis), Suave, Arcade, Digital; respeitam mute/volume; pacote inválido volta ao padrão; pacote silencioso não toca nada.
- Molduras aplicadas ao card da bandeira no treino (todos os modos) sem distorcer a bandeira; mascote discreto (Globo, Bússola, Corujinha, Foguetinho ou nenhum) na Home/resumo; efeitos visuais sutis (brilho, confete, pulso neon, estrelas) em momentos de feedback, sempre desativados sob reduced motion.
- Storage: `PROGRESS_SCHEMA_VERSION` permanece 1; novo campo `cosmetics` normalizado com defaults seguros (progresso V1/V2/V3 preservado; moedas inválidas → 0; itens desconhecidos descartados; equipado inválido → padrão; `settings.theme` claro/escuro preservado). i18n pt-BR/en-US completo.
- 70 novos testes unitários (262 no total) e 8 novos fluxos E2E (54 no total, desktop + mobile).

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
