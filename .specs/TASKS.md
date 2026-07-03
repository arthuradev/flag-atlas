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
