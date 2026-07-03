# ADR 0002 — HashRouter para GitHub Pages

## Status

Accepted

## Contexto

O MVP será publicado no GitHub Pages. Rotas com BrowserRouter podem gerar 404 em hospedagem estática sem fallback adequado.

## Decisão

Usar HashRouter no MVP.

Exemplo:

```txt
https://arthuradev.github.io/flag-atlas/#/collection
```

## Consequências

- Deploy mais simples.
- Menos configuração de fallback.
- URLs menos bonitas.
- Pode migrar para BrowserRouter no futuro se usar Vercel, Netlify ou domínio próprio com fallback.
