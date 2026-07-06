# Flag Atlas — Corrigir sessão de treino imersiva, sem sidebar, sem scroll e com confirmação de saída

Você está trabalhando no projeto **Flag Atlas**, um jogo/PWA de treino de bandeiras. Esta tarefa corrige especificamente a experiência da **sessão de treino** no desktop e no celular.

Antes de alterar qualquer coisa, analise o código atual. Não reescreva o projeto inteiro. O objetivo é ajustar o layout e a experiência da sessão, preservando a lógica existente de treino, XP, domínio, insígnias, revisão, missões e sons.

---

## Contexto do problema

A tela de treino atual ainda parece uma página comum do app. Durante uma sessão, ela continua renderizando a estrutura global com sidebar desktop, padding lateral, header/mobile nav e layout herdado do `PageShell`.

Isso causa três problemas principais:

1. A **sidebar esquerda aparece durante o treino**, criando distração em um momento que deveria ser focado.
2. A sessão gera **scroll vertical no desktop**, então o jogador pode precisar rolar para ver feedback ou o botão `Continuar`.
3. O botão de voltar/sair leva embora da sessão sem uma confirmação clara.

A experiência desejada é parecida com uma lição do Duolingo: tela focada, sem sidebar, sem distração, com progresso no topo, exercício no centro e feedback/continuação sempre visíveis.

---

## Descobertas relevantes no código atual

Analise e confirme os nomes reais no repositório, mas os pontos principais observados são estes:

### `src/app/AppShell.tsx`

O `AppShell` renderiza a sidebar desktop sempre, inclusive em `/training`, com algo equivalente a:

```tsx
<aside className="... lg:fixed lg:inset-y-0 lg:left-0 lg:flex">
```

Também aplica offset lateral ao conteúdo:

```tsx
<div className="flex min-h-dvh min-w-0 flex-col lg:pl-20">
```

No mobile, ele também renderiza header e navegação inferior, o que não combina com uma sessão imersiva.

### `src/pages/TrainingPage/TrainingPage.tsx`

A página de treino usa `PageShell`:

```tsx
<PageShell
  backTo="/home"
  title={t(isSurvival ? "survival.title" : "training.title")}
  width="wide"
>
```

Isso é bom para páginas comuns, mas ruim para uma sessão de jogo. O treino precisa de um layout próprio, não de `PageShell`.

### Scroll e altura

A bandeira usa tamanho grande em desktop, algo como:

```tsx
lg:h-[29rem]
```

Somando sidebar/app padding, header do PageShell, título, barra de progresso, bandeira, opções, feedback e margens, a página passa da altura da viewport e aparece scroll.

### Feedback atual

O feedback aparece no fim do layout, com algo equivalente a:

```tsx
<div aria-live="polite" className="min-h-28">
  {feedback && (...)}
</div>
```

Quando a tela fica apertada, esse feedback e o botão `Continuar` podem cair abaixo da área visível.

### Estados de feedback que precisam ser preservados

A mensagem de acerto tem variações importantes:

- acerto simples, mostrando só algo como `Boa!` e XP;
- acerto com evolução de domínio/insígnia, mostrando transição de domínio e `MasteryBadge`;
- erro, mostrando resposta correta e resposta escolhida;
- variações de modo, como digitação/sobrevivência, se existirem.

Não transforme tudo em um feedback genérico. Preserve os detalhes já existentes.

### Saída da sessão

O botão de voltar atual vem do `PageShell` e navega direto para `/home` via `Link`. Isso deve mudar.

A sessão deve pedir confirmação quando o jogador tentar sair.

Importante: no fluxo atual, respostas já podem ser registradas imediatamente no progresso global. Portanto, evite texto enganoso como “você perderá todo seu progresso”. Prefira explicar que o jogador encerrará a sessão e não verá o resumo/recompensas de conclusão.

### Som

O app já possui feedback sonoro em `src/shared/audio/soundPlayer.ts` e a tela de treino já chama algo como:

```ts
playSound(feedback.isCorrect ? "success" : "error")
```

Não mexa no sistema de som nesta tarefa.

### Botão de pular

Não foi encontrado sistema de `Pular`/`skip` no código atual. Não implemente pular agora, a menos que seja necessário por algum motivo técnico. Esta tarefa não é sobre adicionar skip.

---

## Objetivo geral

Transformar a tela de treino em uma experiência imersiva e responsiva:

- sem sidebar desktop durante a sessão;
- sem header/nav mobile durante a sessão;
- sem scroll vertical no desktop em perguntas normais;
- com progresso sempre visível no topo;
- com pergunta, bandeira e alternativas bem centralizadas;
- com feedback e botão `Continuar` sempre visíveis dentro da viewport;
- com confirmação ao tentar sair;
- preservando todos os estados de feedback já existentes;
- funcionando bem desde o começo em desktop e celular.

---

## Arquivos prováveis para investigar

Comece por estes arquivos:

```txt
src/app/AppShell.tsx
src/pages/TrainingPage/TrainingPage.tsx
src/shared/components/PageShell.tsx
src/features/training/store/sessionStore.ts
src/shared/i18n/locales/pt-BR.json
src/shared/i18n/locales/en-US.json
src/shared/audio/soundPlayer.ts
```

Use `rg` para localizar nomes reais:

```bash
rg "Training|Treino|training.title|survival.title|PageShell|Sessão|Continuar|feedback|MasteryBadge|playSound|clearSession|onMouseEnter|sidebar|AppShell|Outlet|xpGained|promoted|isCorrect"
```

---

## 1. Criar modo imersivo no `AppShell`

### Problema

A sidebar e o chrome global aparecem durante o treino.

### Objetivo

Quando a rota atual for de sessão de treino, o `AppShell` deve entrar em modo imersivo.

Use `useLocation` ou solução equivalente já usada no projeto.

Exemplo conceitual:

```ts
const isTrainingRoute = location.pathname.startsWith("/training");
```

A regra exata deve respeitar as rotas reais do projeto.

### Em modo treino

Quando `isTrainingRoute` for verdadeiro:

- não renderizar a sidebar desktop;
- não reservar `lg:pl-20` ou qualquer padding lateral da sidebar;
- não renderizar header mobile;
- não renderizar bottom nav mobile;
- o conteúdo principal deve ocupar 100% da largura e altura disponíveis;
- evitar padding global que crie scroll desnecessário.

### Fora do treino

Fora da rota de treino:

- sidebar desktop continua funcionando como já foi corrigida;
- header/nav mobile continuam funcionando;
- layout normal do app não deve ser alterado.

### Critérios de aceite

- Em `/training`, não aparece sidebar no desktop.
- Em `/training`, não aparece bottom nav mobile.
- Em `/training`, não aparece header mobile do app.
- Fora de `/training`, a navegação normal permanece igual.

---

## 2. Remover `PageShell` da tela de treino

### Problema

`PageShell` é ótimo para páginas comuns, mas adiciona header/título/estrutura que atrapalha a sessão.

### Objetivo

A `TrainingPage` deve usar um layout próprio de sessão, por exemplo:

```txt
TrainingSessionLayout
TrainingTopBar
TrainingExerciseArea
TrainingFeedbackBar
TrainingExitDialog
```

Os nomes podem variar, mas a responsabilidade precisa ficar clara.

### Requisitos

A tela de treino deve ter estrutura própria:

```txt
root: h-dvh overflow-hidden
  top: sair/progresso/streak/xp
  main: pergunta/bandeira/respostas
  bottom: feedback/continuar
```

Não use `PageShell` dentro da sessão ativa.

### Critérios de aceite

- A página de treino não depende mais de `PageShell` para renderizar a sessão ativa.
- O botão de sair/voltar não é um `Link` direto para `/home`.
- A tela consegue controlar confirmação de saída.

---

## 3. Layout sem scroll no desktop

### Problema

A página gera scroll vertical durante a pergunta.

### Objetivo

Em desktop, a sessão deve caber na viewport sem scroll em estados normais:

- sem resposta selecionada;
- acerto simples;
- acerto com promoção/insígnia;
- erro.

### Implementação esperada

Use `100dvh`/`h-dvh` e controle de overflow.

Exemplo conceitual:

```tsx
<div className="flex h-dvh overflow-hidden">
  <div className="mx-auto grid h-full w-full max-w-6xl grid-rows-[auto_1fr_auto]">
    ...
  </div>
</div>
```

Ou solução equivalente.

Não resolva apenas com `overflow-hidden` se isso cortar conteúdo importante. O layout precisa realmente caber.

### Bandeira

A bandeira não deve ter altura fixa grande demais como `lg:h-[29rem]` se isso empurrar opções/feedback para fora da tela.

Use limites responsivos, como ideia conceitual:

```txt
height: clamp(...)
max-height: 30dvh / 34dvh / 40dvh dependendo do breakpoint
```

Com Tailwind, use classes responsivas ou estilos calculados quando necessário.

### Alternativas

No desktop:

- pode usar grid 2 colunas;
- as opções devem caber sem empurrar o feedback para fora.

No mobile:

- preferir 1 coluna;
- evitar que o botão de continuar fique escondido atrás da barra do navegador;
- usar `safe-area-inset-bottom` se necessário.

### Critérios de aceite

- Não aparece scrollbar do navegador durante uma pergunta normal no desktop.
- Pergunta, bandeira, opções e feedback cabem na tela.
- O botão `Continuar` fica visível sem rolar.
- O layout não parece espremido nem cortado.

---

## 4. Topo da sessão

### Objetivo

Criar topo compacto e útil para a sessão.

Ele deve conter:

- botão de sair/voltar, preferencialmente um `X` ou botão discreto;
- barra de progresso da sessão;
- contador de progresso, exemplo `2/10`;
- streak e XP da sessão, se já existirem no layout atual;
- no modo sobrevivência, vidas/estado equivalente, se já existir.

### Comportamento do botão de sair

O botão de sair não deve navegar imediatamente.

Ao clicar, abrir o modal de confirmação de saída.

### Critérios de aceite

- Topo ocupa pouco espaço.
- Progresso é visível.
- Sair exige confirmação.
- O topo funciona em desktop e mobile.

---

## 5. Área central da pergunta

### Objetivo

A área central deve conter:

- pergunta (`Que país é este?`, digitação ou equivalente);
- bandeira ou conteúdo do exercício;
- alternativas ou campo de resposta.

### Requisitos

- A pergunta deve estar visualmente centralizada.
- A bandeira deve ser protagonista, mas não grande a ponto de criar scroll.
- As alternativas devem ficar próximas da bandeira e fáceis de clicar.
- Quando uma resposta for selecionada, os estados visuais existentes de correto/errado/desabilitado devem continuar funcionando.

### Critérios de aceite

- Estado sem resposta selecionada fica limpo e centralizado.
- Acerto destaca resposta correta.
- Erro destaca resposta errada e correta.
- Digitação/sobrevivência, se existirem, continuam funcionando.

---

## 6. Feedback e botão `Continuar` sempre visíveis

### Problema

Hoje o feedback fica depois do conteúdo e pode cair abaixo da dobra.

### Objetivo

Criar um rodapé de feedback para a sessão.

Pode ser:

- uma área fixa no rodapé;
- uma área sticky;
- a terceira linha de um grid `auto 1fr auto`;
- outro layout equivalente.

O importante é: após responder, feedback e `Continuar` precisam aparecer imediatamente, sem scroll.

### Estados obrigatórios

Preserve os estados existentes:

#### Acerto simples

Quando o jogador acerta sem promoção:

- mostrar mensagem positiva, como `Boa!`;
- mostrar XP ganho;
- mostrar botão `Continuar`.

Não deixe a caixa parecer “vazia” demais. Se possível, mantenha uma composição visual agradável mesmo quando não houver promoção.

#### Acerto com promoção/insígnia

Quando houver `feedback.promoted` ou equivalente:

- mostrar transição de domínio, exemplo `Novo -> Reconhecido`;
- mostrar `MasteryBadge` ou componente atual equivalente;
- mostrar XP ganho;
- mostrar botão `Continuar`.

Preserve a lógica existente. Não remova insígnias do feedback.

#### Erro

Quando errar:

- mostrar mensagem tipo `Quase!`;
- mostrar resposta correta;
- mostrar resposta escolhida, quando aplicável;
- mencionar revisão futura se já existe esse texto;
- mostrar botão `Continuar`.

#### Outros modos

Se houver modo de digitação, sobrevivência ou desafios especiais:

- não quebrar o feedback;
- preservar textos existentes;
- preservar consequências de erro/acerto.

### Antes de responder

Antes de responder, o rodapé pode:

- ficar vazio;
- ocupar altura reservada discreta;
- ou mostrar instrução leve.

Mas não deve criar scroll.

### Critérios de aceite

- Após acertar, `Continuar` visível sem scroll.
- Após errar, `Continuar` visível sem scroll.
- Acerto simples não fica com uma caixa estranha/vazia.
- Acerto com insígnia continua mostrando a insígnia corretamente.
- Erro continua mostrando resposta correta e escolhida.

---

## 7. Modal de confirmação ao sair

### Problema

Sair da sessão atualmente é direto.

### Objetivo

Qualquer tentativa explícita de abandonar a sessão ativa deve abrir confirmação.

### Quando abrir o modal

Abrir modal ao:

- clicar no botão X/sair/voltar da sessão;
- tentar navegar para fora da sessão usando controles internos da UI, se houver;
- usar botão voltar do navegador, se for viável implementar com segurança;
- recarregar/fechar aba, usando confirmação nativa do navegador se fizer sentido.

Não implemente interceptação frágil que quebre navegação. Priorize solução segura e simples.

### Texto recomendado

Português:

```txt
Calma! Quer sair do treino?
Você encerrará esta sessão agora e não verá o resumo final.

[Continuar treinando]
[Sair do treino]
```

Inglês:

```txt
Wait! Leave this training session?
You will end this session now and will not see the final summary.

[Keep training]
[Leave training]
```

Evite dizer “você perderá todo o progresso”, porque o código pode registrar respostas imediatamente.

### Ao cancelar

- fechar modal;
- continuar na sessão exatamente onde estava.

### Ao confirmar saída

- chamar `clearSession()` ou ação equivalente do store;
- navegar para `/home` ou destino correto usado pelo app;
- não gerar resumo final da sessão;
- não quebrar progresso já persistido pela arquitetura atual.

### Acessibilidade

O modal deve:

- ter `role="dialog"` ou componente acessível equivalente;
- ter `aria-modal="true"`;
- focar o botão principal ao abrir, se possível;
- fechar com `Escape`, preferencialmente como “continuar treinando”/cancelar;
- não permitir clique acidental fora para confirmar saída;
- manter navegação por teclado.

### Critérios de aceite

- Clicar em sair abre modal.
- Cancelar mantém sessão.
- Confirmar limpa sessão ativa e volta para Home.
- Texto não promete perda total de progresso.
- Modal funciona em desktop e mobile.

---

## 8. Proteção contra voltar/recarregar

### Objetivo

Evitar perda acidental de sessão quando possível.

### Requisitos

- Para botão voltar do navegador, implemente proteção apenas se houver uma forma limpa no roteador atual.
- Para recarregar/fechar aba, use `beforeunload` somente durante sessão ativa.
- Remova listeners ao sair da sessão ou ao desmontar o componente.

### Critérios de aceite

- Não ficam listeners vazando após sair da página.
- Recarregar/fechar aba durante sessão ativa mostra confirmação nativa se suportado.
- Navegação normal fora do treino não é afetada.

---

## 9. Suporte especial para celular

Esta correção precisa funcionar no mobile desde o começo.

### Em celular durante treino

- não mostrar bottom nav do app;
- não mostrar header global do app;
- usar toda a tela disponível;
- respeitar `100dvh` e safe areas;
- feedback e botão `Continuar` não podem ficar atrás da barra do navegador;
- alternativas devem caber em coluna;
- bandeira deve reduzir de tamanho em telas pequenas;
- modal de saída deve ficar legível e confortável.

### Critérios de aceite mobile

Testar em viewport estreita:

- estado sem resposta;
- acerto simples;
- acerto com insígnia;
- erro;
- modal de saída;
- finalização da sessão.

Se uma tela extremamente pequena precisar de rolagem interna mínima, isso é aceitável apenas como fallback. Em celulares comuns, o objetivo é manter tudo visível e confortável.

---

## 10. Não alterar sistemas que não fazem parte desta tarefa

Não mexa desnecessariamente em:

- curva de XP;
- cálculo de XP por resposta;
- domínio por país;
- insígnias;
- revisão espaçada;
- missões;
- sons;
- conquistas;
- loja;
- sidebar fora do treino;
- Home;
- tela de resumo final, exceto se for necessário para não quebrar o fluxo.

A tarefa é de **layout, shell, saída segura e UX da sessão de treino**.

---

## 11. Internacionalização

Se adicionar textos novos, atualize os arquivos de tradução existentes.

Prováveis arquivos:

```txt
src/shared/i18n/locales/pt-BR.json
src/shared/i18n/locales/en-US.json
```

Adicionar chaves para:

- título do modal;
- descrição do modal;
- botão continuar treinando;
- botão sair do treino;
- aria-label do botão sair;
- aria-label/descrições necessárias.

Não hardcode textos novos diretamente no componente se o projeto usa i18n.

---

## 12. Sugestão de componentes

Você pode criar componentes novos se isso deixar o código mais limpo.

Sugestões possíveis:

```txt
src/features/training/components/TrainingSessionLayout.tsx
src/features/training/components/TrainingTopBar.tsx
src/features/training/components/TrainingFeedbackBar.tsx
src/features/training/components/TrainingExitDialog.tsx
```

Não é obrigatório usar exatamente esses nomes. Priorize clareza, baixo acoplamento e manutenção.

---

## 13. Validação manual obrigatória

Teste os cenários abaixo.

### Desktop — sem resposta selecionada

- sidebar não aparece;
- não há scrollbar do navegador;
- progresso no topo aparece;
- pergunta, bandeira e alternativas aparecem bem centralizadas;
- não há header/nav global.

### Desktop — acerto simples

- resposta correta fica destacada;
- som continua funcionando;
- feedback aparece sem scroll;
- botão `Continuar` visível;
- caixa de feedback não parece vazia demais.

### Desktop — acerto com promoção/insígnia

- resposta correta fica destacada;
- promoção de domínio aparece;
- `MasteryBadge` aparece corretamente;
- XP aparece;
- botão `Continuar` visível sem scroll.

### Desktop — erro

- resposta errada e correta ficam destacadas;
- feedback explica a resposta correta;
- botão `Continuar` visível sem scroll.

### Desktop — saída

- clicar no X abre modal;
- cancelar fecha modal e mantém a sessão;
- confirmar chama limpeza da sessão ativa e volta para Home;
- texto não diz que todo progresso será perdido.

### Mobile

- não há bottom nav global durante o treino;
- não há header global durante o treino;
- exercício cabe bem na tela;
- feedback e continuar ficam visíveis;
- modal de saída é confortável;
- safe area é respeitada.

### Fora do treino

- sidebar desktop continua normal;
- header/nav mobile continuam normais;
- páginas Home, Continentes, Desafios, Coleção, Conquistas, Estatísticas e Loja continuam funcionando.

---

## 14. Validação técnica obrigatória

Rode:

```bash
pnpm lint
pnpm build
```

Corrija qualquer erro encontrado.

Se houver testes no projeto, rode também o comando de testes correspondente.

---

## Entrega esperada

Ao finalizar, reporte:

1. Arquivos alterados.
2. Como o `AppShell` detecta e aplica o modo imersivo.
3. Como a tela de treino evita scroll.
4. Como o feedback foi reposicionado.
5. Como os estados de acerto simples, acerto com insígnia e erro foram preservados.
6. Como funciona o modal de saída.
7. Como foi tratado o mobile.
8. Resultado de `pnpm lint`.
9. Resultado de `pnpm build`.

Priorize uma experiência de sessão com cara de jogo: focada, estável, previsível, responsiva e sem distrações.
