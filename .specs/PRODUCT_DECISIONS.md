# Product Decisions — Flaggo

## Identidade

- Nome: **Flaggo**.
- Tipo: jogo web gamificado / PWA.
- Inspiração de sensação: Duolingo-like, sem copiar identidade, elementos proprietários ou layout exato.
- Fantasia central: explorar e completar o mundo, país por país.
- Tom: amigável, calmo, recompensador e não punitivo.

## Repositório

- Owner: `arthuradev`.
- Repo: `flag-atlas`.
- Visibilidade inicial: privado.
- Licença: Apache-2.0.

## Stack confirmada

- Vite.
- React.
- TypeScript.
- pnpm.
- Tailwind CSS.
- CSS Variables.
- Zustand.
- i18next.
- Motion.
- Howler.js.
- Vitest.
- Playwright.
- PWA.
- localStorage no MVP.
- IndexedDB no futuro.
- Biome para lint/format.
- GitHub Actions para deploy no GitHub Pages.

## Idioma

- Idioma padrão: `pt-BR`.
- Idiomas no MVP: `pt-BR` e `en-US`.
- Textos não devem ficar hardcoded em componentes; usar i18next.

## Navegação

- Usar rotas reais.
- No MVP, usar `HashRouter` por compatibilidade simples com GitHub Pages.
- Exemplo de rotas:

```txt
/
#/onboarding
#/home
#/training
#/session-result
#/continents
#/continents/:continentId
#/collection
#/settings
```

## Onboarding

- O app deve exibir uma tela de boas-vindas na primeira abertura.
- Após o usuário concluir, salvar `hasCompletedOnboarding: true` localmente.
- Próximas aberturas vão direto para Home.

## Home

A Home deve ter:

- marca/nome Flaggo;
- frase curta de valor;
- progresso geral;
- CTA principal: **Continuar treino**;
- atalhos para Continentes, Coleção e Configurações.

Não mostrar vários modos principais na Home.

## Treino

- Uma pergunta por tela.
- Bandeira em destaque.
- 4 alternativas por pergunta.
- Resposta correta sempre presente.
- Alternativas erradas sem repetição.
- Avanço automático após feedback.
- Sessão padrão: 10 perguntas.
- Tamanhos configuráveis: 5, 10, 20, 50.

## Progresso

- XP básico.
- Nível básico.
- Streak dentro da sessão.
- Progresso por país.
- Domínio por país até Mestre.
- Progresso por continente.
- Países para revisão.

## Domínio por país

Estados públicos:

```txt
Novo → Reconhecido → Aprendido → Dominado → Mestre
```

Mestre entra no MVP.

## Erros

- Erro não deve rebaixar imediatamente o país.
- Erro marca o país para revisão.
- Erros repetidos podem reduzir confiança interna ou rebaixar 1 nível no fim da sessão.
- O erro deve ensinar, não punir.

## Coleção

A coleção entra no MVP com:

- lista de países;
- busca;
- filtro por continente;
- filtro por domínio;
- filtro por status;
- ordenação simples.

## Configurações

MVP:

- idioma;
- tema;
- sons ligado/desligado;
- volume;
- reduzir animações;
- tamanho da sessão;
- resetar progresso com confirmação.

## Deploy

- Deploy principal do MVP: GitHub Pages.
- Configurar GitHub Actions desde o MVP.
- Usar `base: "/flag-atlas/"` no Vite para deploy em `arthuradev.github.io/flag-atlas/`.

## Fora do MVP

Não implementar sem autorização:

- login;
- conta;
- backend;
- ranking global;
- loja;
- moedas;
- mascote;
- cultura dos países;
- estados/regiões;
- modo digitação;
- revisão inteligente completa;
- missões diárias;
- streak diário;
- compartilhamento de resultado;
- multiplayer;
- app nativo.
