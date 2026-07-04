# Acceptance Criteria — Versão 2

A Versão 2 é aceita quando todos os critérios abaixo estiverem verdadeiros.

## Compatibilidade

- [x] O treino normal de múltipla escolha continua funcionando.
- [x] O treino por continente continua funcionando.
- [x] O progresso antigo do usuário não é apagado (schema v1 mantido; campos novos opcionais e normalizados).
- [x] O app continua funcionando offline/PWA.
- [x] i18n pt-BR/en-US continua completo.

## Modo digitação

- [x] Funciona com bandeira + input grande + feedback claro.
- [x] Aceita nomes em pt-BR, en-US e aliases (EUA, USA, Santa Sé, UK, etc.).
- [x] Normalização aceita respostas sem acento, com pontuação e espaços extras.
- [x] Resposta vazia não é registrada.
- [x] Resposta errada marca o país para revisão.
- [x] Enter envia; foco automático no input a cada pergunta.

## Revisão

- [x] CTA “Revisar erros” aparece na Home quando há países para revisar.
- [x] Botão “Revisar erros” aparece no resumo quando a sessão gerou revisões.
- [x] A sessão de revisão prioriza países errados/fracos e não repete países.
- [x] Sem nada para revisar, a UI explica e oferece treino normal.

## Bandeiras parecidas

- [x] O desafio funciona a partir da página Desafios.
- [x] As perguntas vêm apenas dos grupos curados.
- [x] As alternativas priorizam países do mesmo grupo, completando com continente/global.
- [x] Todos os ids dos grupos existem no dataset (testado).

## Estatísticas

- [x] Tela /stats com cards de resumo (vistos, aprendidos, dominados+, revisar, precisão, sessões).
- [x] Listas “Mais difíceis”, “Para revisar”, “Confusões comuns” e “Baixo domínio”.
- [x] Confusões registradas ao errar alternativa de múltipla escolha.
- [x] Estatísticas 100% locais, derivadas do progresso local.

## Qualidade

- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` passam.
- [x] E2E cobre digitação, revisão, bandeiras parecidas, estatísticas e os fluxos antigos.

## Escopo

- [x] Sem login, backend, ranking, loja, moedas, mascote, cultura, estados/regiões, missões, streak diário, multiplayer ou app nativo.
