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

- **MVP**: completo (Fases 0–9 de `.specs/TASKS.md`).
- **Versão 2**: completa — aprendizado real por cima do quiz.
- **Versão 3**: completa — retenção e diversão, sem virar app punitivo.
- **Versão 4**: completa — personalização cosmética, sem pay-to-win.

## Versão 2

A Versão 2 adiciona:

- **Modo digitação** (`Desafios → Modo digitação`): digite o nome do país da bandeira. Aceita nomes em pt-BR, en-US e aliases (EUA, USA, Santa Sé, UK...), com normalização de acentos, pontuação e espaços. Código ISO2 não é aceito de propósito.
- **Revisão inteligente inicial** (`Revisar erros` na Home e no resumo da sessão): prioriza países marcados para revisão e completa com países fracos. Ainda não é revisão espaçada completa — é uma primeira versão.
- **Bandeiras parecidas** (`Desafios → Bandeiras parecidas`): treino focado em grupos manuais de bandeiras confundíveis (Chade×Romênia, Eslováquia×Eslovênia, etc.), com alternativas erradas vindas do próprio grupo.
- **Estatísticas** (`/stats`, atalho na Home): países vistos/aprendidos/dominados, precisão geral, mais difíceis, para revisar e confusões comuns (qual bandeira você trocou por qual). Tudo local, derivado do progresso local.

Continua sem backend, login e ranking. O progresso antigo é preservado (schema v1 mantido, campos novos opcionais).

## Versão 3

A Versão 3 adiciona retenção e diversão, mantendo a filosofia "erro ensina, não pune":

- **Conquistas** (`/achievements`, atalho 🏆 na Home): 18 conquistas locais derivadas do progresso — marcos de países vistos, domínio, continentes, sessões perfeitas, modos da V2 e sobrevivência. Bloqueadas mostram progresso parcial; desbloqueios aparecem no resumo da sessão, sem popups.
- **Missões diárias** (bloco "Missões de hoje" na Home e no resumo): 3 missões por dia, geradas deterministicamente pela data local, persistidas durante o dia e renovadas na virada. Recompensa é um XP bônus pequeno, concedido uma única vez por missão.
- **Streak diário saudável** (linha discreta na Home): conta dias com pelo menos uma sessão concluída, sem contar duas vezes o mesmo dia. Um dia pulado é coberto por 1 descanso (🧊), que recarrega a cada 7 dias ativos. Perder a sequência recomeça leve, com mensagem sem culpa — sem tela vermelha, sem vidas bloqueando aprendizado.
- **Desafios** (`/challenges`): página reorganizada com 6 cards — Modo digitação, Bandeiras parecidas, Revisar erros, Sobrevivência, Desafio rápido (5 perguntas) e Desafio perfeito (10 perguntas) — cada um com tipo de pergunta e duração.
- **Modo sobrevivência** (`Desafios → Sobrevivência`): 3 vidas, cada erro tira uma, cada acerto pontua; termina quando as vidas acabam (teto de segurança de 100 perguntas, sem repetir país). Recorde local salvo e exibido no card do desafio.
- **Compartilhar resultado** (botão no resumo da sessão): gera um texto bonito do resultado (normal ou sobrevivência) via Web Share API; sem ela, copia para a área de transferência; se nada funcionar, mostra o texto selecionável. Apenas texto local — sem backend e sem dados sensíveis.

Continua sem backend, login, ranking, loja ou moedas. O progresso V1/V2 é preservado: o schema segue v1 e os campos novos (`achievementsUnlocked`, `dailyStreak`, `survival`) são normalizados com defaults; as missões diárias vivem em chave própria (`flag-atlas:daily-missions`).

## Versão 4

A Versão 4 adiciona **personalização cosmética** — só aparência e som, sem alterar dificuldade, aprendizado, XP real ou vantagem. É tudo local e offline: **sem dinheiro real, sem microtransação, sem backend, sem login, sem pay-to-win**.

- **Moedas Atlas** (`cosmetics.coins`): moeda local e cosmética, ganha jogando. +10 por sessão concluída, +5 de bônus por sessão perfeita, +15 por missão diária, +25 por conquista e, na sobrevivência, moedas pelo score (com teto). São concedidas uma única vez por evento e o saldo nunca fica negativo. Saldo mostrado discretamente na Home (linha 🛍️ Loja) e no resumo da sessão.
- **Loja** (`/shop`, atalho 🛍️ na Home, no resumo e nas Configurações): compra e equipa cosméticos com Moedas Atlas. Categorias: **Temas, Sons, Molduras, Mascotes e Efeitos**. Cada item mostra preço e estado (Comprar / Equipar / Equipado); itens gratuitos nunca são vendidos. "Continuar treino" segue como CTA principal.
- **Temas** (CSS Variables): `Padrão` segue o claro/escuro/sistema das Configurações; 6 temas especiais (Mapa Antigo, Neon Atlas, Oceano, Espaço, Biblioteca, Minimalista) trazem paleta própria. Sem imagens externas, funciona offline.
- **Sound packs** (Howler, WAV locais): Padrão e Silencioso são grátis; Suave, Arcade e Digital são cosméticos. Respeitam mute e volume das Configurações.
- **Molduras** decoram só o card da bandeira no treino (todos os modos), sem distorcer a bandeira. **Mascote** discreto (Globo, Bússola, Corujinha Atlas, Foguetinho ou nenhum) na Home e no resumo. **Efeitos visuais** sutis (brilho, confete, pulso neon, estrelas) em momentos de feedback — sempre desativados com "Reduzir animações" ligado.
- **Como ganhar moedas:** jogue. Qualquer sessão comum, revisão, digitação, bandeiras parecidas ou sobrevivência concede moedas ao concluir; missões e conquistas também. Não é preciso ter moedas para aprender — cosmético nunca bloqueia conteúdo.

Continua sem backend, login e ranking. O progresso V1/V2/V3 é preservado: o schema segue **v1** e o novo campo `cosmetics` (moedas, itens possuídos e equipados) é normalizado com defaults seguros; o `settings.theme` claro/escuro é mantido. Detalhes em `.specs/COSMETICS.md` e `.specs/V4_ACCEPTANCE_CRITERIA.md`.

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
- Possível code splitting do bundle (~578 kB minificado; Motion e Howler poderiam ser carregados sob demanda).
- Features fora de escopo listadas em `.specs/PRODUCT_DECISIONS.md` (login, ranking global, backend, multiplayer, cultura dos países, estados/regiões, etc.) permanecem não implementadas por decisão de escopo.

## Documentação

A fonte da verdade do projeto fica em `.specs/`.

## Atribuição das bandeiras

Imagens de bandeiras obtidas do Flagpedia.net. O Flagpedia informa que suas imagens de bandeiras estão em domínio público. Backlink apreciado: https://flagpedia.net

Detalhes em `docs/attribution/`.
