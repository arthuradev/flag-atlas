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

- [ ] Configurar HashRouter.
- [ ] Criar páginas vazias/placeholder.
- [ ] Configurar i18next.
- [ ] Criar traduções pt-BR/en-US.
- [ ] Configurar tema claro/escuro/sistema se viável.
- [ ] Criar layout base responsivo.
- [ ] Criar componentes base: Button, Card, ProgressBar, PageShell.

Commit sugerido:

```txt
feat: add app shell routing theme and i18n
```

## Fase 3 — Onboarding e Home

Objetivo: entrada do usuário.

Tarefas:

- [ ] Criar onboarding curto.
- [ ] Persistir conclusão do onboarding.
- [ ] Criar Home com progresso geral.
- [ ] Criar CTA “Continuar treino”.
- [ ] Criar atalhos para Continentes, Coleção, Configurações.

Commit sugerido:

```txt
feat: add onboarding and home experience
```

## Fase 4 — Treino principal

Objetivo: ciclo jogável central.

Tarefas:

- [ ] Criar lógica de geração de sessão.
- [ ] Criar lógica de alternativas.
- [ ] Criar tela de pergunta.
- [ ] Implementar feedback de acerto/erro.
- [ ] Implementar avanço automático.
- [ ] Implementar HUD discreto.
- [ ] Implementar resumo final.
- [ ] Implementar “Jogar mais uma”.
- [ ] Criar testes de lógica.

Commit sugerido:

```txt
feat: add training session flow
```

## Fase 5 — Progresso, XP e domínio

Objetivo: salvar e mostrar evolução real.

Tarefas:

- [ ] Criar storage versionado.
- [ ] Implementar XP.
- [ ] Implementar nível básico.
- [ ] Implementar domínio por país.
- [ ] Implementar revisão pendente.
- [ ] Implementar progresso por continente.
- [ ] Implementar reset com confirmação.
- [ ] Criar testes de domínio/storage.

Commit sugerido:

```txt
feat: add local progress and mastery system
```

## Fase 6 — Continentes e Coleção

Objetivo: navegação de progresso.

Tarefas:

- [ ] Criar tela de continentes.
- [ ] Criar tela de continente individual.
- [ ] Criar coleção.
- [ ] Adicionar busca.
- [ ] Adicionar filtros por continente, domínio e status.
- [ ] Adicionar ordenação simples.

Commit sugerido:

```txt
feat: add continents and collection views
```

## Fase 7 — Sons, animações e acessibilidade

Objetivo: polimento de experiência.

Tarefas:

- [ ] Configurar Howler.js.
- [ ] Adicionar sons básicos opcionais.
- [ ] Adicionar controle de volume.
- [ ] Configurar Motion.
- [ ] Adicionar microanimações.
- [ ] Respeitar reduzir animações.
- [ ] Melhorar focus states.
- [ ] Revisar responsividade mobile.

Commit sugerido:

```txt
feat: add audio motion and accessibility polish
```

## Fase 8 — PWA, E2E e deploy

Objetivo: finalizar MVP publicável.

Tarefas:

- [ ] Configurar PWA.
- [ ] Configurar manifest.
- [ ] Configurar service worker/cache.
- [ ] Criar teste E2E do fluxo principal.
- [ ] Criar smoke test offline.
- [ ] Configurar GitHub Actions.
- [ ] Configurar GitHub Pages.
- [ ] Validar build final.

Commit sugerido:

```txt
ci: configure pwa validation and github pages deployment
```

## Fase 9 — Handoff final

Objetivo: entregar estado claro.

Tarefas:

- [ ] Atualizar README.
- [ ] Documentar comandos.
- [ ] Documentar deploy.
- [ ] Documentar fonte/atribuição das bandeiras.
- [ ] Rodar validação final completa.
- [ ] Registrar pendências futuras.

Commit sugerido:

```txt
docs: complete mvp handoff documentation
```
