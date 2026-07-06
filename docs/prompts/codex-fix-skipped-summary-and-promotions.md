# Flag Atlas — Corrigir resumo de perguntas puladas e redesenhar insígnias desbloqueadas

Você está trabalhando no projeto **Flag Atlas**, um jogo/PWA de treino de bandeiras.

O projeto já possui:

- tela de treino imersiva;
- botão `Não sei`;
- feedback visual e sonoro;
- sistema de XP;
- sistema de domínio/mastery por país;
- tela de resultado pós-sessão;
- insígnias desbloqueadas no resumo.

Esta tarefa corrige dois pontos específicos:

1. `Não sei` atualmente conta como erro no resumo, mas precisa aparecer como categoria própria: **Puladas**.
2. A seção **Insígnias desbloqueadas** está visualmente pesada, especialmente quando várias insígnias Bronze são desbloqueadas.

Não reescreva o app inteiro. Corrija com precisão.

---

## 1. Separar “Puladas” de “Erros” no resumo da sessão

### Problema atual

No `sessionStore`, o botão `Não sei` já parece estar implementado como:

```ts
submitAnswer({ isCorrect: false, isSkipped: true });
````

Isso está correto.

O problema é que, ao gerar o resumo, o código provavelmente faz algo como:

```ts
const correctCount = session.answers.filter((answer) => answer.isCorrect).length;
const wrongCount = session.answers.length - correctCount;
```

Com isso, perguntas puladas entram dentro de `wrongCount`.

Visualmente, fica ruim.

Exemplo atual:

```txt
3 acertos
7 erros
Precisão: 30%
```

Mas o correto seria:

```txt
3 acertos
4 erros
3 puladas
Precisão: 30%
```

`Não sei` deve continuar sendo uma ação negativa pedagogicamente, mas precisa ser exibida separadamente.

---

## 2. Regra correta para “Não sei”

`Não sei` deve continuar funcionando como resposta não acertada.

Ao clicar em `Não sei`, deve:

* não dar XP;
* quebrar streak;
* marcar o país para revisão;
* tocar som negativo;
* contar contra a precisão;
* aparecer no resumo como `Pulada`;
* não aparecer misturada como erro real.

Ou seja:

```txt
Acerto = resposta correta
Erro = usuário escolheu/digitou uma resposta errada
Pulada = usuário clicou em “Não sei”
```

A precisão deve continuar sendo:

```txt
acertos / total de perguntas respondidas
```

Onde total inclui:

```txt
acertos + erros + puladas
```

Exemplo:

```txt
3 acertos
4 erros
3 puladas
Precisão = 3 / 10 = 30%
```

---

## 3. Implementar `skippedCount` no resumo

### Arquivos prováveis

Investigue:

```txt
src/features/training/store/sessionStore.ts
src/pages/SessionResultPage/SessionResultPage.tsx
src/features/share/logic/shareText.ts
src/features/training/store/sessionStore.test.ts
src/features/share/logic/shareText.test.ts
src/shared/i18n/locales/pt-BR.json
src/shared/i18n/locales/en-US.json
```

Procure por:

```txt
SessionSummary
correctCount
wrongCount
isSkipped
skipCurrentQuestion
summary
accuracy
shareText
```

### Implementação esperada

Adicionar ao tipo/interface de resumo da sessão:

```ts
skippedCount: number;
```

A lógica de resumo deve separar:

```ts
const correctCount = session.answers.filter((answer) => answer.isCorrect).length;

const skippedCount = session.answers.filter((answer) => answer.isSkipped).length;

const wrongCount = session.answers.filter(
  (answer) => !answer.isCorrect && !answer.isSkipped,
).length;

const totalAnswers = correctCount + wrongCount + skippedCount;

const accuracy =
  totalAnswers === 0 ? 0 : Math.round((correctCount / totalAnswers) * 100);
```

Adapte ao padrão real do projeto.

### Critérios de aceite

* Perguntas puladas não aparecem dentro de `wrongCount`.
* Perguntas puladas aparecem como `skippedCount`.
* Precisão continua considerando puladas como não acerto.
* O resumo final mostra acertos, erros e puladas quando houver puladas.
* Se não houver puladas, a UI pode esconder o item `Puladas` para não poluir.
* O compartilhamento de resultado considera o total correto:
  `correctCount + wrongCount + skippedCount`.

---

## 4. Atualizar UI da tela de resultado

Na tela de resultado pós-sessão, o card principal deve exibir:

```txt
Acertos
Erros
Puladas
Precisão
Melhor sequência
XP
Moedas
```

Não precisa necessariamente usar todos em uma única linha. Preserve a estética atual.

Regra visual:

* mostrar `Puladas` apenas se `skippedCount > 0`;
* manter `Erros` como erros reais;
* precisão continua clara;
* não deixar o card principal ficar apertado no mobile.

Exemplo visual desejado:

```txt
3 acertos
4 erros
3 puladas
Precisão: 30%
```

No mobile, pode quebrar em mais linhas.

---

## 5. Atualizar share text

O compartilhamento de resultado não pode calcular o total apenas com:

```ts
summary.correctCount + summary.wrongCount
```

Agora precisa considerar:

```ts
summary.correctCount + summary.wrongCount + summary.skippedCount
```

Se o texto compartilhado mencionar erros, ele também deve mencionar puladas quando `skippedCount > 0`.

Exemplo PT-BR:

```txt
Terminei uma sessão no Flag Atlas:
3 acertos, 4 erros e 3 puladas.
Precisão: 30%.
```

Exemplo EN-US:

```txt
I finished a Flag Atlas session:
3 correct, 4 wrong, and 3 skipped.
Accuracy: 30%.
```

Adapte ao formato real já existente.

---

## 6. Atualizar i18n

Adicionar traduções nos arquivos reais do projeto.

Arquivos prováveis:

```txt
src/shared/i18n/locales/pt-BR.json
src/shared/i18n/locales/en-US.json
```

Sugestões PT-BR:

```json
{
  "session.skipped": "{{count}} puladas",
  "session.skipped_one": "{{count}} pulada",
  "session.skippedLabel": "Puladas",
  "session.skippedShort": "Puladas"
}
```

Sugestões EN-US:

```json
{
  "session.skipped": "{{count}} skipped",
  "session.skipped_one": "{{count}} skipped",
  "session.skippedLabel": "Skipped",
  "session.skippedShort": "Skipped"
}
```

Use o padrão real de chaves já existente no projeto. Não crie um padrão paralelo se já houver outro.

---

## 7. Atualizar testes

Atualizar ou criar testes para garantir:

1. Sessão com apenas acertos:

   * `skippedCount = 0`;
   * `wrongCount = 0`.

2. Sessão com erros reais:

   * erros aparecem em `wrongCount`.

3. Sessão com `Não sei`:

   * puladas aparecem em `skippedCount`;
   * puladas não entram em `wrongCount`;
   * precisão considera puladas no denominador.

4. Compartilhamento:

   * total inclui puladas;
   * texto menciona puladas quando houver.

Arquivos prováveis:

```txt
src/features/training/store/sessionStore.test.ts
src/features/share/logic/shareText.test.ts
```

---

# 8. Redesenhar seção “Insígnias desbloqueadas”

## Problema atual

Na tela de resultado, a seção `Insígnias desbloqueadas` está visualmente pesada.

Hoje cada promoção parece renderizar:

```txt
País
badge antigo cinza → badge novo grande
2/100
```

Isso gera vários problemas:

* o badge antigo `Novo` quase nunca importa;
* a seta ocupa espaço demais;
* o badge Bronze completo se repete em todas as linhas;
* nomes longos quebram a linha;
* o `2/100` fica solto;
* a seção fica com cara de debug visual;
* Bronze inicial recebe destaque exagerado.

Arquivo provável:

```txt
src/pages/SessionResultPage/SessionResultPage.tsx
```

Componente provável:

```txt
PromotionsCard
```

Procure por:

```txt
PromotionsCard
promotions
MasteryBadge
pointsAfter
arrow-right
Insígnias desbloqueadas
```

---

## 9. Nova regra visual para promoções

Separar promoções comuns de promoções importantes.

### Promoções comuns

Promoções de:

```txt
Novo → Reconhecido
```

ou equivalentes ao Bronze inicial devem ser compactas.

Exemplo desejado:

```txt
Insígnias desbloqueadas
3 novas insígnias Bronze

🇱🇷 Libéria
🇩🇴 República Dominicana
🇱🇨 Santa Lúcia
```

Ou, em layout mais detalhado:

```txt
Libéria                    Bronze · 2/100
República Dominicana       Bronze · 2/100
Santa Lúcia                Bronze · 2/100
```

O ponto principal:

* não mostrar badge antigo;
* não mostrar seta;
* não repetir pill gigante de Bronze em cada linha;
* manter a lista compacta e elegante.

### Promoções importantes

Promoções para níveis mais altos, como:

```txt
Aprendido / Prata
Dominado / Ouro
Mestre / Platina
```

podem aparecer com mais destaque individual.

Exemplo:

```txt
Turcomenistão
Prata · Aprendido · 24/100
```

ou usando `MasteryBadge`, mas de forma contida.

Regra:

```txt
Bronze inicial = compacto
Prata/Ouro/Platina = destaque maior
```

---

## 10. Limite de itens e expansão

Se houver muitas insígnias desbloqueadas, não renderizar uma lista enorme por padrão.

Comportamento desejado:

* mostrar no máximo 3 ou 5 itens inicialmente;
* exibir texto tipo:
  `+4 outras`;
* adicionar botão:
  `Ver todas`;
* ao clicar, expandir a lista.

Exemplo:

```txt
7 novas insígnias Bronze
Libéria, República Dominicana, Santa Lúcia e mais 4

[Ver todas]
```

Ou:

```txt
3 de 7 exibidas
Ver todas
```

Preserve acessibilidade usando `<button>` real.

---

## 11. Layout esperado para o `PromotionsCard`

A seção deve ficar elegante dentro do card atual.

Recomendações:

### Header

```txt
Insígnias desbloqueadas
3 novas insígnias Bronze
```

ou, se houver mistura:

```txt
Insígnias desbloqueadas
3 Bronze · 1 Prata
```

### Lista compacta

Cada item deve ter:

* bandeira;
* nome do país;
* nível novo;
* pontos, se couber bem.

Exemplo:

```txt
🇱🇷 Libéria                  Bronze · 2/100
🇩🇴 República Dominicana     Bronze · 2/100
🇱🇨 Santa Lúcia              Bronze · 2/100
```

Evitar:

```txt
[badge antigo] → [badge novo gigante] 2/100
```

### Mobile

No mobile:

* não quebrar layout;
* nomes longos devem truncar ou quebrar de forma elegante;
* badges não devem empurrar a tela lateralmente;
* não gerar overflow horizontal.

---

## 12. Critérios de aceite para insígnias

* Bronze inicial não usa mais badge antigo + seta + badge gigante repetido.
* A seção fica compacta quando várias Bronze são desbloqueadas.
* Promoções para Prata/Ouro/Platina continuam parecendo especiais.
* Nomes longos não quebram visualmente a linha inteira.
* `pointsAfter/100` aparece de forma discreta e alinhada, ou é omitido no modo compacto se prejudicar a UI.
* Há opção de expandir quando houver muitas promoções.
* Desktop e mobile ficam visualmente bons.

---

# 13. Restrições gerais

* Não alterar a lógica de XP global.
* Não alterar curva de níveis.
* Não alterar missões diárias.
* Não alterar sons existentes.
* Não remover `Não sei`.
* Não remover `MasteryBadge` do projeto; apenas usar com mais critério.
* Não mudar a identidade visual.
* Não adicionar dependências novas sem necessidade.
* Não mexer no debug console ou moedas.
* Não quebrar persistência/localStorage.
* Não quebrar dados antigos; se `skippedCount` vier ausente em algum summary antigo, tratar como `0`.

---

# 14. Validação manual obrigatória

## Cenário A — sessão sem puladas

1. Complete uma sessão sem usar `Não sei`.
2. Resultado deve mostrar acertos e erros normalmente.
3. `Puladas` pode ficar oculto.
4. Precisão deve estar correta.

## Cenário B — sessão com puladas

1. Complete uma sessão usando `Não sei` algumas vezes.
2. Resultado deve mostrar:

   * acertos;
   * erros reais;
   * puladas.
3. Puladas não devem estar somadas em erros.
4. Precisão deve considerar puladas como não acertos.

## Cenário C — compartilhar resultado

1. Compartilhe uma sessão com puladas.
2. Texto deve incluir puladas.
3. Total de respostas deve estar correto.

## Cenário D — insígnias Bronze

1. Complete uma sessão que desbloqueia várias Bronze.
2. A seção deve ser compacta.
3. Não deve aparecer o fluxo pesado `Novo → Bronze` em cada linha.
4. A tela não deve ficar visualmente poluída.

## Cenário E — insígnia mais alta

1. Gere ou simule uma promoção para Prata/Ouro/Platina.
2. Essa promoção deve aparecer com destaque maior que Bronze.
3. O visual deve continuar limpo.

## Cenário F — mobile

1. Testar a tela de resultado em largura mobile.
2. Verificar card principal com `Puladas`.
3. Verificar lista de insígnias.
4. Garantir que não há overflow horizontal.

---

# 15. Validação técnica obrigatória

Rodar:

```bash
pnpm lint
pnpm build
```

Corrigir qualquer erro.

---

# 16. Entrega esperada

Ao final, reporte:

1. Arquivos alterados.
2. Como `skippedCount` foi implementado.
3. Como `wrongCount` passou a excluir puladas.
4. Como a precisão é calculada.
5. Como o compartilhamento foi ajustado.
6. Como o `PromotionsCard` foi redesenhado.
7. Como Bronze foi compactado.
8. Como promoções importantes continuam destacadas.
9. Resultado de `pnpm lint`.
10. Resultado de `pnpm build`.