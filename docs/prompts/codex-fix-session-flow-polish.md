# Flag Atlas — Correções de fluxo da sessão, resumo antigo, botão “Não sei” e polimento do treino

Você está trabalhando no projeto **Flag Atlas**, um jogo/PWA de treino de bandeiras. O projeto já possui uma tela de treino imersiva, sem sidebar durante a sessão, feedback visual/sonoro e tela de resultado pós-sessão.

Esta tarefa corrige bugs e melhora o fluxo da sessão sem reescrever o jogo inteiro.

---

## Objetivo geral

Resolver os seguintes pontos:

1. Corrigir bug em que `Continuar treino` abre o resultado antigo de uma sessão já finalizada.
2. Garantir que iniciar/continuar treino crie uma nova sessão de verdade.
3. Descartar corretamente o `summary` antigo ao sair da tela de resultado.
4. Remover ou ajustar o avanço automático após resposta.
5. Melhorar o feedback de acerto simples, que hoje pode parecer vazio.
6. Remover o texto redundante da barra inferior antes de responder.
7. Adicionar botão `Não sei` / `Pular` antes da resposta.
8. Fazer `Não sei` contar como erro, quebrar sequência, marcar para revisão e tocar som negativo.
9. Garantir que tudo funcione no desktop e no celular.
10. Não alterar indevidamente XP, domínio, missões, sons existentes ou identidade visual.

---

# 1. Corrigir bug do resultado antigo ao clicar em “Continuar treino”

## Problema

Após finalizar uma sessão, o store mantém um `summary` da sessão finalizada.

Quando o usuário sai da tela de resultado por uma rota alternativa, como sidebar, botão do navegador ou navegação direta, o `summary` antigo pode continuar vivo.

Depois, na Home, o botão `Continuar treino` faz apenas navegação para `/training`.

Ao entrar em `/training`, a `TrainingPage` detecta algo equivalente a:

```ts
if (summary && !session) {
  navigate("/session-result", { replace: true });
}
````

Como ainda existe `summary` antigo e não existe `session`, o usuário é enviado novamente para a tela de resultado anterior.

## Objetivo

`Continuar treino` nunca deve abrir resultado antigo.

Ao clicar em `Continuar treino`, o app deve iniciar uma nova sessão ou limpar qualquer resumo antigo antes de entrar no treino.

## Arquivos prováveis

Investigue:

```txt
src/features/training/store/sessionStore.ts
src/pages/HomePage/HomePage.tsx
src/pages/TrainingPage/TrainingPage.tsx
src/pages/SessionResultPage/SessionResultPage.tsx
src/app/AppShell.tsx
src/pages/StatsPage/StatsPage.tsx
```

Procure por:

```txt
summary
clearSession
startSession
navigate("/training")
navigate('/training')
session-result
Continuar treino
```

## Implementação esperada

Criar uma ação específica no `sessionStore`, por exemplo:

```ts
dismissSummary: () => void
```

Essa ação deve limpar apenas o resumo antigo:

```ts
summary: null
```

Sem destruir uma sessão ativa por acidente.

Depois, garantir que:

* ao iniciar uma nova sessão, `summary` seja limpo;
* ao sair da tela de resultado, o `summary` antigo seja descartado;
* o CTA da Home não faça apenas `navigate("/training")` se o resultado antigo ainda existir;
* qualquer atalho que leve para `/training` não reaproveite `summary` velho.

## Critérios de aceite

* Finalizar uma sessão e voltar para Home pela sidebar não deixa o app preso no resultado antigo.
* Clicar em `Continuar treino` sempre começa/retoma uma sessão válida, nunca redireciona para resultado antigo.
* A tela de resultado continua funcionando imediatamente após finalizar uma sessão.
* O botão `Jogar mais uma` na tela de resultado continua funcionando corretamente.
* Não apagar progresso global, XP, domínio, moedas ou missões por engano.

---

# 2. Iniciar nova sessão explicitamente a partir da Home

## Problema

O botão principal da Home provavelmente faz algo como:

```ts
navigate("/training");
```

Isso deixa a responsabilidade de iniciar sessão para a `TrainingPage`, mas esse fluxo quebra quando há `summary` antigo.

## Objetivo

O CTA principal da Home deve iniciar uma sessão nova explicitamente ou garantir que o estado antigo esteja limpo antes da navegação.

## Implementação esperada

Na Home, ao clicar em `Continuar treino` / `Começar primeiro treino`:

* limpar `summary` antigo;
* iniciar sessão se essa for a arquitetura correta;
* navegar para `/training`.

Use as funções reais do store. Não duplique lógica se já existir `startSession`.

Exemplo conceitual:

```ts
const handleContinueTraining = () => {
  dismissSummary();
  startSession(/* configuração padrão existente */);
  navigate("/training");
};
```

A configuração da sessão deve respeitar o comportamento atual do app: tamanho padrão, modo atual, tipo de pergunta, continente/filtro se houver.

## Critérios de aceite

* Home não depende de `TrainingPage` para resolver um `summary` antigo.
* Primeira sessão continua funcionando.
* Sessões seguintes continuam funcionando.
* Não quebrar modos especiais, desafios ou revisão.

---

# 3. Ajustar tela de resultado para descartar resumo antigo

## Problema

A `SessionResultPage` consegue mostrar o resultado corretamente, mas se o usuário sai por um caminho alternativo, o `summary` pode continuar no store.

## Objetivo

Após a tela de resultado deixar de ser relevante, o resumo antigo deve ser descartado.

## Implementação esperada

Na `SessionResultPage`:

* manter a estratégia atual de capturar o `summary` localmente, se ela existir;
* ao sair/desmontar a tela, chamar `dismissSummary()`;
* garantir que isso não apague o resultado enquanto o usuário ainda está vendo a tela.

Exemplo conceitual:

```ts
const storeSummary = useSessionStore((state) => state.summary);
const [summary] = useState(storeSummary);
const dismissSummary = useSessionStore((state) => state.dismissSummary);

useEffect(() => {
  return () => {
    dismissSummary();
  };
}, [dismissSummary]);
```

Adapte ao código real.

## Critérios de aceite

* Resultado aparece normalmente ao finalizar sessão.
* Ao sair da tela de resultado, o resumo antigo não fica preso no store.
* Voltar para Home e iniciar novo treino não mostra resultado antigo.

---

# 4. Remover ou ajustar avanço automático após resposta

## Problema

A tela de treino possui botão `Continuar`, mas ainda pode existir avanço automático após responder, com timers parecidos com:

```ts
ADVANCE_DELAY_CORRECT_MS
ADVANCE_DELAY_WRONG_MS
setTimeout(advance, ...)
```

Isso deixa o fluxo ambíguo: o botão existe, mas a sessão avança sozinha.

## Objetivo

A experiência deve ser mais controlada, estilo Duolingo:

1. jogador responde;
2. feedback aparece;
3. jogador clica em `Continuar`;
4. só então avança.

## Implementação esperada

Remover o avanço automático por timer, a menos que exista algum motivo forte no código para manter.

O botão `Continuar` deve ser o único responsável por avançar após resposta.

## Critérios de aceite

* Depois de acertar, a tela não avança sozinha.
* Depois de errar, a tela não avança sozinha.
* O botão `Continuar` avança corretamente.
* O som de acerto/erro continua tocando no momento da resposta.
* Não criar timers órfãos ou efeitos duplicados.

---

# 5. Melhorar feedback de acerto simples

## Problema

Quando o jogador acerta sem promoção de domínio/insígnia, o feedback pode ficar vazio demais, mostrando apenas algo como:

```txt
Boa!
+10 XP
Continuar
```

Quando há promoção de domínio, o card fica melhor porque mostra a insígnia. O acerto simples também precisa parecer completo.

## Objetivo

O feedback de acerto simples deve mostrar a resposta correta de forma clara.

## Comportamento desejado

Em acerto simples:

```txt
Boa!
Resposta correta: Tanzânia.
+10 XP
[Continuar]
```

Em acerto com promoção, preservar o comportamento atual:

```txt
Boa!
Tanzânia: Novo → Reconhecido
Bronze · Reconhecido
+15 XP
[Continuar]
```

Não remover `MasteryBadge`.

## Critérios de aceite

* Acerto simples nunca parece uma caixinha vazia.
* Acerto com promoção continua mostrando evolução/insígnia.
* Erro continua mostrando resposta certa e resposta escolhida.
* Digitação, sobrevivência e outros modos não quebram.

---

# 6. Remover texto redundante da barra inferior antes de responder

## Problema

Antes de responder, a barra inferior mostra algo como:

```txt
Escolha uma resposta para ver o feedback.
```

Isso é redundante e visualmente fraco. O usuário já sabe que precisa escolher uma resposta.

## Objetivo

Remover esse texto e transformar essa área em uma ação útil.

## Comportamento desejado

Antes da resposta, a barra inferior deve mostrar um botão discreto:

```txt
Não sei
```

ou, se o projeto preferir:

```txt
Pular
```

Recomendação: usar `Não sei`, porque é mais pedagógico e combina melhor com aprendizado.

## Critérios de aceite

* O texto “Escolha uma resposta para ver o feedback” não aparece mais.
* A área inferior não fica visualmente morta.
* O botão é visível, mas não compete com as alternativas principais.
* Funciona em desktop e mobile.

---

# 7. Implementar botão “Não sei” / “Pular”

## Objetivo

Adicionar uma ação para quando o jogador realmente não sabe a resposta.

## Regra pedagógica

`Não sei` não é neutro.

Ao clicar:

* conta como erro;
* quebra a sequência;
* não concede XP;
* marca o país para revisão;
* mostra a resposta correta;
* toca o som negativo já existente;
* libera o botão `Continuar`.

## Importante

`Não sei` não deve abrir o modal de sair da sessão.

Ele não abandona a sessão. Ele apenas responde a pergunta atual como “não sabia”.

## Implementação esperada

Investigue o fluxo real em:

```txt
src/pages/TrainingPage/TrainingPage.tsx
src/features/training/store/sessionStore.ts
src/shared/audio/soundPlayer.ts
src/features/progress/logic/mastery.ts
```

Provavelmente será necessário adicionar uma ação ao `sessionStore`, por exemplo:

```ts
skipQuestion()
```

ou adaptar o método de resposta atual para aceitar uma resposta pulada.

O feedback pode receber um campo novo:

```ts
isSkipped: boolean
```

ou equivalente.

## Comportamento visual

Após clicar em `Não sei`:

* alternativa correta pode ficar verde;
* nenhuma alternativa deve ficar vermelha, porque o jogador não escolheu uma resposta errada;
* feedback deve explicar que a pergunta foi pulada.

Texto sugerido:

```txt
Você pulou esta.
A resposta certa era Tanzânia.
Vamos revisar essa em breve.
```

Depois disso, mostrar:

```txt
[Continuar]
```

## Comportamento sonoro

Reutilizar o som de erro já existente.

Se o código já usa algo como:

```ts
playSound(feedback.isCorrect ? "success" : "error");
```

então o feedback de skip deve ser tratado como incorreto:

```ts
isCorrect: false
isSkipped: true
```

## Impacto em estatísticas

O skip deve contar como erro para a sessão.

Deve afetar:

* número de erros;
* precisão;
* melhor sequência/streak;
* lista de revisão;
* resumo final.

Não deve conceder:

* XP de acerto;
* bônus de streak;
* promoção positiva;
* moedas por acerto.

## Critérios de aceite

* Clicar em `Não sei` mostra feedback negativo.
* Clicar em `Não sei` toca som negativo.
* A resposta correta aparece.
* A pergunta entra para revisão.
* A sessão contabiliza como erro.
* `Continuar` avança para próxima pergunta.
* Não há opção marcada como resposta errada escolhida.
* O botão não aparece depois que a pergunta já foi respondida.
* Não quebra mobile.

---

# 8. Proteção de saída da sessão

## Estado atual

Já existe modal de confirmação ao sair do treino. Mantenha esse comportamento.

## Ajuste desejado

Verificar se o botão voltar do navegador ou navegação interna ainda podem sair da sessão sem modal.

Se for possível implementar com segurança usando a versão atual do React Router, bloquear a navegação durante sessão ativa e mostrar o modal de saída.

Não fazer gambiarra frágil.

## Critérios de aceite

* Clicar no X/sair abre modal.
* Confirmar saída limpa sessão ativa e volta para Home.
* Cancelar mantém o jogador no treino.
* Se possível, browser back também pede confirmação.
* `Não sei` não abre modal de saída.

---

# 9. Suporte desktop e mobile

Tudo precisa funcionar desde já no celular.

## Desktop

* Sem sidebar durante treino.
* Sem scroll vertical desnecessário.
* Barra inferior limpa.
* Botão `Não sei` visível antes da resposta.
* Feedback + `Continuar` visíveis depois da resposta.

## Mobile

* Sem header/nav global durante treino.
* Botão `Não sei` deve caber bem no rodapé.
* Feedback de acerto, erro e skip precisa ser legível.
* Em telas muito pequenas, pode haver scroll interno controlado, mas o botão principal não deve ficar inacessível.
* Considerar `safe-area-inset-bottom`.

---

# 10. i18n

Adicionar textos em PT-BR e EN-US.

Arquivos prováveis:

```txt
src/shared/i18n/locales/pt-BR.json
src/shared/i18n/locales/en-US.json
```

Textos PT-BR sugeridos:

```json
{
  "training.skip": "Não sei",
  "training.skippedTitle": "Você pulou esta.",
  "training.skippedCorrectAnswer": "A resposta certa era {{country}}.",
  "training.skippedReview": "Vamos revisar essa em breve.",
  "training.correctAnswer": "Resposta correta: {{country}}."
}
```

Textos EN-US sugeridos:

```json
{
  "training.skip": "I don't know",
  "training.skippedTitle": "You skipped this one.",
  "training.skippedCorrectAnswer": "The correct answer was {{country}}.",
  "training.skippedReview": "We'll review it soon.",
  "training.correctAnswer": "Correct answer: {{country}}."
}
```

Adapte ao padrão real de i18n do projeto.

---

# Restrições

* Não reescrever o app.
* Não alterar a identidade visual.
* Não mexer no sistema de XP global, curva de níveis ou missões, exceto onde for necessário para contabilizar skip corretamente.
* Não remover feedback sonoro existente.
* Não remover feedback de insígnia/mastery.
* Não quebrar revisão espaçada.
* Não mexer nas moedas/debug console.
* Não adicionar dependências novas sem necessidade.
* Não transformar `Não sei` em saída da sessão.
* Não deixar `summary` antigo causar redirecionamento para resultado velho.

---

# Validação manual obrigatória

## Cenário A — bug do resumo antigo

1. Complete uma sessão.
2. Vá para Home pela sidebar, navegador ou outro caminho que não seja o botão interno.
3. Clique em `Continuar treino`.
4. Deve iniciar uma nova sessão.
5. Não deve abrir o resultado antigo.

## Cenário B — acerto simples

1. Acerte uma pergunta que não promova domínio.
2. Feedback deve mostrar mensagem positiva e resposta correta.
3. Deve mostrar XP.
4. Deve aguardar clique em `Continuar`.

## Cenário C — acerto com promoção

1. Acerte uma pergunta que promova domínio.
2. Feedback deve mostrar evolução e `MasteryBadge`.
3. Deve aguardar clique em `Continuar`.

## Cenário D — erro

1. Escolha uma alternativa errada.
2. Feedback deve mostrar resposta correta e resposta escolhida.
3. Deve tocar som negativo.
4. Deve aguardar clique em `Continuar`.

## Cenário E — Não sei

1. Clique em `Não sei` antes de responder.
2. Deve contar como erro.
3. Deve tocar som negativo.
4. Deve mostrar resposta correta.
5. Deve marcar para revisão.
6. Nenhuma alternativa deve ficar vermelha como escolhida.
7. Deve aguardar clique em `Continuar`.

## Cenário F — sair da sessão

1. Durante uma sessão ativa, clique no X/sair.
2. Modal deve abrir.
3. Cancelar mantém no treino.
4. Confirmar encerra sessão e volta para Home.

## Cenário G — mobile

1. Testar em largura mobile.
2. Verificar acerto, erro e `Não sei`.
3. Garantir que o botão `Continuar` e o botão `Não sei` fiquem acessíveis.

---

# Validação técnica obrigatória

Rodar:

```bash
pnpm lint
pnpm build
```

Corrigir qualquer erro.

---

# Entrega esperada

Ao final, reporte:

1. Arquivos alterados.
2. Como corrigiu o bug do `summary` antigo.
3. Como `Continuar treino` inicia uma nova sessão.
4. Como o botão `Não sei` foi implementado.
5. Como skip afeta erro, streak, revisão e resumo.
6. Como o feedback de acerto simples foi melhorado.
7. Se o avanço automático foi removido.
8. Resultado de `pnpm lint`.
9. Resultado de `pnpm build`.
