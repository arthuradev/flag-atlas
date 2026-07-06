# Flag Atlas — Prompt para Codex implementar Terrain UI Refresh

## Mini prompt para enviar no chat do Codex

Leia o arquivo `FLAG_ATLAS_CODEX_TERRAIN_UI_REFRESH_V2.md` e implemente a atualização visual Terrain no repositório real do Flag Atlas.

Use o repositório GitHub conectado como fonte do código atual.

Os arquivos do Claude Design já foram extraídos e estão dentro do repositório em `docs/design/`. Não procure por `.zip`. Leia os arquivos dessa pasta, especialmente:

- `docs/design/Flag Atlas Screens.dc.html`
- `docs/design/Flag Atlas Handoff.dc.html`
- `docs/design/Flag Atlas Design System.html`
- qualquer outro arquivo relacionado ao design system ou handoff dentro de `docs/design/`

Contexto importante: a atualização deve ser visual/profissional, baseada no handoff do Claude Design. Não altere lógica de jogo, dados, storage, XP, domínio, revisão, conquistas, loja, cosméticos, i18n ou PWA/offline.

O projeto usa Tailwind CSS v4 com tokens em `src/index.css` via `@theme inline`, então não crie `tailwind.config.js` só porque o handoff menciona isso.

Comece apenas pelas fases 1 a 4:
1. fundação visual;
2. componentes base;
3. ícones locais;
4. AppShell/navegação.

Depois pare, rode as validações e me entregue um resumo dos arquivos alterados, decisões tomadas, adaptações feitas em relação ao handoff e resultado dos comandos.

---

# Prompt completo

Você está no repositório real do **Flag Atlas**, uma PWA educacional gamificada para aprender bandeiras de países.

O projeto já funciona. Esta tarefa é uma atualização visual/profissional da interface, não uma reescrita de produto.

## Materiais de design

Os materiais do Claude Design **já foram extraídos** e estão dentro do próprio repositório em:

```txt
docs/design/
```

Não procure por `.zip` e não dependa de anexos externos.

Leia todos os arquivos relevantes dentro de `docs/design/`, especialmente:

```txt
docs/design/Flag Atlas Screens.dc.html
docs/design/Flag Atlas Handoff.dc.html
docs/design/Flag Atlas Design System.html
```

Também considere qualquer arquivo complementar de design system, handoff, screens ou standalone export dentro dessa pasta.

Use esses materiais como referência visual e técnica, mas adapte a implementação ao código real do projeto.

## Objetivo

Implementar a atualização visual **Terrain — Modern cartographic learning game** no Flag Atlas.

A interface final deve parecer:

- um produto educacional real;
- profissional, autoral e polido;
- moderno, limpo e cartográfico;
- amigável e casual, sem ficar infantil;
- excelente no mobile;
- bem aproveitada no desktop.

O desktop não pode parecer apenas a versão mobile centralizada com espaços vazios.

## Direção visual

Use **Terrain** como base principal:

- app educacional premium;
- estética de atlas, mapa, descoberta, viagem e domínio de países;
- fundo claro e limpo;
- cards profissionais;
- badges com aparência de insígnia;
- menos emojis como elementos principais de UI;
- bandeira como protagonista;
- navegação mais madura;
- layouts próprios para mobile e desktop.

Pode incorporar detalhes sutis da opção **Meridian**, especialmente:

- sensação cartográfica;
- detalhes de atlas;
- textura sutil de mapa;
- uso elegante do ocre/dourado.

Evite:

- visual genérico de IA;
- gradiente roxo/azul clichê;
- excesso de emojis;
- glassmorphism exagerado;
- aparência infantil demais;
- dashboard corporativo frio;
- dependência de CDN, imagens externas ou fontes externas.

## Stack e restrições técnicas importantes

O projeto usa **React + TypeScript + Vite + Tailwind CSS v4**.

Importante: o projeto usa Tailwind CSS v4 com tokens em:

```txt
src/index.css
```

com:

```css
@theme inline
```

Portanto:

- não crie `tailwind.config.js` só porque o handoff menciona isso;
- adapte os tokens do handoff para o padrão atual do `src/index.css`;
- preserve compatibilidade com as classes atuais quando possível.

Também não instale fonte nova. O projeto já usa:

```txt
@fontsource-variable/nunito
```

Evite adicionar dependências desnecessárias.

Em vez de instalar `lucide-react`, prefira criar SVGs inline locais em:

```txt
src/shared/components/Icon.tsx
```

## Restrições obrigatórias

Não alterar:

- lógica de gameplay;
- dados dos países;
- storage;
- schema de persistência sem necessidade;
- XP;
- domínio dos países;
- revisão;
- conquistas;
- loja;
- cosméticos;
- i18n;
- rotas existentes;
- PWA/offline.

Manter:

- acessibilidade;
- contraste;
- foco visível;
- reduced motion;
- alvos de toque confortáveis;
- responsividade mobile e desktop;
- testes funcionando.

## Implementação em fases

### Fase 1 — Fundação visual

Atualizar `src/index.css` com os tokens Terrain.

Criar ou adaptar tokens para:

- background;
- surface;
- surface-raised/surface-2;
- border/line;
- text/ink;
- muted/faint;
- primary/pine;
- accent/ocre;
- success;
- warning;
- danger;
- bronze;
- silver;
- gold;
- platinum;
- radius;
- shadows;
- focus ring;
- motion/reduced motion.

Preservar temas cosméticos existentes, adaptando-os quando necessário.

Não quebrar classes existentes.

### Fase 2 — Componentes base

Atualizar componentes compartilhados para o estilo Terrain:

- `Button.tsx`;
- `Card.tsx`;
- `PageShell.tsx` ou criar `AppShell.tsx`;
- `ProgressBar.tsx`.

Criar ou refinar componentes:

- `Chip`;
- `ScoreCard`;
- `Icon`;
- `DomainBadge`;
- `StatTile`, se fizer sentido;
- `SectionHeader`, se fizer sentido.

Evite mudanças quebradoras de API nos componentes existentes. Se mudar uma API, atualize todos os usos.

### Fase 3 — Ícones locais

Criar:

```txt
src/shared/components/Icon.tsx
```

com SVGs inline locais.

Implementar ícones principais:

- home;
- compass;
- globe;
- collection/layers;
- trophy;
- chart;
- shop;
- settings;
- play;
- flame;
- sparkles/xp;
- target;
- check;
- x;
- shield;
- gem;
- coin;
- search;
- lock;
- arrow;
- heart/lives.

Substituir emojis usados como ícones principais por esses ícones.

Emojis ainda podem aparecer em textos de flavor, compartilhamento, pequenas mensagens e conquistas, mas não devem ser a base visual da interface.

### Fase 4 — AppShell e navegação

Criar uma estrutura mais profissional para mobile e desktop.

Mobile:

- bottom navigation confortável;
- CTA principal preservado;
- navegação clara e tocável.

Desktop:

- sidebar, topbar ou layout amplo real;
- conteúdo com grids e seções;
- sem parecer mobile centralizado.

Também tratar o DebugConsole em `src/app/App.tsx`:

```tsx
{import.meta.env.DEV && <DebugConsole />}
```

ou remover do build de produção de forma equivalente.

### Fase 5 — Home / Dashboard

Redesenhar `HomePage` como dashboard de aprendizado.

Manter CTA principal:

```txt
Continuar treino
```

Mostrar de forma elegante:

- progresso geral;
- nível;
- XP;
- streak;
- precisão;
- países dominados/aprendidos;
- revisão do dia;
- missão diária;
- atalhos para coleção, estatísticas, loja e configurações.

Desktop deve usar grid real e melhor aproveitamento de largura.

Mobile deve continuar rápido, limpo e confortável.

### Fase 6 — TrainingPage

Redesenhar a tela de treino.

Prioridades:

- bandeira como protagonista;
- card da bandeira mais refinado;
- barra superior compacta com pergunta atual, progresso, streak, XP e vidas quando aplicável;
- alternativas com aparência profissional;
- estados claros e acessíveis.

Estados das alternativas:

- normal;
- hover/focus;
- selecionada;
- correta;
- errada;
- desabilitada/dimmed.

Feedback deve ser claro, acessível e menos exagerado.

Não alterar:

- regra de resposta;
- avanço automático;
- algoritmo da sessão;
- cálculo de XP;
- cálculo de progresso.

### Fase 7 — SessionResultPage

Redesenhar como scorecard profissional.

Mostrar em destaque:

- precisão;
- acertos;
- erros;
- melhor sequência;
- XP ganho;
- moedas ganhas;
- países promovidos;
- revisão recomendada.

CTAs:

- jogar de novo;
- revisar;
- compartilhar;
- voltar para home.

Não alterar os cálculos de resultado.

### Fase 8 — Coleção, Loja, Estatísticas, Conquistas e Configurações

Aplicar o design system Terrain nas demais páginas.

Coleção:

- deve parecer atlas/álbum de domínio;
- filtros por continente devem ser limpos;
- países devem ter cards ou linhas refinadas;
- domínio deve ser valorizado visualmente.

Badges de domínio:

- Reconhecido: bronze;
- Aprendido: prata;
- Dominado: ouro;
- Mestre: platina.

Loja:

- visual premium;
- menos “lista de emojis”;
- cards de cosméticos mais consistentes;
- estados comprado/equipado/bloqueado claros.

Estatísticas:

- scorecards;
- métricas legíveis;
- melhor hierarquia.

Conquistas:

- aparência de prêmios/insígnias reais;
- menos dependência de emoji como ícone principal.

Configurações:

- layout limpo;
- seções claras;
- inputs acessíveis.

## Ordem recomendada de execução

Para reduzir risco, implemente primeiro somente:

1. Fase 1 — Fundação visual;
2. Fase 2 — Componentes base;
3. Fase 3 — Ícones locais;
4. Fase 4 — AppShell/navegação.

Depois pare e entregue um resumo das mudanças.

Só avance para as páginas completas depois de validar a fundação.

## Validação obrigatória

Ao final de cada etapa grande, rode:

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Corrija todos os erros causados pela refatoração.

## Critérios de aceitação

A tarefa só está concluída quando:

- a UI parece mais profissional e autoral;
- a direção Terrain está aplicada de forma consistente;
- o app continua funcionando em mobile e desktop;
- o desktop tem layout próprio e bem aproveitado;
- emojis não são mais a base visual dos componentes principais;
- ícones são consistentes;
- badges de domínio parecem insígnias reais;
- treino mantém a bandeira como protagonista;
- resultado parece um scorecard profissional;
- loja parece premium;
- PWA/offline continua funcionando;
- nenhuma lógica de jogo foi alterada;
- todas as validações passam.

## Entrega esperada

Ao terminar cada fase, responda com:

1. arquivos alterados;
2. componentes criados;
3. principais decisões visuais;
4. qualquer adaptação feita em relação ao handoff;
5. resultado dos comandos de validação;
6. riscos ou pendências restantes.
