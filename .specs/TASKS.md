# TASKS — Plano de implementação por fases

O Claude Code deve trabalhar fase por fase. Cada fase termina com validação e commit.

## Convenção de commits

Usar Conventional Commits:

```txt
chore: scaffold project
feat: add onboarding flow
test: add country data validation
ci: configure github pages deployment
```

## Fase 0 — Preparação

Objetivo: criar base do repositório.

Tarefas:

- [x] Criar repositório privado `arthuradev/flag-atlas`.
- [x] Inicializar Vite + React + TypeScript.
- [x] Configurar pnpm.
- [x] Configurar TypeScript strict.
- [x] Configurar Biome.
- [x] Configurar Vitest.
- [x] Configurar Playwright.
- [x] Configurar Tailwind CSS.
- [x] Adicionar LICENSE Apache-2.0.
- [x] Adicionar README inicial.
- [x] Criar estrutura modular de pastas.

Validação:

- [x] `pnpm lint` passa.
- [x] `pnpm typecheck` passa.
- [x] `pnpm test` passa.
- [x] `pnpm build` passa.

Commit sugerido:

```txt
chore: scaffold project
```

## Fase 1 — Dados e assets

Objetivo: importar base oficial.

Tarefas:

- [x] Extrair `_inputs/flag-atlas-data-assets.zip`.
- [x] Copiar `public/flags`.
- [x] Copiar/adaptar dados de países e continentes.
- [x] Normalizar idioma para `pt-BR` e `en-US`.
- [x] Preservar extras separadamente.
- [x] Preservar atribuição em docs.
- [x] Criar testes de integridade de dados.
- [x] Criar teste simples de segurança dos SVGs.

Validação:

- [x] 195 países.
- [x] 195 SVGs MVP.
- [x] 5 continentes.
- [x] Todos os nomes e flags válidos.

Commit sugerido:

```txt
feat: add country data and local flag assets
```

## Fase 2 — App shell, rotas, tema e i18n

Objetivo: base navegável do app.

Tarefas:

- [x] Configurar HashRouter.
- [x] Criar páginas vazias/placeholder.
- [x] Configurar i18next.
- [x] Criar traduções pt-BR/en-US.
- [x] Configurar tema claro/escuro/sistema se viável.
- [x] Criar layout base responsivo.
- [x] Criar componentes base: Button, Card, ProgressBar, PageShell.

Commit sugerido:

```txt
feat: add app shell routing theme and i18n
```

## Fase 3 — Onboarding e Home

Objetivo: entrada do usuário.

Tarefas:

- [x] Criar onboarding curto.
- [x] Persistir conclusão do onboarding.
- [x] Criar Home com progresso geral.
- [x] Criar CTA “Continuar treino”.
- [x] Criar atalhos para Continentes, Coleção, Configurações.

Commit sugerido:

```txt
feat: add onboarding and home experience
```

## Fase 4 — Treino principal

Objetivo: ciclo jogável central.

Tarefas:

- [x] Criar lógica de geração de sessão.
- [x] Criar lógica de alternativas.
- [x] Criar tela de pergunta.
- [x] Implementar feedback de acerto/erro.
- [x] Implementar avanço automático.
- [x] Implementar HUD discreto.
- [x] Implementar resumo final.
- [x] Implementar “Jogar mais uma”.
- [x] Criar testes de lógica.

Commit sugerido:

```txt
feat: add training session flow
```

## Fase 5 — Progresso, XP e domínio

Objetivo: salvar e mostrar evolução real.

Tarefas:

- [x] Criar storage versionado.
- [x] Implementar XP.
- [x] Implementar nível básico.
- [x] Implementar domínio por país.
- [x] Implementar revisão pendente.
- [x] Implementar progresso por continente.
- [x] Implementar reset com confirmação.
- [x] Criar testes de domínio/storage.

Commit sugerido:

```txt
feat: add local progress and mastery system
```

## Fase 6 — Continentes e Coleção

Objetivo: navegação de progresso.

Tarefas:

- [x] Criar tela de continentes.
- [x] Criar tela de continente individual.
- [x] Criar coleção.
- [x] Adicionar busca.
- [x] Adicionar filtros por continente, domínio e status.
- [x] Adicionar ordenação simples.

Commit sugerido:

```txt
feat: add continents and collection views
```

## Fase 7 — Sons, animações e acessibilidade

Objetivo: polimento de experiência.

Tarefas:

- [x] Configurar Howler.js.
- [x] Adicionar sons básicos opcionais.
- [x] Adicionar controle de volume.
- [x] Configurar Motion.
- [x] Adicionar microanimações.
- [x] Respeitar reduzir animações.
- [x] Melhorar focus states.
- [x] Revisar responsividade mobile.

Commit sugerido:

```txt
feat: add audio motion and accessibility polish
```

## Fase 8 — PWA, E2E e deploy

Objetivo: finalizar MVP publicável.

Tarefas:

- [x] Configurar PWA.
- [x] Configurar manifest.
- [x] Configurar service worker/cache.
- [x] Criar teste E2E do fluxo principal.
- [x] Criar smoke test offline.
- [x] Configurar GitHub Actions.
- [x] Configurar GitHub Pages. (workflow pronto; ativação do Pages exige repo público ou plano GitHub Pro — ver DEPLOYMENT)
- [x] Validar build final.

Commit sugerido:

```txt
ci: configure pwa validation and github pages deployment
```

## Fase 9 — Handoff final

Objetivo: entregar estado claro.

Tarefas:

- [x] Atualizar README.
- [x] Documentar comandos.
- [x] Documentar deploy.
- [x] Documentar fonte/atribuição das bandeiras.
- [x] Rodar validação final completa.
- [x] Registrar pendências futuras.

Commit sugerido:

```txt
docs: complete mvp handoff documentation
```

# Versão 2 — Aprendizado real

Objetivo: transformar o quiz em experiência de aprendizado, mantendo a simplicidade.

## V2.1 — Normalização e aliases

- [x] Criar `answerNormalization.ts` (NFD, acentos, pontuação, espaços).
- [x] `getAcceptedAnswers` com nomes pt-BR/en-US + aliases.
- [x] `matchTypedAnswer`/`isTypedAnswerCorrect`.
- [x] Testes de acentos, aliases, vazios, compostos.

## V2.2 — Modelo de sessão

- [x] `QuestionType` (choice/typing) e `SessionMode` (+review, +similar).
- [x] `SessionQuestion` sem alternativas no modo digitação.
- [x] `SessionAnswer` com typedAnswer/normalizedTypedAnswer/acceptedAnswerUsed.
- [x] Compatibilidade preservada com múltipla escolha.

## V2.3 — Modo digitação

- [x] Input grande com foco automático, Enter envia, vazio bloqueado.
- [x] Feedback com resposta certa e o que foi digitado.
- [x] XP/streak/domínio/revisão funcionando.
- [x] Página Desafios (/challenges) com card do modo.

## V2.4 — Revisão inteligente inicial

- [x] `selectReviewCountries` prioriza needsReview + fracos.
- [x] CTA “Revisar erros” na Home e no resumo.
- [x] Fallback amigável sem nada para revisar.
- [x] Testes de priorização, determinismo e não-repetição.

## V2.5 — Bandeiras parecidas

- [x] `similarFlags.ts` com 10 grupos curados.
- [x] Alternativas priorizam o mesmo grupo.
- [x] Card na página Desafios.
- [x] Testes de validade dos grupos e das alternativas.

## V2.6 — Estatísticas

- [x] Confusões registradas no progresso (schema v1 compatível).
- [x] Seletores puros de estatísticas.
- [x] StatsPage (/stats) com resumo e listas.
- [x] Testes de precisão, difíceis e confusões.

## V2.7 — Qualidade e docs

- [x] i18n pt-BR/en-US completo.
- [x] E2E dos novos fluxos.
- [x] Documentação atualizada (README, SESSION_ALGORITHM, DATA_MODEL, V2_ACCEPTANCE_CRITERIA).

# Versão 3 — Retenção e diversão

## V3.1 — Fundação

- [x] `dateKey.ts` (dia local YYYY-MM-DD + diferença em dias).
- [x] Streak diário saudável (`dailyStreak.ts`): 1 descanso, recarga a cada 7 dias, recomeço leve.
- [x] `UserProgress` += `achievementsUnlocked`, `dailyStreak`, `survival` (schema v1, defaults seguros).
- [x] Testes de compatibilidade com progresso V1/V2.

## V3.2 — Conquistas

- [x] Catálogo com 18 conquistas (`achievement.catalog.ts`), incluindo 5 de continente.
- [x] Avaliação pura por progresso e por evento de sessão.
- [x] Desbloqueio persistido com data; página `/achievements` com progresso parcial.
- [x] Desbloqueios exibidos no resumo da sessão, sem popups.

## V3.3 — Missões diárias

- [x] Geração determinística por data local (3 por dia, base + 2 rotativas).
- [x] Persistência em `flag-atlas:daily-missions` com renovação na virada do dia.
- [x] XP bônus concedido uma única vez por missão.
- [x] Bloco "Missões de hoje" na Home e no resumo.

## V3.4 — Sobrevivência

- [x] `mode: "survival"`: 3 vidas, score, fim por vidas, teto de 100 perguntas sem repetição.
- [x] Corações e score na TrainingPage; resumo com recorde.
- [x] Recordes em `progress.survival`.

## V3.5 — Desafios e compartilhamento

- [x] Página Desafios com 6 cards (tipo de pergunta + duração).
- [x] Compartilhar/copiar resultado (Web Share → Clipboard → texto selecionável), i18n, sem backend.

## V3.6 — Qualidade e docs

- [x] i18n pt-BR/en-US completo.
- [x] 60+ novos testes unitários e 6 novos fluxos E2E (desktop + mobile).
- [x] Documentação atualizada (README, DATA_MODEL, SESSION_ALGORITHM, V3_ACCEPTANCE_CRITERIA, CHANGELOG).
