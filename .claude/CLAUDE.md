# CLAUDE.md — Flag Atlas Implementation Rules

Você está implementando o projeto **Flag Atlas**.

## Antes de codar

Leia:

1. `AGENTS.md`
2. `.specs/PRODUCT_DECISIONS.md`
3. `.specs/SDD.md`
4. `.specs/GSD.md`
5. `.specs/ARCHITECTURE.md`
6. `.specs/TASKS.md`

## Missão

Criar uma PWA React/Vite/TypeScript, do zero, para ensinar bandeiras dos 195 países do mundo.

## Restrições absolutas

- Não implementar backend no MVP.
- Não implementar login no MVP.
- Não implementar ranking global no MVP.
- Não implementar modo digitação no MVP.
- Não implementar loja/moedas no MVP.
- Não implementar cultura dos países no MVP.
- Não implementar estados/regiões no MVP.
- Não transformar o projeto em algo complexo demais.

## Commits

Use Conventional Commits.

Faça commits pequenos e reversíveis.

## Validação

Antes de cada commit relevante:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Quando houver fluxo de usuário:

```bash
pnpm e2e
```

## UX

O app deve parecer gostoso de usar. Não entregue só telas funcionais e sem polimento.

A bandeira deve ser protagonista.

## Dados

Use `_inputs/flag-atlas-data-assets.zip` como base oficial de dados/assets.

Não trate esse ZIP como estrutura do app.
