# AGENTS.md — Flag Atlas

Este arquivo define como agentes de código devem trabalhar neste repositório.

## Papel do agente

Você deve implementar o projeto **Flag Atlas** com base na documentação em `.specs/`.

Você não deve reinterpretar o produto do zero. As decisões confirmadas já estão documentadas.

## Regras obrigatórias

1. Trabalhe por fases, seguindo `.specs/TASKS.md`.
2. Use commits pequenos e descritivos com Conventional Commits.
3. Não implemente features fora do MVP sem autorização explícita.
4. Não remova ou simplifique testes para fazer o build passar.
5. Não use backend no MVP.
6. Não adicione login no MVP.
7. Não adicione dependências pesadas sem justificar em ADR ou changelog.
8. Mantenha código em inglês.
9. Mantenha documentação principal em português.
10. Preserve acessibilidade, responsividade e offline-first como requisitos centrais.

## Qualidade mínima antes de commit

Rode, no mínimo:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Quando a fase envolver fluxo de usuário, rode também:

```bash
pnpm e2e
```

## Arquitetura

A lógica de domínio não deve ficar misturada em componentes React.

Separe:

- lógica de sessão;
- lógica de alternativas;
- lógica de XP;
- lógica de domínio;
- persistência local;
- componentes visuais.

## Segurança

- Não use `eval`.
- Não injete conteúdo com `innerHTML` sem sanitização e justificativa.
- Valide dados carregados do `localStorage`.
- Trate SVGs locais como assets, não como HTML injetado.
- Não carregue scripts externos desnecessários.

## UX

O app deve ser amigável, leve e recompensador.

Erro deve ensinar, não punir.
