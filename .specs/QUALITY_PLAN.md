# Quality Plan — Flaggo

## 1. Ferramentas

- Biome: lint e format.
- TypeScript strict: typecheck.
- Vitest: testes unitários e de lógica.
- Playwright: testes E2E.
- GitHub Actions: validação contínua e deploy.

## 2. Scripts esperados

O `package.json` deve expor scripts equivalentes a:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "biome check .",
    "format": "biome format --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  }
}
```

Ajustes são permitidos, mas os comandos devem existir.

## 3. Testes de dados

Obrigatórios:

- exatamente 195 países;
- exatamente 5 continentes;
- ids únicos;
- iso2 válido;
- nomes em pt-BR e en-US;
- continente válido;
- flagPath existente;
- contagens por continente corretas;
- SVGs do MVP presentes;
- nenhum padrão perigoso nos SVGs.

## 4. Testes de lógica

Obrigatórios:

- geração de sessão;
- seleção por continente;
- resposta correta aparece;
- alternativas não repetem;
- cálculo de XP;
- evolução de domínio;
- erro marca revisão;
- erro único não rebaixa imediatamente;
- progresso por continente;
- reset de progresso;
- validação de storage.

## 5. Testes de UI/E2E

MVP:

1. abrir app;
2. concluir onboarding;
3. ver Home;
4. iniciar treino;
5. responder sessão curta;
6. ver resumo final;
7. clicar “Jogar mais uma”;
8. abrir Coleção;
9. usar busca/filtro;
10. abrir Configurações;
11. alterar idioma/tema/tamanho da sessão;
12. smoke test offline após primeiro carregamento.

## 6. PWA/offline

Validar que:

- app carrega após primeiro carregamento mesmo offline;
- shell principal funciona offline;
- bandeiras do MVP usadas no treino carregam offline;
- manifest existe;
- service worker registra corretamente em build.

## 7. CI obrigatório

No push/PR para main:

- instalar pnpm;
- instalar dependências;
- rodar lint;
- rodar typecheck;
- rodar testes unitários;
- rodar build;
- publicar em GitHub Pages somente se tudo passar.

## 8. Critério de qualidade visual

Não basta funcionar. O MVP deve parecer minimamente polido:

- espaçamento consistente;
- responsividade mobile/desktop;
- estados de botão;
- feedback de acerto/erro;
- tema claro/escuro;
- animações sutis;
- sem layout quebrado.
