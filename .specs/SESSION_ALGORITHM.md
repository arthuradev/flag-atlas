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
