# Flag Atlas — Correção de UX, progressão, sidebar e transições

Você está trabalhando no projeto **Flag Atlas**, um jogo/PWA de treino de bandeiras. O objetivo desta tarefa é corrigir problemas reais observados na experiência desktop e na progressão do jogador, sem reescrever o projeto inteiro e sem quebrar mobile.

Antes de alterar qualquer coisa, analise o código atual com atenção. Use `rg`, leia os componentes envolvidos e entenda o fluxo real de XP, sessão, Home, sidebar, resumo final e navegação.

## Objetivo geral

Resolver os seguintes problemas:

1. Progressão global de XP/níveis está fácil demais.
2. Tela de conclusão de sessão está longa demais.
3. Lista de insígnias desbloqueadas ocupa espaço demais.
4. XP ganho na sessão é confuso e pode estar inconsistente quando missões entram junto.
5. Primeira experiência mostra “Continuar treino” mesmo sem o jogador ter começado.
6. Missões aparecem cedo demais para jogador novo.
7. Sidebar desktop tem atalho de treino, enfraquecendo a Home.
8. Sidebar desktop expande automaticamente no hover.
9. Falta botão explícito para abrir/fechar a sidebar.
10. Animação de entrada existe na Home, mas não nas outras abas principais.

---

# 1. Corrigir progressão global de XP/níveis

## Problema atual

O sistema atual usa algo equivalente a:

```ts
XP_PER_LEVEL = 100
level = Math.floor(totalXp / 100) + 1
````

Isso torna o jogo fácil demais, porque cada acerto comum dá cerca de 10 XP. O jogador sobe aproximadamente 1 nível a cada 10 acertos, o que faz o nível global perder valor.

## Objetivo

Substituir o sistema linear por uma curva progressiva simples, previsível e fácil de manter.

Mantenha o XP por resposta/missão como está, a menos que seja necessário ajustar algum cálculo para consistência. O foco principal é mudar o custo dos níveis.

## Curva desejada

Implementar uma curva por faixas:

| Faixa de nível atual | XP necessário para ir ao próximo nível |
| -------------------: | -------------------------------------: |
|                 1–10 |                                 100 XP |
|                11–25 |                                 150 XP |
|                26–50 |                                 250 XP |
|                51–75 |                                 400 XP |
|                76–99 |                                 600 XP |

O nível máximo global deve ser **100**.

Se o jogador acumular XP além do necessário para o nível 100, mantenha `totalXp` salvo normalmente, mas o nível exibido deve ficar em 100. A UI deve tratar esse estado como nível máximo.

## Implementação esperada

Atualize a lógica em arquivos relacionados a XP/progresso, provavelmente em:

* `src/features/progress/logic/xp.ts`
* `src/features/progress/store/progressStore.ts`
* componentes que exibem nível/barra de XP
* qualquer outro arquivo encontrado por `rg "XP_PER_LEVEL|computeLevel|totalXp|level"`

Crie funções claras, por exemplo:

```ts
export const MAX_LEVEL = 100;

export function getXpRequiredForLevel(level: number): number;
export function getTotalXpRequiredForLevel(level: number): number;
export function computeLevel(totalXp: number): number;
export function getLevelProgress(totalXp: number): {
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressRatio: number;
  isMaxLevel: boolean;
};
```

A nomenclatura pode variar, mas a ideia precisa ficar clara.

## Critérios de aceite

* Com 0 XP, jogador é nível 1.
* Com XP abaixo do custo do próximo nível, continua no mesmo nível.
* O custo do nível não é mais sempre 100.
* A barra de XP usa `currentLevelXp / xpForNextLevel`, não `totalXp % 100`.
* O nível máximo exibido é 100.
* A UI não quebra quando `totalXp` passa do necessário para o nível 100.
* Adicionar ou atualizar testes, se o projeto já tiver estrutura de testes.

---

# 2. Corrigir tela de conclusão de sessão

## Problema atual

A tela pós-sessão está visualmente bonita, mas longa demais. Ela mostra:

* resultado;
* conquistas;
* missões;
* lista extensa de insígnias desbloqueadas;
* países para revisar;
* botões principais.

Os botões importantes ficam muito abaixo, exigindo scroll. Isso transforma uma tela de recompensa/decisão rápida em um relatório longo.

## Objetivo

Reorganizar a tela de conclusão para priorizar:

1. Resultado principal.
2. Recompensas.
3. Próxima ação.
4. Detalhes secundários.

A experiência deve responder rapidamente:

* Como fui?
* O que ganhei?
* O que faço agora?

## Comportamento desejado

No topo da tela de conclusão, mostrar:

* “Sessão concluída!”
* mensagem de nível, se houver level up;
* acertos/erros/precisão;
* XP total ganho;
* moedas ganhas;
* melhor sequência.

Logo depois, mostrar as ações principais:

* `Jogar mais uma`
* `Revisar hoje` ou `Revisar erros`, se houver países para revisão
* `Voltar ao início`

Essas ações devem aparecer cedo, sem exigir scroll no desktop.

Detalhes secundários devem vir depois:

* conquistas desbloqueadas;
* missões concluídas;
* insígnias desbloqueadas;
* países para revisar;
* loja/compartilhar, se fizer sentido.

## Desktop

No desktop, use melhor o espaço horizontal. A tela não precisa parecer uma coluna mobile centralizada.

Sugestão:

* coluna principal: resultado, recompensas e CTAs;
* coluna secundária: missões, conquistas, insígnias e revisão.

Não precisa seguir exatamente esse layout se houver solução melhor, mas os CTAs principais precisam ficar visíveis cedo.

## Mobile

Preservar uma boa experiência mobile. No mobile, pode continuar em coluna única, mas os CTAs principais ainda devem aparecer antes de listas longas.

---

# 3. Resumir insígnias desbloqueadas

## Problema atual

A seção “Insígnias desbloqueadas” lista muitos países individualmente. Em uma primeira sessão, vários países podem virar Bronze/Reconnhecido, gerando uma lista repetitiva e muito longa.

## Objetivo

Manter a recompensa visível, mas evitar que ela domine a tela.

## Comportamento desejado

Quando houver muitas insígnias desbloqueadas:

* mostrar um resumo;
* exibir apenas as primeiras 3 ou 5;
* permitir expandir para ver todas, se necessário.

Exemplo de texto:

```txt
7 novas insígnias desbloqueadas
Bronze · Reconhecido
Burundi, Ilhas Salomão, Macedônia do Norte e mais 4
```

Ou:

```txt
Insígnias desbloqueadas
7 novas insígnias Bronze

[lista curta com 3 primeiras]
Ver todas
```

Ao expandir, a lista completa pode aparecer.

## Critérios de aceite

* A lista não deve ocupar uma tela inteira quando muitas insígnias forem desbloqueadas.
* A informação não deve ser perdida.
* O jogador deve conseguir ver detalhes se quiser.
* A recompensa deve continuar parecendo positiva.

---

# 4. Corrigir clareza e consistência do XP da sessão

## Problema atual

A tela pode mostrar algo como:

```txt
7 acertos
3 erros
+105 XP
```

Isso parece estranho, porque 7 acertos comuns sugerem aproximadamente 70 XP. Parte do XP pode vir de missões, bônus de streak, promoções de domínio ou outras fontes, mas isso não fica claro.

Além disso, existe risco de inconsistência quando missões diárias concedem XP no fechamento da sessão: o XP total do jogador pode incluir missão, mas o resumo pode mostrar apenas `sessionXp` das respostas.

## Objetivo

O resumo precisa ser honesto e claro.

## Implementação esperada

Investigue o fluxo em arquivos como:

* `src/features/training/store/sessionStore.ts`
* `src/features/progress/store/progressStore.ts`
* `src/features/progress/logic/xp.ts`
* `src/features/missions/logic/dailyMissions.ts`
* tela/componente de resumo da sessão, localizar por `rg "Sessão concluída|xpEarned|sessionXp|missions"`

Ajuste o modelo de resumo para diferenciar, quando possível:

* XP por respostas;
* XP por bônus de streak/promoção;
* XP por missões;
* XP total ganho no encerramento.

Não precisa criar um painel matemático complexo. Uma solução simples já serve:

```txt
+105 XP total
70 respostas · 35 bônus/missões
```

Ou:

```txt
+105 XP
Inclui bônus de missões
```

Preferível, se o código permitir:

```txt
+70 XP respostas
+35 XP missões e bônus
```

## Critérios de aceite

* O XP exibido no resumo deve bater com o XP realmente adicionado ao progresso global.
* `levelBefore` e `levelAfter` devem considerar corretamente todo XP ganho no fechamento da sessão.
* Se missões diárias concederem XP junto do fim da sessão, isso não deve “mentir” no resumo.
* O jogador deve entender por que ganhou mais XP do que apenas `acertos * 10`.

---

# 5. Corrigir primeira experiência da Home

## Problema atual

Ao abrir o app pela primeira vez, com:

* 0 XP;
* 0 sessões;
* 0 países aprendidos;
* 0 moedas;

a Home e/ou sidebar mostram “Continuar treino”.

Isso não faz sentido, porque o jogador ainda não começou nada.

## Objetivo

A Home deve se adaptar ao estado inicial do jogador.

## Regra desejada

Detectar primeira experiência com algo semelhante a:

```ts
const isFirstRun =
  progress.totalSessions === 0 &&
  progress.totalAnswers === 0 &&
  progress.totalXp === 0;
```

Use os campos reais existentes no store. Não invente campos se já existir informação suficiente.

## Textos desejados

Na primeira vez:

* CTA principal: `Começar primeiro treino`
* texto auxiliar: algo como `Comece com uma sessão curta de 10 perguntas.`
* tom de boas-vindas.

Depois que o jogador já tiver jogado:

* CTA principal: `Continuar treino`

## Critérios de aceite

* Em estado zerado, não deve aparecer “Continuar treino” como CTA principal.
* Depois da primeira sessão, “Continuar treino” pode aparecer normalmente.
* A Home continua sendo o centro principal para iniciar uma sessão.

---

# 6. Ajustar missões para jogador novo

## Problema atual

Na primeira abertura, o app mostra missões como:

* Complete 1 sessão;
* Evolua o domínio de 1 país;
* Revise 3 erros.

Para um jogador novo, “domínio” e “revisar erros” podem ser conceitos ainda não apresentados.

## Objetivo

A primeira Home deve ser mais introdutória.

## Comportamento desejado

Quando `isFirstRun` for verdadeiro, substituir ou adaptar o bloco de missões por um bloco de primeiros passos.

Exemplo:

```txt
Primeiros passos
Faça seu primeiro treino
Ganhe seus primeiros XP
Desbloqueie sua primeira insígnia
```

Depois da primeira sessão, mostrar as missões diárias normais.

## Critérios de aceite

* Jogador novo não deve ser exposto cedo demais a termos avançados sem contexto.
* As missões diárias continuam funcionando normalmente após o primeiro treino.
* Não alterar a lógica interna das missões desnecessariamente; isso é principalmente uma mudança de apresentação/UX.

---

# 7. Remover treino da sidebar desktop

## Problema atual

A sidebar desktop tem um item “Continuar treino” ou equivalente que leva para `/training`.

Isso compete com a Home. Se o jogador pode iniciar treino pela sidebar, a Home perde força como tela principal.

## Objetivo

A sidebar desktop deve ser navegação secundária, não o principal ponto de início de sessão.

## Implementação esperada

No desktop:

* remover item `Continuar treino`;
* remover atalho direto para `/training`;
* remover divisor visual que existia apenas por causa desse item, se ficar sem sentido.

A lista da sidebar desktop deve começar pelos destinos principais:

* Flag Atlas;
* Continentes;
* Desafios;
* Coleção;
* Conquistas;
* Estatísticas;
* Loja.

A navegação mobile não deve ser alterada, a menos que seja necessário para manter consistência ou build.

## Critérios de aceite

* No desktop, não existe mais botão de iniciar/continuar treino na sidebar.
* A Home continua tendo o CTA principal de treino.
* Nenhuma rota quebra.

---

# 8. Corrigir expansão automática da sidebar

## Problema atual

A sidebar desktop expande automaticamente quando o mouse passa por cima dela. Isso é ruim porque muda o layout sem ação explícita do usuário.

Provável código atual em `src/app/AppShell.tsx` ou equivalente:

```tsx
onMouseEnter={...}
onMouseLeave={...}
onFocusCapture={...}
onBlur={...}
```

## Objetivo

A sidebar deve funcionar como a barra lateral do ChatGPT:

* hover apenas sinaliza;
* clique abre;
* clique fecha;
* não abrir/fechar automaticamente ao mover o mouse.

## Implementação esperada

Remover a lógica de expansão automática por hover/foco.

Remover ou simplificar:

* `onMouseEnter`;
* `onMouseLeave`;
* timers de collapse;
* `onFocusCapture`, se usado apenas para auto-expandir;
* `onBlur`, se usado apenas para auto-fechar.

A expansão deve ser controlada por estado explícito:

```ts
const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
```

ou usar o estado já existente, mas apenas com ações explícitas.

## Critérios de aceite

* Passar o mouse pela sidebar recolhida não expande a sidebar.
* Tirar o mouse da sidebar expandida não fecha a sidebar.
* Foco acidental não expande a sidebar.
* O usuário controla abertura/fechamento intencionalmente.

---

# 9. Criar botão explícito para abrir/fechar sidebar

## Objetivo

Criar um controle claro, clicável e acessível para abrir/fechar a sidebar.

## Estado recolhido

Quando a sidebar estiver recolhida:

* no topo deve haver um botão;
* ele pode parecer a logo/ícone do Flag Atlas normalmente;
* no hover/focus, deve mudar visualmente para sinalizar “abrir barra lateral”;
* só deve expandir ao clicar.

O comportamento deve lembrar o ChatGPT:

* hover muda o visual ou mostra tooltip;
* clique executa.

## Estado expandido

Quando a sidebar estiver expandida:

* mostrar logo/nome `Flag Atlas / Terrain`;
* mostrar itens com texto;
* ter um botão claro para fechar, preferencialmente no topo direito;
* hover/focus deve sinalizar “fechar barra lateral”;
* só fecha ao clicar.

## Acessibilidade obrigatória

O controle precisa ser um `<button>` real.

Usar:

```tsx
aria-label={isExpanded ? "Fechar barra lateral" : "Abrir barra lateral"}
aria-expanded={isExpanded}
```

Também deve funcionar com teclado via Enter/Espaço.

Opcional, mas recomendado:

* tecla `Escape` fecha a sidebar se ela estiver expandida.

## Critérios de aceite

* Existe uma região específica para abrir/fechar.
* Hover não abre/fecha.
* O botão é acessível.
* A interação parece intencional e previsível.
* Ao fechar a sidebar, fechar também menus internos abertos, como menu de perfil/configurações, se existirem.

---

# 10. Padronizar animação de entrada entre páginas

## Problema atual

A Home possui animação de entrada com `motion.div`, algo como:

```tsx
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, ease: "easeOut" }}
```

Mas outras abas principais não têm essa animação. Elas usam um `PageShell` comum sem motion.

Isso faz a Home parecer mais polida que:

* Continentes;
* Desafios;
* Coleção;
* Conquistas;
* Estatísticas;
* Loja;
* Configurações, se aplicável.

## Objetivo

Padronizar a entrada das páginas principais.

## Implementação recomendada

Criar um componente compartilhado, por exemplo:

```tsx
PageTransition
```

ou adicionar suporte a animação diretamente em:

```txt
src/shared/components/PageShell.tsx
```

A animação deve ser sutil:

```tsx
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.22, ease: "easeOut" }}
```

Evite animações exageradas.

## Importante

Evite dupla animação na Home. Se `PageShell` passar a animar, remova ou ajuste o `motion.div` específico da Home.

## Critérios de aceite

* Home, Continentes, Desafios, Coleção, Conquistas, Estatísticas e Loja têm transição visual consistente.
* Não há dupla animação na Home.
* A transição é suave e rápida.
* Não quebrar layout mobile/desktop.
* Usar a dependência já existente `motion/react`; não adicionar biblioteca nova.

---

# Restrições gerais

* Não reescrever o app inteiro.
* Não alterar mobile sem necessidade.
* Não remover sistemas existentes de domínio/insígnias/revisão.
* Não trocar a identidade visual do app.
* Manter estética atual: dark, verde, cards suaves, visual profissional.
* Não adicionar dependências novas sem necessidade.
* Não transformar a UI em algo genérico.
* Não usar emojis se já houver ícones próprios/componentes visuais.
* Preservar persistência/local storage existente.
* Garantir compatibilidade com dados antigos, se possível.

---

# Arquivos prováveis para investigar

Use `rg` para confirmar nomes reais. Comece por:

```txt
src/app/AppShell.tsx
src/pages/HomePage/HomePage.tsx
src/shared/components/PageShell.tsx
src/features/progress/logic/xp.ts
src/features/progress/store/progressStore.ts
src/features/training/store/sessionStore.ts
src/features/missions/logic/dailyMissions.ts
```

Também procure por:

```txt
Sessão concluída
Insígnias desbloqueadas
Continuar treino
Começar
xpEarned
sessionXp
computeLevel
XP_PER_LEVEL
totalXp
PageShell
motion.div
onMouseEnter
onMouseLeave
```

---

# Validação obrigatória

Ao finalizar:

1. Rodar lint:

```bash
pnpm lint
```

2. Rodar build:

```bash
pnpm build
```

3. Testar manualmente estes cenários:

## Cenário A — primeira abertura

Com storage limpo/anônimo:

* Home não mostra “Continuar treino” como CTA principal.
* Home mostra algo como “Começar primeiro treino”.
* Missões avançadas não aparecem de forma confusa.
* Sidebar desktop não tem “Continuar treino”.
* Sidebar não expande no hover.

## Cenário B — após uma sessão

Depois de completar uma sessão:

* CTA pode mudar para “Continuar treino”.
* XP total e nível fazem sentido.
* Resumo da sessão mostra XP de forma clara.
* Botões principais aparecem cedo.
* Insígnias desbloqueadas não geram lista gigante por padrão.

## Cenário C — sidebar desktop

* Hover na sidebar recolhida não expande.
* Clique no botão superior expande.
* Clique no botão de fechar recolhe.
* ESC fecha, se implementado.
* Perfil/configurações não ficam abertos indevidamente ao fechar.

## Cenário D — navegação

* Home, Continentes, Desafios, Coleção, Conquistas, Estatísticas e Loja têm animação consistente.
* Não há dupla animação na Home.
* Mobile continua funcionando.

---

# Entrega esperada

Faça as alterações necessárias e, ao final, reporte:

1. Arquivos alterados.
2. Resumo das mudanças.
3. Como a nova curva de XP funciona.
4. Como a sidebar funciona agora.
5. Como a primeira experiência foi ajustada.
6. Como a tela de conclusão foi reorganizada.
7. Resultado de `pnpm lint`.
8. Resultado de `pnpm build`.

Priorize qualidade de produto, consistência visual, previsibilidade de interação e clareza para jogador novo.