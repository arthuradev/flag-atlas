# Changelog

Este arquivo deve ser atualizado pelo Claude Code durante a implementação.

## Unreleased

- Project package created.
- Fase 0: scaffold Vite + React + TypeScript strict com pnpm, Tailwind CSS 4, Biome, Vitest e Playwright configurados; estrutura modular de pastas criada; repositório privado `arthuradev/flag-atlas` criado.
- Fase 2: HashRouter com todas as rotas do MVP e páginas placeholder; i18next com traduções pt-BR/en-US; tema claro/escuro/sistema via CSS Variables + Tailwind; componentes base Button, Card, ProgressBar e PageShell; storage versionado de configurações com validação; fonte Nunito Variable local (offline-first, sem CDN).
- Fase 1: 195 bandeiras MVP + 59 extras importadas para `public/flags/`; dataset adaptado para schema `pt-BR`/`en-US` em `src/shared/data/` (gerado por `scripts/generate-data.mjs`); nomes públicos amigáveis aplicados (Vaticano, República Tcheca, Turkey) com formais preservados como aliases; atribuição Flagpedia preservada em `docs/attribution/`; 21 testes de integridade de dados e segurança de SVG.
