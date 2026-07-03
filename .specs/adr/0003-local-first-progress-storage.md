# ADR 0003 — Progresso local no MVP

## Status

Accepted

## Contexto

O MVP não terá login nem backend. O objetivo é reduzir atrito e validar o ciclo de jogo.

## Decisão

Usar localStorage no MVP, com wrapper, validação e versionamento de schema.

IndexedDB fica para o futuro se o progresso ou recursos locais crescerem.

## Consequências

- Implementação simples.
- App funciona offline.
- Progresso fica no navegador/dispositivo.
- Sem sincronização entre dispositivos no MVP.
- Progresso local não deve ser usado para competição real.
