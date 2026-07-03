# /implement

Use este comando para implementar a fase planejada.

## Regras

- Trabalhe em mudanças pequenas.
- Mantenha lógica de domínio fora da UI.
- Não pule testes essenciais.
- Não implemente features futuras.
- Atualize documentação quando a implementação mudar alguma decisão.

## Finalização

Ao terminar:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Se aplicável:

```bash
pnpm e2e
```

Depois faça commit com Conventional Commits.
