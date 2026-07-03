# Acceptance Criteria — MVP

O MVP é aceito quando todos os critérios abaixo estiverem verdadeiros.

## Produto

- O app abre em desktop e mobile.
- Primeira abertura mostra onboarding.
- Após onboarding, o app abre na Home.
- Home mostra progresso geral e CTA “Continuar treino”.
- O usuário consegue jogar uma sessão de 10 perguntas.
- O usuário consegue escolher sessão de 5, 10, 20 ou 50 perguntas.
- Cada pergunta mostra uma bandeira e 4 alternativas.
- O feedback de acerto/erro é claro.
- O app avança automaticamente após resposta.
- O resumo final mostra acertos, erros, streak, XP, evoluções e revisão.
- “Jogar mais uma” inicia nova sessão.
- Treino por continente funciona.
- Coleção mostra países, domínio e filtros.
- Configurações funcionam.
- Reset de progresso pede confirmação.

## Dados

- Existem exatamente 195 países no MVP.
- Existem exatamente 195 SVGs do MVP.
- Todos os países têm bandeira.
- Todos os países têm nome em pt-BR e en-US.
- Contagens por continente batem com o dataset.

## PWA/offline

- O app instala como PWA ou pelo menos possui manifest e service worker válidos.
- Após primeiro carregamento, o app abre offline.
- As bandeiras necessárias para jogar carregam offline.

## Qualidade

- `pnpm lint` passa.
- `pnpm typecheck` passa.
- `pnpm test` passa.
- `pnpm build` passa.
- Testes E2E principais passam.
- CI está configurado.
- Deploy no GitHub Pages está configurado.

## Escopo

- Não há login.
- Não há backend.
- Não há ranking global.
- Não há loja.
- Não há modo digitação.
- Não há cultura dos países.
- Não há estados/regiões.
