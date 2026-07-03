# ADR 0005 — Bandeiras SVG locais derivadas do pacote fornecido

## Status

Accepted

## Contexto

Flag Atlas precisa funcionar offline desde o começo. Bandeiras remotas criariam dependência de rede e piorariam confiabilidade.

O usuário forneceu um pacote validado contendo 195 bandeiras SVG do MVP, 59 extras e dados de países/continentes.

## Decisão

Usar o pacote `_inputs/flag-atlas-data-assets.zip` como fonte oficial inicial de dados e assets.

As bandeiras do MVP devem ficar em `public/flags/mvp/` e ser carregadas localmente.

## Consequências

- Offline-first fica viável.
- Build inclui assets locais.
- É necessário preservar atribuição/documentação de fonte.
- É necessário validar integridade dos assets.
