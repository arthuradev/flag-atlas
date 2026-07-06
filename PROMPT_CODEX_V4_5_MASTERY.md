Você está no repositório do Flag Atlas, uma PWA feita com Vite + React + TypeScript + Tailwind CSS, Zustand, i18next, Motion, Howler, Vitest, Playwright e PWA offline.

O projeto já tem:
- MVP completo;
- Versão 2 completa: modo digitação, aliases, revisão inicial, bandeiras parecidas e estatísticas;
- Versão 3 completa: conquistas, missões diárias, streak diário saudável, sobrevivência e compartilhamento;
- Versão 4 completa: moedas locais, loja cosmética, temas, sons, molduras, mascotes e efeitos visuais.

Agora implemente uma versão intermediária:

VERSÃO 4.5 — MASTERY 2.0 E INSÍGNIAS

====================================================================
OBJETIVO
====================================================================

O sistema atual de domínio por país está simples demais.

Hoje o projeto usa:

src/features/progress/logic/mastery.ts

Com:

- MAX_MASTERY_POINTS = 10
- 0 pontos → Novo
- 1–2 → Reconhecido
- 3–5 → Aprendido
- 6–8 → Dominado
- 9–10 → Mestre

Isso torna "Mestre" fácil demais. O jogador consegue chegar em Mestre rápido demais, até em pouco tempo de jogo, o que faz a progressão perder valor.

Objetivo da V4.5:

1. Tornar o domínio por país mais difícil, mais justo e mais satisfatório.
2. Fazer "Mestre" ser uma conquista realmente especial.
3. Impedir que um país vire Mestre em uma única sessão ou apenas por grind curto.
4. Transformar os níveis de domínio em insígnias visuais.
5. Fazer cada nível parecer uma medalha/tier colecionável.
6. Preservar compatibilidade com progresso antigo.
7. Não quebrar V2, V3 e V4.
8. Não implementar cultura dos países ainda. Isso fica para Versão 5.

A filosofia:

- Reconhecido deve parecer Bronze.
- Aprendido deve parecer Prata.
- Dominado deve parecer Ouro.
- Mestre deve parecer Platina/Diamante, algo raro e muito especial.
- Novo pode ser cinza/sem insígnia.
- O jogador deve sentir: "quero transformar cada país em Platina".

====================================================================
ANTES DE CODAR
====================================================================

Leia primeiro:

- AGENTS.md
- .claude/CLAUDE.md
- README.md
- .specs/PRODUCT_DECISIONS.md
- .specs/ARCHITECTURE.md
- .specs/DATA_MODEL.md
- .specs/SESSION_ALGORITHM.md
- .specs/TASKS.md
- .specs/CHANGELOG.md

Depois inspecione estes arquivos com atenção:

- src/features/progress/logic/mastery.ts
- src/features/progress/logic/mastery.test.ts
- src/entities/progress/progress.types.ts
- src/entities/progress/progress.selectors.ts
- src/entities/progress/progress.stats.ts
- src/features/progress/store/progressStore.ts
- src/features/training/store/sessionStore.ts
- src/features/training/logic/selectSessionCountries.ts
- src/features/training/logic/selectReviewCountries.ts
- src/features/collection/components/CountryListItem.tsx
- src/features/collection/logic/filterCollection.ts
- src/pages/CollectionPage/CollectionPage.tsx
- src/pages/StatsPage/StatsPage.tsx
- src/pages/TrainingPage/TrainingPage.tsx
- src/pages/SessionResultPage/SessionResultPage.tsx
- src/entities/achievement/achievement.catalog.ts
- src/shared/storage/storageSchema.ts
- src/shared/storage/storageSchema.test.ts
- src/shared/i18n/locales/pt-BR.json
- src/shared/i18n/locales/en-US.json

Não assuma nomes de arquivos. Confirme no projeto antes de alterar.

====================================================================
ESCOPO 1 — NOVA ESCALA DE DOMÍNIO
====================================================================

Substituir a escala 0–10 por uma escala mais séria.

Sugestão:

- MAX_MASTERY_POINTS = 100

Faixas públicas sugeridas:

- 0 pontos → Novo
- 1–19 → Reconhecido / Bronze
- 20–49 → Aprendido / Prata
- 50–84 → Dominado / Ouro
- 85–100 → candidato a Mestre / Platina

Mas atenção:

"Mestre" NÃO deve depender apenas de pontos.

Mesmo que o país tenha 100 pontos, ele só pode virar Mestre se cumprir requisitos extras.

A função atual:

masteryLevelForPoints(points)

pode continuar existindo como função base, mas não deve ser a única fonte final para decidir Mestre.

Criar uma função mais completa, por exemplo:

deriveMasteryLevel(progress: CountryProgress): MasteryLevel

ou nome equivalente.

Essa função deve considerar:

- masteryPoints;
- correctCount;
- wrongCount;
- precisão do país;
- dias diferentes com acerto;
- acertos por digitação;
- acertos em revisão;
- acertos em bandeiras parecidas;
- erros recentes;
- needsReview;
- próxima revisão, se implementada.

Não colocar regra complexa dentro de componente React.

====================================================================
ESCOPO 2 — REQUISITOS PARA CADA INSÍGNIA
====================================================================

Manter os nomes públicos existentes:

- Novo
- Reconhecido
- Aprendido
- Dominado
- Mestre

Mas adicionar conceito visual de insígnia:

- Novo: sem insígnia / cinza
- Reconhecido: Bronze
- Aprendido: Prata
- Dominado: Ouro
- Mestre: Platina/Diamante/Atlas

Requisitos conceituais sugeridos:

NOVO
- país nunca visto;
- ou progresso praticamente inexistente.

RECONHECIDO / BRONZE
- primeiros acertos;
- aprendizado ainda superficial;
- pode ser alcançado rapidamente.

APRENDIDO / PRATA
- país já foi acertado algumas vezes;
- não deve exigir dias diferentes obrigatoriamente;
- mas deve exigir mais que apenas 2 acertos.

DOMINADO / OURO
- país acertado com consistência;
- idealmente precisa de mais histórico;
- pode exigir um pouco de variedade:
  - múltipla escolha;
  - ou digitação;
  - ou revisão;
  - ou bandeiras parecidas.

MESTRE / PLATINA
Deve ser difícil.

Sugestão mínima para Mestre:

- masteryPoints >= 85;
- correctCount >= 20;
- precisão do país >= 80%;
- acertos em pelo menos 3 dias diferentes;
- pelo menos 2 acertos por digitação;
- pelo menos 2 acertos em revisão OU revisão espaçada;
- sem erro recente pendente;
- needsReview precisa ser false.

Importante:
- Mestre não pode ser alcançado em uma única sessão.
- Mestre não pode ser alcançado apenas acertando múltipla escolha repetidamente no mesmo dia.
- Erros recentes devem impedir ou suspender Mestre até nova revisão.
- Se o jogador errar um país Mestre, ele deve voltar para revisão e possivelmente cair para Dominado, dependendo da regra.

Não precisa deixar tudo extremamente matemático na UI. Para o usuário, mostrar de forma humana.

====================================================================
ESCOPO 3 — NOVOS CAMPOS EM CountryProgress
====================================================================

Adicionar campos opcionais e normalizados ao CountryProgress para suportar Mastery 2.0.

O tipo atual está em:

src/entities/progress/progress.types.ts

Hoje CountryProgress tem:

- countryId
- seenCount
- correctCount
- wrongCount
- currentCorrectStreak
- bestCorrectStreak
- masteryPoints
- masteryLevel
- needsReview
- confusions?
- lastSeenAt?
- lastCorrectAt?
- lastWrongAt?

Adicionar campos como:

- masterySystemVersion?: 2
- correctDateKeys?: string[]
- typedCorrectCount?: number
- choiceCorrectCount?: number
- reviewCorrectCount?: number
- similarCorrectCount?: number
- survivalCorrectCount?: number
- successfulReviews?: number
- lastPromotionAt?: string
- nextReviewAt?: string
- lastMasteryMode?: SessionMode
- lastMasteryQuestionType?: QuestionType

A implementação pode ajustar nomes, mas precisa preservar a ideia.

Regras:
- correctDateKeys deve guardar dias locais YYYY-MM-DD em que o usuário acertou esse país.
- Não deixar correctDateKeys crescer sem limite. Pode limitar aos últimos 30 ou manter valores únicos.
- typedCorrectCount aumenta quando questionType = "typing" e a resposta está correta.
- choiceCorrectCount aumenta quando questionType = "choice" e a resposta está correta.
- reviewCorrectCount aumenta quando mode = "review" e a resposta está correta.
- similarCorrectCount aumenta quando mode = "similar" e a resposta está correta.
- survivalCorrectCount aumenta quando mode = "survival" e a resposta está correta.
- successfulReviews aumenta quando uma revisão é respondida corretamente.
- nextReviewAt deve ser usado para revisão espaçada simples.
- Campos ausentes em progresso antigo devem receber defaults seguros.

====================================================================
ESCOPO 4 — MIGRAÇÃO SEGURA DO PROGRESSO ANTIGO
====================================================================

O projeto atualmente mantém PROGRESS_SCHEMA_VERSION = 1 e normaliza campos novos com defaults.

Preserve essa filosofia se possível.

Não apagar progresso antigo.

Problema:
O progresso antigo tem masteryPoints de 0 a 10.
A nova escala será 0 a 100.

Criar uma estratégia clara para migrar/normalizar países antigos.

Sugestão:
- Se CountryProgress não tem masterySystemVersion, tratar masteryPoints como escala legada 0–10.
- Converter para nova escala de forma conservadora.
- Exemplo:
  - 0 legado → 0 novo
  - 1–2 legado → faixa Bronze
  - 3–5 legado → faixa Prata
  - 6–8 legado → faixa Ouro inicial
  - 9–10 legado → Ouro alto, mas NÃO Platina automaticamente
- Depois marcar masterySystemVersion = 2.

Importante:
- Um país que era Mestre no sistema antigo não deve virar Mestre automaticamente no sistema novo, porque não há evidência de dias diferentes, digitação e revisão espaçada.
- Ele pode virar Dominado/Ouro alto.
- Isso é intencional: Mestre agora é raro.

Exemplo de migração aceitável:
- legacy 10 pontos → 80 pontos, nível Dominado, não Mestre.
- legacy 8 pontos → 65 pontos, nível Dominado.
- legacy 5 pontos → 40 pontos, nível Aprendido.
- legacy 2 pontos → 15 pontos, nível Reconhecido.

A implementação pode escolher outra tabela, mas precisa:
- preservar sensação de avanço;
- não manter Mestre fácil;
- não zerar progresso;
- testar essa migração.

Atualizar:
- src/shared/storage/storageSchema.ts
- src/shared/storage/storageSchema.test.ts

Testes obrigatórios:
- progresso antigo sem masterySystemVersion carrega;
- masteryPoints 10 legado não vira Mestre automaticamente;
- masteryPoints legado é convertido para escala nova;
- campos novos recebem defaults;
- progresso moderno masterySystemVersion 2 não é reconvertido;
- dados inválidos são normalizados com segurança.

====================================================================
ESCOPO 5 — NOVA LÓGICA DE GANHO/PERDA DE DOMÍNIO
====================================================================

Atualizar:

src/features/progress/logic/mastery.ts

Hoje:
- acerto: +1 ponto;
- erro único: marca revisão;
- dois erros recentes: -1 ponto;
- limite 0–10.

Nova lógica desejada:

Acertos devem dar pontos diferentes conforme o tipo de evidência.

Sugestão:

- acerto em múltipla escolha normal: +2
- acerto em modo digitação: +4
- acerto em revisão: +5
- acerto em bandeiras parecidas: +4
- acerto em sobrevivência: +2
- acerto quando nextReviewAt estava vencido: bônus +3
- acerto depois de dias diferentes: pode contribuir para requisitos de Mestre

Erros:
- erro sempre marca needsReview = true;
- erro em país com nível alto deve ser mais relevante;
- erro em Dominado/Mestre pode remover mais pontos;
- erro em Mestre deve suspender Mestre e voltar para Dominado até revisão;
- não ser punitivo demais nos níveis iniciais.

Sugestão de perda:
- erro em Novo/Reconhecido: 0 ou -1, marca revisão;
- erro em Aprendido: -2;
- erro em Dominado: -4;
- erro em Mestre: -8 e volta para revisão;
- dois erros recentes continuam podendo pesar mais.

Importante:
- Não deixar pontos negativos.
- Não passar de 100.
- Não transformar o jogo em punitivo.
- A regra deve parecer justa.

Alterar a assinatura de applyAnswerToCountryProgress para receber contexto:

- mode
- questionType
- answeredAt
- localDateKey, se necessário
- confusedWithCountryId, já existente

Exemplo conceitual:

applyAnswerToCountryProgress(previous, {
  isCorrect,
  answeredAt,
  localDateKey,
  mode: session.config.mode,
  questionType: session.config.questionType,
  confusedWithCountryId
})

Atualizar chamada em:

src/features/training/store/sessionStore.ts

====================================================================
ESCOPO 6 — REVISÃO ESPAÇADA SIMPLES
====================================================================

Implementar revisão espaçada simples ligada ao domínio.

Adicionar/usar:

- nextReviewAt
- needsReview

Regras sugeridas:
- Ao errar: needsReview = true e nextReviewAt = hoje.
- Ao acertar país Novo/Reconhecido: próxima revisão em 1 dia.
- Ao acertar Aprendido: próxima revisão em 3 dias.
- Ao acertar Dominado: próxima revisão em 7 dias.
- Ao acertar Mestre: próxima revisão em 14 ou 30 dias.
- Ao acertar uma revisão vencida: contar como successfulReview.

Home:
- O botão "Revisar erros" pode evoluir para:
  "Revisar hoje"
- Ele deve aparecer quando houver:
  - países com needsReview;
  - ou países com nextReviewAt <= hoje.

Seletores:
Atualizar ou criar em:

src/entities/progress/progress.selectors.ts

Funções sugeridas:
- listCountriesNeedingReview
- listCountriesDueForReview
- countCountriesDueForReview
- isCountryDueForReview

Atenção:
- Se quiser preservar o nome listCountriesNeedingReview por compatibilidade, faça ele incluir needsReview + nextReviewAt vencido.
- Ou crie nova função e ajuste Home/Stats/Review.
- Não quebrar a UI de revisão existente.

Atualizar:

src/features/training/logic/selectReviewCountries.ts

Revisão deve priorizar:
1. needsReview true;
2. nextReviewAt vencido;
3. baixo domínio;
4. muitos erros;
5. países quase prontos para evoluir.

Testes:
- país com needsReview entra na revisão;
- país com nextReviewAt vencido entra na revisão;
- país com nextReviewAt futuro não entra como prioridade;
- revisão acertada agenda próxima revisão futura;
- revisão vencida correta conta como successfulReview;
- Home/seletores contam corretamente.

====================================================================
ESCOPO 7 — INSÍGNIAS VISUAIS
====================================================================

Criar um componente reutilizável para exibir insígnias de domínio.

Sugestão:

src/features/progress/components/MasteryBadge.tsx

ou:

src/shared/components/MasteryBadge.tsx

O componente deve aceitar:

- masteryLevel
- size?: "sm" | "md" | "lg"
- showLabel?: boolean
- showTier?: boolean
- className?

Visual desejado:

Novo:
- cinza;
- simples;
- sem medalha forte.

Reconhecido:
- bronze;
- medalha simples;
- sensação de primeiro avanço.

Aprendido:
- prata;
- visual mais limpo/brilhante.

Dominado:
- ouro;
- importante e recompensador.

Mestre:
- platina/diamante;
- visual especial;
- brilho sutil;
- parece a insígnia mais rara.

Não usar assets externos.
Pode usar:
- CSS puro;
- emojis como apoio, mas não como única informação;
- SVG inline simples;
- gradientes sutis;
- ring/border/shadow.

Importante:
- Acessível.
- Não depender apenas da cor.
- Label legível.
- Funcionar em tema claro/escuro e temas cosméticos da V4.
- Respeitar reduced motion.
- Não exagerar em animação.

Substituir o chip simples atual em:

src/features/collection/components/CountryListItem.tsx

Hoje ele usa:
- MASTERY_CHIP_CLASSES
- ⭐ apenas para master

Trocar para MasteryBadge.

Também usar MasteryBadge em:
- SessionResultPage nas promoções;
- TrainingPage no feedback de promoção, se fizer sentido;
- StatsPage em "baixo domínio";
- qualquer lugar onde o nível aparece como texto simples e faça sentido.

====================================================================
ESCOPO 8 — COLEÇÃO MAIS COLECIONÁVEL
====================================================================

A coleção deve reforçar a fantasia:

"Estou colecionando insígnias por país."

Atualizar CollectionPage/CountryListItem para mostrar:
- bandeira;
- nome do país;
- insígnia visual;
- status de revisão, se houver;
- talvez progresso até a próxima insígnia.

Exemplo conceitual:

🇭🇷 Croácia
Ouro · 72/100
Próxima revisão: em 6 dias

Ou, em layout compacto:
🇭🇷 Croácia        🥇 Ouro 72/100

Requisitos:
- Não poluir demais a lista.
- Continuar boa no mobile.
- Filtros por domínio continuam funcionando.
- Ordenação por domínio deve usar nova escala corretamente.
- Busca continua funcionando.

Adicionar textos i18n:
- Insígnia
- Bronze
- Prata
- Ouro
- Platina
- Próxima revisão
- Revisar hoje
- Progresso da insígnia
- Faltam X pontos
- Requisitos para Mestre

====================================================================
ESCOPO 9 — ESTATÍSTICAS MELHORES PARA INSÍGNIAS
====================================================================

Atualizar StatsPage e seletores.

Hoje computeOverallStats conta:
- seenCount
- learnedCount
- masteredCount
- reviewCount
- accuracyPercent
- totalAnswers
- completedSessions

Mas "masteredCount" hoje representa Dominado ou acima.

Com Mastery 2.0, diferenciar melhor:

- bronzeCount
- silverCount
- goldCount
- platinumCount
- dueReviewCount
- trueMasterCount

Pode manter masteredCount por compatibilidade, mas deixar claro o significado.

StatsPage deve mostrar:
- países vistos;
- aprendidos;
- ouro/dominados;
- platina/mestres;
- para revisar hoje;
- precisão geral;
- sessões.

Adicionar seção:
"Insígnias"

Exemplo:
- Bronze: 32
- Prata: 14
- Ouro: 5
- Platina: 1

Adicionar seção:
"Quase Platina"
- países com pontos altos, mas faltando requisito;
- mostrar motivo simples:
  - precisa acertar em mais dias;
  - precisa acertar por digitação;
  - precisa revisar de novo;
  - tem erro recente.

Não precisa fazer UI complexa. Uma lista simples basta.

Testes:
- contagem por insígnia;
- platinumCount conta apenas Mestre;
- masteredCount não confunde Dominado com Mestre, ou é renomeado;
- quase Platina detecta países com pontos altos sem requisitos completos.

====================================================================
ESCOPO 10 — CONQUISTAS DA V3 PRECISAM SER AJUSTADAS
====================================================================

A Versão 3 tem conquistas em:

src/entities/achievement/achievement.catalog.ts

Hoje há uma função local:

countMastered(progress)

Ela conta países Dominado ou Mestre.

Isso pode ficar confuso com o novo conceito de Mestre/Platina.

Ajustar conquistas para a nova semântica:

- "Primeiro Domínio" pode continuar exigindo 1 país Dominado/Ouro.
- "Colecionador" pode exigir 25 países Dominado/Ouro.
- "Mestre do Mundo" deve exigir todos os países em Mestre/Platina, não apenas Dominado.
- Adicionar conquistas novas, se fizer sentido:
  - Primeira Platina
  - Colecionador de Platina
  - Atlas de Platina

Mas não exagerar. Se adicionar, atualizar i18n e testes.

Importante:
- Não remover conquistas desbloqueadas antigas do storage.
- Se uma conquista antiga já foi desbloqueada, ela pode continuar desbloqueada.
- Mas novas conquistas devem seguir regras novas.
- Não quebrar moedas de conquistas da V4.

Testes:
- worldMaster exige Mestre/Platina real;
- firstMastery continua funcionando para Dominado/Ouro;
- conquistas antigas desbloqueadas continuam exibidas;
- novas conquistas desbloqueiam corretamente.

====================================================================
ESCOPO 11 — SESSÃO, RESUMO E FEEDBACK
====================================================================

Atualizar SessionAnswer e SessionSummary se necessário.

Hoje SessionAnswer registra:
- masteryBefore
- masteryAfter

Manter isso.

Mas pode adicionar:
- masteryPointsBefore
- masteryPointsAfter
- badgeBefore
- badgeAfter
- nextReviewAt
- masteryProgressMessage

Não adicione campos se não forem necessários.

Resumo da sessão:
- promoções devem mostrar insígnias visualmente;
- se um país virou Ouro/Platina, isso deve aparecer de forma satisfatória;
- Platina deve parecer especial;
- se um país foi marcado para revisão, mostrar de forma amigável;
- se uma revisão espaçada foi concluída, pode mostrar "Revisão concluída".

Training feedback:
- quando subir de nível, mostrar:
  "Croácia ganhou a insígnia Ouro"
  ou
  "Croácia evoluiu: Prata → Ouro"

Para Mestre:
- texto especial:
  "Insígnia Platina desbloqueada!"
  "Você realmente domina essa bandeira."

Tudo em i18n.

====================================================================
ESCOPO 12 — NÃO QUEBRAR SISTEMAS EXISTENTES
====================================================================

Preservar:

- treino normal;
- treino por continente;
- modo digitação;
- revisão;
- bandeiras parecidas;
- sobrevivência;
- XP;
- nível global;
- missões diárias;
- streak diário;
- conquistas;
- moedas;
- loja;
- temas;
- sons;
- molduras;
- mascotes;
- efeitos visuais;
- compartilhamento;
- PWA/offline;
- GitHub Pages.

Atenção especial:
- missões diárias que dependem de "promoted" devem continuar funcionando;
- moedas por conquista não podem duplicar indevidamente;
- revisão não pode ficar vazia quando existem países com nextReviewAt vencido;
- progresso antigo não pode sumir;
- filtros da coleção não podem quebrar;
- stats não podem exibir números incoerentes.

====================================================================
ESCOPO 13 — I18N
====================================================================

Atualizar:

src/shared/i18n/locales/pt-BR.json
src/shared/i18n/locales/en-US.json

Adicionar/ajustar strings para:

- Insígnia
- Insígnias
- Bronze
- Prata
- Ouro
- Platina
- Diamante, se usar esse termo
- Sem insígnia
- Próxima revisão
- Revisar hoje
- Revisão concluída
- Quase Platina
- Faltam acertos em mais dias
- Falta acertar por digitação
- Falta revisar esta bandeira
- Erro recente: revise para recuperar
- Insígnia desbloqueada
- Insígnia Platina desbloqueada
- Progresso da insígnia
- Mestre agora é uma insígnia rara
- Você realmente domina essa bandeira

Não deixar texto hardcoded.

====================================================================
ESCOPO 14 — TESTES
====================================================================

Atualizar e adicionar testes unitários.

Arquivos prováveis:
- src/features/progress/logic/mastery.test.ts
- src/shared/storage/storageSchema.test.ts
- src/entities/progress/progress.selectors.test.ts
- src/entities/progress/progress.stats.test.ts
- src/entities/achievement/achievement.selectors.test.ts
- src/features/training/store/sessionStore.test.ts
- src/features/training/logic/selectReviewCountries.test.ts
- src/features/collection/logic/filterCollection.test.ts

Testes obrigatórios:

1. Escala nova:
- 0 → Novo;
- Bronze;
- Prata;
- Ouro;
- Platina/Mestre somente com requisitos completos.

2. Mestre difícil:
- 100 pontos sem dias diferentes não vira Mestre.
- 100 pontos sem digitação não vira Mestre.
- 100 pontos com needsReview true não vira Mestre.
- país com erro recente não fica Mestre.
- país com requisitos completos vira Mestre.

3. Ganho de pontos:
- choice correto dá menos pontos que typing/review;
- review vencida correta dá bônus;
- similar correto registra similarCorrectCount;
- typing correto registra typedCorrectCount.

4. Erros:
- erro marca revisão;
- erro em Dominado remove pontos;
- erro em Mestre suspende Mestre;
- dois erros recentes continuam sendo tratados com segurança.

5. Revisão espaçada:
- nextReviewAt é agendado;
- país vencido entra na revisão;
- país futuro não entra como prioridade;
- revisão correta incrementa successfulReviews.

6. Migração:
- progresso legado 0–10 é convertido;
- legacy 10 não vira Mestre automaticamente;
- país moderno masterySystemVersion 2 não é convertido de novo;
- campos novos ausentes recebem defaults.

7. Insígnias:
- metadata de badge existe para todos os níveis;
- componente recebe todos os níveis;
- labels i18n existem.

8. Estatísticas:
- contagem Bronze/Prata/Ouro/Platina;
- Quase Platina;
- review due count.

9. Conquistas:
- worldMaster exige Mestre real;
- firstMastery/collector seguem coerentes;
- progresso antigo desbloqueado permanece.

Atualizar E2E se necessário:
- coleção renderiza insígnias;
- treino promove e mostra insígnia;
- revisão aparece para país vencido;
- fluxo antigo de treino ainda funciona;
- loja/cosméticos da V4 continuam funcionando.

Não remova testes existentes para facilitar.

====================================================================
ESCOPO 15 — DOCUMENTAÇÃO
====================================================================

Atualizar:

- README.md
- .specs/DATA_MODEL.md
- .specs/SESSION_ALGORITHM.md
- .specs/TASKS.md
- .specs/CHANGELOG.md
- .specs/ACCEPTANCE_CRITERIA.md

Ou criar:

- .specs/MASTERY_2.md
- .specs/V4_5_ACCEPTANCE_CRITERIA.md

Documentar:

- sistema antigo 0–10 foi substituído;
- Mestre agora é raro;
- níveis agora são tratados como insígnias;
- Bronze/Prata/Ouro/Platina;
- revisão espaçada simples;
- progresso antigo é migrado de forma conservadora;
- não há perda de dados, mas países Mestre antigos podem virar Ouro alto se não tiverem evidência suficiente para Platina;
- V5 de cultura ainda não foi implementada.

====================================================================
VALIDAÇÃO
====================================================================

Ao terminar, rode:

pnpm lint
pnpm typecheck
pnpm test
pnpm build

Se possível:

pnpm e2e

Se algum comando falhar:
- não esconda;
- explique exatamente;
- corrija se for falha de código;
- se for limitação de ambiente, diga claramente.

====================================================================
CRITÉRIOS DE ACEITE
====================================================================

A Versão 4.5 será considerada pronta quando:

1. MAX_MASTERY_POINTS não for mais 10.
2. Mestre não puder ser alcançado apenas com 9–10 pontos.
3. Mestre exigir pontos altos + evidência real de aprendizado.
4. Mestre não puder ser alcançado em uma única sessão.
5. Acertos em digitação/revisão/bandeiras parecidas tiverem peso maior que múltipla escolha comum.
6. Erros recentes impedirem ou suspenderem Mestre.
7. Revisão espaçada simples existir via nextReviewAt.
8. Home/revisão considerar países vencidos para revisão.
9. CollectionPage exibir insígnias visuais.
10. Cada nível tiver identidade visual própria:
    - Novo/cinza;
    - Reconhecido/Bronze;
    - Aprendido/Prata;
    - Dominado/Ouro;
    - Mestre/Platina.
11. StatsPage mostrar contagens por insígnia.
12. "Mestre do Mundo" exigir Mestre/Platina real.
13. Progresso antigo carregar sem sumir.
14. Legacy masteryPoints 10 não virar Mestre automaticamente.
15. V2, V3 e V4 continuarem funcionando.
16. i18n pt-BR/en-US estiver completo.
17. layout mobile e desktop continuar bom.
18. PWA/offline continuar funcionando.
19. lint, typecheck, test e build passarem.
20. E2E passar ou ter justificativa clara se o ambiente impedir.

Ao finalizar, entregue:

1. Lista de arquivos alterados.
2. Explicação objetiva do novo sistema de domínio.
3. Tabela final de pontos e requisitos por insígnia.
4. Como o progresso antigo foi migrado.
5. Onde as insígnias aparecem na UI.
6. Comandos executados e resultados.
7. Qualquer pendência real.
8. Sugestão de próximos passos para a Versão 5, sem implementar a Versão 5.