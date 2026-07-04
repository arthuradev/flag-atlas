# Session Algorithm — Flag Atlas MVP

## 1. Objetivo

O botão **Continuar treino** não deve ser aleatório puro. Ele deve parecer personalizado, mas sem implementar uma revisão inteligente completa no MVP.

## 2. Tamanho de sessão

Opções:

- 5;
- 10;
- 20;
- 50.

Padrão: 10.

## 3. Composição recomendada para sessão de 10 perguntas

Quando houver histórico suficiente:

```txt
4 perguntas → países para revisão / países fracos
3 perguntas → países novos
3 perguntas → países em progresso / perto de evoluir
```

Adaptar proporcionalmente para sessões de 5, 20 e 50.

## 4. Quando não houver histórico

No início do jogo, priorizar países novos.

Sugestão:

```txt
70% países novos
30% mistura leve por continente/variedade
```

## 5. Score de prioridade

Cada país pode receber uma pontuação interna para seleção.

Exemplo conceitual:

```txt
priority =
  reviewWeight
+ lowMasteryWeight
+ unseenWeight
+ nearPromotionWeight
- recentlySeenPenalty
```

Não expor isso na UI.

## 6. Regras de seleção

- Não repetir país dentro da mesma sessão, salvo se o conjunto disponível for menor que o tamanho da sessão.
- Respeitar filtro de continente quando em treino por continente.
- Países com erro recente devem ter chance maior de voltar.
- Países novos devem continuar entrando para manter descoberta.
- Países perto de evoluir devem aparecer para gerar satisfação.

## 7. Geração de alternativas

Para cada pergunta:

- 1 resposta correta;
- 3 alternativas erradas;
- nenhuma alternativa repetida;
- se possível, pelo menos 1 alternativa errada do mesmo continente;
- demais alternativas podem vir de outros continentes;
- a ordem deve ser embaralhada.

## 8. Dificuldade futura

Não implementar ainda:

- seleção por bandeiras parecidas;
- confusões específicas;
- revisão espaçada completa;
- modo digitação.

Mas a arquitetura deve permitir adicionar isso depois.

## 9. Feedback e avanço

Após resposta:

- registrar acerto/erro;
- atualizar streak;
- calcular XP da resposta;
- atualizar progresso do país;
- mostrar feedback;
- avançar automaticamente.

## 10. Final da sessão

Ao final, gerar resumo com:

- acertos;
- erros;
- precisão;
- melhor streak;
- XP ganho;
- países evoluídos;
- países para revisar.

## 11. Versão 2 — Novos modos de sessão

### Modo digitação (`questionType: "typing"`)

- A pergunta não gera alternativas; o usuário digita o nome do país.
- A resposta é normalizada (minúsculas, sem acentos, pontuação/hífens viram espaço, espaços colapsados) e comparada com nomes pt-BR/en-US e aliases (`answerNormalization.ts`).
- Resposta vazia não é registrada.
- Acertos e erros alimentam XP, streak, domínio e revisão exatamente como na múltipla escolha.
- O código ISO2 não é aceito de propósito.

### Modo revisão (`mode: "review"`)

Seleção em `selectReviewCountries.ts`:

1. prioriza países com `needsReview`;
2. completa com países já vistos e fracos (menos pontos de domínio, mais erros);
3. nunca repete país — com pouco material, a sessão fica mais curta;
4. sem histórico, retorna vazio e a UI oferece treino normal.

### Modo bandeiras parecidas (`mode: "similar"`)

- O pool de perguntas vem dos grupos manuais de `src/shared/data/similarFlags.ts`.
- As alternativas erradas priorizam países do mesmo grupo (`generateSimilarOptions`), completando com o mesmo continente e depois com o pool global.
- `similarGroupId` opcional restringe a sessão a um único grupo.

### Confusões

Ao errar uma alternativa de múltipla escolha, o país correto registra com qual país foi confundido (`CountryProgress.confusions`). O modo digitação não infere confusão.

## 12. Versão 3 — Sobrevivência, streak diário e missões

### Modo sobrevivência (`mode: "survival"`)

- O jogador começa com 3 vidas (`SURVIVAL_STARTING_LIVES`); cada erro remove 1; acertos pontuam (+1 no score).
- A fila de perguntas é gerada com `selectSessionCountries` cobrindo o pool inteiro, até o teto de segurança de 100 perguntas (`SURVIVAL_MAX_QUESTIONS`) — sem repetir país enquanto houver disponível.
- A sessão termina quando as vidas acabam ou a fila esgota; o `config.size` é ignorado.
- O resumo traz score, recorde anterior e se houve novo recorde; `progress.survival` guarda `bestScore`, `bestStreak` e `sessionsCompleted`.

### Streak diário (`dailyStreak`)

Atualizado apenas ao concluir uma sessão (`registerActiveDay`):

1. mesmo dia nunca conta duas vezes;
2. dia seguinte incrementa;
3. exatamente 1 dia pulado com descanso disponível: consome o descanso e incrementa;
4. pausas maiores recomeçam do 1, devolvendo o descanso — sem culpa;
5. a cada 7 dias ativos o descanso recarrega (máximo 1).

Não confundir com a streak de acertos dentro da sessão (são independentes).

### Missões diárias

- 3 missões por dia (`generateDailyMissions`), determinísticas pela data local (seed da data): recarregar não troca as missões; a virada do dia renova.
- A primeira é sempre "complete 1 sessão"; as outras 2 rotacionam entre acertos, revisão, evolução de domínio, digitação, bandeiras parecidas, sequência e precisão ≥ 80%.
- Progresso atualizado por resposta (`applyAnswerToMissions`) e por sessão concluída (`applySessionToMissions`); XP bônus é concedido uma única vez, na transição para concluída.

### Conquistas no fim da sessão

Ao concluir qualquer sessão, o evento (modo, tipo de pergunta, precisão, melhor streak, nº de perguntas) alimenta a avaliação de conquistas; as recém-desbloqueadas entram no resumo, sem popups nem bloqueio do fluxo.

## 13. Versão 4.5 — Mastery 2.0 e revisão espaçada simples

### Evidência de domínio

Cada resposta correta concede pontos conforme a qualidade da evidência:

```txt
múltipla escolha comum: +2
digitação: +4
revisão: +5
bandeiras parecidas: +4
sobrevivência: +2
revisão vencida respondida corretamente: bônus +3
```

Cada acerto também registra o dia local (`correctDateKeys`) e contadores por
modo/tipo (`typedCorrectCount`, `reviewCorrectCount`, `similarCorrectCount`,
`survivalCorrectCount`). Esses dados alimentam os requisitos de Platina.

### Erros

Erro sempre marca `needsReview = true` e agenda `nextReviewAt = hoje`.
A perda de pontos depende do nível atual:

```txt
Novo: 0
Reconhecido: -1
Aprendido: -2
Dominado: -4
Mestre: -8
```

Dois erros recentes continuam pesando mais um ponto. Erro em Mestre suspende
Platina e o país volta para Ouro/Dominado até revisão bem-sucedida.

### Revisão

`listCountriesNeedingReview` agora inclui:

```txt
needsReview = true
ou nextReviewAt <= hoje
```

O CTA público passa a ser **Revisar hoje**. A seleção de revisão prioriza:

1. países com `needsReview`;
2. países com `nextReviewAt` vencido;
3. países vistos de baixo domínio;
4. países com mais erros;
5. países próximos de evoluir.

Próxima revisão após acerto:

```txt
Reconhecido: +1 dia
Aprendido: +3 dias
Dominado: +7 dias
Mestre: +14 dias
```

Sessões normais também consideram países vencidos para revisão no balde de
revisão/fracos, preservando descoberta de países novos.
