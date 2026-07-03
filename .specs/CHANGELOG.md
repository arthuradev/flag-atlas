# Changelog

Este arquivo deve ser atualizado pelo Claude Code durante a implementação.

## Unreleased

- Project package created.
- Fase 0: scaffold Vite + React + TypeScript strict com pnpm, Tailwind CSS 4, Biome, Vitest e Playwright configurados; estrutura modular de pastas criada; repositório privado `arthuradev/flag-atlas` criado.
- Fase 8: PWA com vite-plugin-pwa (manifest, ícones PNG gerados por `scripts/generate-icons.mjs`, service worker com precache do shell + 195 bandeiras MVP + sons + fontes, ~3,5 MB); 8 testes E2E Playwright (fluxo principal, continente, coleção, configurações, reset e smoke offline) rodando em desktop e mobile; workflow GitHub Actions com lint/typecheck/test/build e deploy para Pages. Observação: ativar o Pages exige repo público ou plano GitHub Pro — bloqueado no plano atual com repo privado.
- Fase 7: sons de click/acerto/erro/sessão gerados localmente (WAV sintetizados por `scripts/generate-sounds.mjs`, sem assets de terceiros) tocados via Howler com toggle e volume efetivos; microanimações com Motion (transição de pergunta, feedback, resultado, onboarding) respeitando reduzir animações e `prefers-reduced-motion` via MotionConfig.
- Fase 6: tela de continentes com progresso por continente; tela de continente com CTA “Treinar este continente” e lista de países com domínio; coleção com busca sem acentos, filtros por continente/domínio/status e ordenação por nome/domínio; 8 novos testes da lógica de filtro.
- Fase 5: progresso persistido em localStorage versionado com validação e fallback seguro (nível público sempre recalculado dos pontos); página de Configurações completa (idioma, tema, sons, volume, reduzir animações, tamanho da sessão); reset de progresso com confirmação; seletores de progresso por continente; 17 novos testes de storage/domínio.
- Fase 4: ciclo de treino completo — seleção de sessão por prioridade (revisão/novos/em progresso), 4 alternativas com erro do mesmo continente, feedback de acerto/erro com XP e evolução de domínio, avanço automático (1,2s/2s) com botão Continuar, HUD discreto, resumo final e “Jogar mais uma”; lógica pura de XP e domínio com 28 novos testes.
- Fase 3: onboarding de 3 passos com persistência local e redirecionamento na raiz; Home com progresso geral (países aprendidos, nível, XP), CTA “Continuar treino” e atalhos para Continentes, Coleção e Configurações; tipos e seletores de progresso criados.
- Fase 2: HashRouter com todas as rotas do MVP e páginas placeholder; i18next com traduções pt-BR/en-US; tema claro/escuro/sistema via CSS Variables + Tailwind; componentes base Button, Card, ProgressBar e PageShell; storage versionado de configurações com validação; fonte Nunito Variable local (offline-first, sem CDN).
- Fase 1: 195 bandeiras MVP + 59 extras importadas para `public/flags/`; dataset adaptado para schema `pt-BR`/`en-US` em `src/shared/data/` (gerado por `scripts/generate-data.mjs`); nomes públicos amigáveis aplicados (Vaticano, República Tcheca, Turkey) com formais preservados como aliases; atribuição Flagpedia preservada em `docs/attribution/`; 21 testes de integridade de dados e segurança de SVG.
