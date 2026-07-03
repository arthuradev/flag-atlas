# Flag Atlas

**Flag Atlas** é uma PWA gamificada para aprender as bandeiras dos 195 países do mundo.

A experiência central é simples:

```txt
abrir → continuar treino → responder bandeiras → receber feedback → ver progresso → jogar de novo
```

O projeto deve ser:

- simples;
- bonito;
- acessível;
- responsivo;
- offline;
- gamificado;
- não punitivo;
- preparado para crescer.

## MVP

O MVP implementa:

- PWA para desktop e mobile;
- funcionamento offline desde o começo;
- 195 países;
- bandeiras SVG locais;
- pt-BR e en-US;
- onboarding inicial;
- Home com CTA principal “Continuar treino”;
- múltipla escolha com 4 alternativas;
- sessões configuráveis: 5, 10, 20 ou 50 perguntas;
- sessão padrão de 10 perguntas;
- treino por continente;
- coleção com busca e filtros;
- XP básico;
- nível básico;
- streak de sessão;
- domínio por país até Mestre;
- progresso por continente;
- feedback visual e sonoro opcional;
- animações sutis e opção de reduzir animações;
- tema claro, escuro e preferência do sistema se viável;
- progresso salvo localmente;
- reset de progresso com confirmação;
- testes de dados, lógica, fluxo principal e PWA/offline básico;
- GitHub Actions para GitHub Pages.

## Stack

- Vite
- React
- TypeScript
- pnpm
- Tailwind CSS
- CSS Variables
- Zustand
- i18next
- Motion
- Howler.js
- Vitest
- Playwright
- Biome

## Status

O MVP está implementado, testado e validado (Fases 0–9 de `.specs/TASKS.md`).

## Como rodar

Pré-requisitos: Node.js 22+ e pnpm 11+.

```bash
pnpm install
pnpm dev        # servidor de desenvolvimento em http://localhost:5173/flag-atlas/
```

## Comandos

```bash
pnpm dev         # desenvolvimento
pnpm build       # typecheck + build de produção (dist/)
pnpm preview     # serve o build de produção
pnpm lint        # Biome (lint + format check)
pnpm format      # Biome format --write
pnpm typecheck   # TypeScript
pnpm test        # testes unitários e de dados (Vitest)
pnpm test:watch  # Vitest em modo watch
pnpm e2e         # testes E2E (Playwright, desktop + mobile, inclui smoke offline)
```

Para os E2E na primeira vez: `pnpm exec playwright install chromium`.

## Scripts auxiliares

```bash
node scripts/generate-data.mjs <dir-do-zip-extraido>  # regenera src/shared/data a partir do pacote oficial
node scripts/generate-sounds.mjs                       # regenera os sons WAV de public/sounds
node scripts/generate-icons.mjs                        # regenera os ícones PNG da PWA
```

## Deploy

O deploy é feito pelo GitHub Actions (`.github/workflows/deploy.yml`): a cada push na `main`, roda lint, typecheck, testes e build; se tudo passar, publica no GitHub Pages em `https://arthuradev.github.io/flag-atlas/`.

**Pendência:** o GitHub Pages não pode ser ativado em repositório privado no plano gratuito. Para publicar:

1. Torne o repositório público (o site do Pages já seria público de qualquer forma) **ou** faça upgrade para GitHub Pro.
2. Em *Settings → Pages*, selecione source **GitHub Actions**.
3. Defina a variável de repositório `ENABLE_PAGES` como `true` (*Settings → Secrets and variables → Actions → Variables*).

## Pendências futuras

- Ativar o GitHub Pages (ver seção Deploy).
- Possível code splitting do bundle (~508 kB minificado; Motion e Howler poderiam ser carregados sob demanda).
- Features fora do MVP listadas em `.specs/PRODUCT_DECISIONS.md` (login, ranking, modo digitação, revisão inteligente completa, missões, etc.) permanecem não implementadas por decisão de escopo.

## Documentação

A fonte da verdade do projeto fica em `.specs/`.

## Atribuição das bandeiras

Imagens de bandeiras obtidas do Flagpedia.net. O Flagpedia informa que suas imagens de bandeiras estão em domínio público. Backlink apreciado: https://flagpedia.net

Detalhes em `docs/attribution/`.
