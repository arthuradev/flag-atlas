# Deployment — Flag Atlas

## 1. Deploy principal

Usar GitHub Pages no MVP.

URL esperada:

```txt
https://arthuradev.github.io/flag-atlas/
```

## 2. Vite base

Configurar `vite.config.ts` com base adequada:

```ts
export default defineConfig({
  base: "/flag-atlas/",
});
```

Integrar com demais plugins conforme necessário.

## 3. Router

Usar HashRouter no MVP para evitar problemas de 404 em hospedagem estática.

## 4. GitHub Actions

Criar workflow para:

- checkout;
- setup pnpm;
- setup Node LTS;
- install;
- lint;
- typecheck;
- test;
- build;
- deploy para Pages.

## 5. Proteção de qualidade

Não publicar se lint/typecheck/test/build falhar.

## 6. Repositório privado

O repositório começa privado.

A publicação no GitHub Pages pode tornar o site acessível publicamente. Tratar isso como decisão consciente do usuário.

## 7. Alternativas futuras

Vercel ou Netlify podem ser usados no futuro se o projeto precisar de previews, domínio próprio ou melhor experiência de deploy.
