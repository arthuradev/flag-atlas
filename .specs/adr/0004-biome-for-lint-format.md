# ADR 0004 — Biome para lint e format

## Status

Accepted

## Contexto

O projeto é novo e precisa de uma configuração simples para manter qualidade de código.

## Decisão

Usar Biome para lint e format em vez de ESLint + Prettier.

## Consequências

- Menos arquivos de configuração.
- Menos conflito entre formatter e linter.
- Boa experiência para projeto novo em TypeScript/React.
- Se o projeto precisar de regras muito específicas no futuro, pode avaliar ESLint.
