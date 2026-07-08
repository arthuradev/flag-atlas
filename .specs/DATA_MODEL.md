# Data Model — Flaggo MVP

Este documento define modelos conceituais. A implementação pode ajustar nomes, mas deve preservar significado.

## Country

```ts
type Locale = "pt-BR" | "en-US";

type Country = {
  id: string;
  iso2: string;
  names: Record<Locale, string>;
  aliases?: Partial<Record<Locale, string[]>>;
  continentId: ContinentId;
  flagPath: string;
  slug: string;
};
```

## Continent

```ts
type Continent = {
  id: "america" | "europe" | "africa" | "asia" | "oceania";
  names: Record<Locale, string>;
  emoji?: string;
  order: number;
  countryIds: string[];
};
```

## MasteryLevel

```ts
type MasteryLevel =
  | "new"
  | "recognized"
  | "learned"
  | "dominated"
  | "master";
```

Nomes públicos em pt-BR:

```txt
new → Novo
recognized → Reconhecido
learned → Aprendido
dominated → Dominado
master → Mestre
```

## CountryProgress

```ts
type CountryProgress = {
  countryId: string;
  seenCount: number;
  correctCount: number;
  wrongCount: number;
  currentCorrectStreak: number;
  bestCorrectStreak: number;
  masteryPoints: number;
  masteryLevel: MasteryLevel;
  needsReview: boolean;
  lastSeenAt?: string;
  lastCorrectAt?: string;
  lastWrongAt?: string;
};
```

## UserProgress

```ts
type UserProgress = {
  schemaVersion: number;
  totalXp: number;
  level: number;
  countries: Record<string, CountryProgress>;
  completedSessions: number;
  lastPlayedAt?: string;
};
```

## Settings

```ts
type AppSettings = {
  locale: "pt-BR" | "en-US";
  theme: "light" | "dark" | "system";
  soundEnabled: boolean;
  volume: number;
  reduceMotion: boolean;
  defaultSessionSize: 5 | 10 | 20 | 50;
};
```

## Onboarding

```ts
type OnboardingState = {
  hasCompletedOnboarding: boolean;
};
```

## Session

```ts
type TrainingSession = {
  id: string;
  mode: "continue" | "continent";
  continentId?: ContinentId;
  questionIds: string[];
  currentIndex: number;
  answers: SessionAnswer[];
  startedAt: string;
};
```

## SessionAnswer

```ts
type SessionAnswer = {
  countryId: string;
  selectedCountryId: string;
  isCorrect: boolean;
  answeredAt: string;
  xpGained: number;
  masteryBefore: MasteryLevel;
  masteryAfter: MasteryLevel;
};
```

## XP sugerido

Implementação inicial simples:

```txt
+10 XP por acerto
+5 XP por evolução de domínio
+2 XP por resposta em streak >= 5
0 XP por erro
```

A fórmula pode ser ajustada, mas deve ser simples, testada e não punitiva.

## Domínio sugerido

Usar pontos internos:

```txt
0 pontos  → Novo
1–2       → Reconhecido
3–5       → Aprendido
6–8       → Dominado
9–10      → Mestre
```

Atualização sugerida:

- acerto: +1 ponto;
- erro único: não remove ponto, marca revisão;
- 2 erros recentes no mesmo país: -1 ponto;
- pontos limitados entre 0 e 10.

## Storage keys sugeridas

```txt
flag-atlas:settings
flag-atlas:progress
flag-atlas:onboarding
```

Todos os dados do storage devem ter schema versionado e validação.

## Versão 2 — Extensões

```ts
type QuestionType = "choice" | "typing";

type SessionMode = "continue" | "continent" | "review" | "similar";

type SessionConfig = {
  mode: SessionMode;
  questionType: QuestionType;
  continentId?: ContinentId;
  similarGroupId?: string;
  size: SessionSize;
};

// SessionQuestion: optionCountryIds ausente no modo digitação.
// SessionAnswer ganha campos opcionais:
//   selectedCountryId (múltipla escolha)
//   typedAnswer, normalizedTypedAnswer, acceptedAnswerUsed (digitação)

// CountryProgress ganha campo opcional, compatível com dados antigos (schema v1):
//   confusions?: Record<string, number>  // países com que esta bandeira foi confundida
```

O `PROGRESS_SCHEMA_VERSION` permanece 1: o campo novo é opcional e é
normalizado com segurança ao carregar; progresso antigo não é apagado.

## Versão 3 — Extensões

```ts
// UserProgress ganha campos novos, normalizados com defaults (schema segue v1):

type DailyStreak = {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate?: string; // YYYY-MM-DD local
  restDaysAvailable: number; // 0..1
};

type SurvivalStats = {
  bestScore: number;
  bestStreak: number;
  sessionsCompleted: number;
};

// UserProgress += {
//   achievementsUnlocked: Record<string, string>;  // id da conquista → data ISO
//   dailyStreak: DailyStreak;
//   survival: SurvivalStats;
// }
```

### Missões diárias (chave própria)

```ts
type DailyMission = {
  id: string; // "<YYYY-MM-DD>:<tipo>"
  type: DailyMissionType;
  target: number;
  progress: number;
  completed: boolean;
  completedAt?: string;
  rewardXp: number;
};

type DailyMissionsState = {
  date: string; // dia local YYYY-MM-DD
  missions: DailyMission[];
};
```

Storage key nova: `flag-atlas:daily-missions` (envelope versionado próprio,
`MISSIONS_SCHEMA_VERSION = 1`). Dados corrompidos regeneram as missões do dia.

### Conquistas

O catálogo (`achievement.catalog.ts`) é código, não storage: só o mapa
`achievementsUnlocked` (id → data de desbloqueio) é persistido no progresso.
Conquistas derivadas (países vistos, domínio, continentes) são reavaliadas a
cada resposta; conquistas de evento (sessão perfeita, modos, sobrevivência)
são avaliadas ao concluir sessão e dependem do registro persistido.

### Compatibilidade

Progresso V1/V2 carrega com defaults: `achievementsUnlocked = {}`,
`dailyStreak = { 0, 0, restDaysAvailable: 1 }`, `survival = { 0, 0, 0 }`.
Nenhum dado antigo é descartado; `PROGRESS_SCHEMA_VERSION` permanece 1.

## Versão 4 — Extensões (cosméticos)

```ts
type CosmeticType = "theme" | "soundPack" | "flagFrame" | "mascot" | "visualEffect";

type CosmeticItem = {
  id: string;
  type: CosmeticType;
  nameKey: string;
  descriptionKey: string;
  price: number; // em Moedas Atlas; 0 = gratuito (sempre possuído)
  rarity?: "common" | "rare" | "epic" | "legendary";
  preview?: string; // emoji para preview simples
  isDefault?: boolean; // item padrão equipado do tipo; nunca vendável
};

type CosmeticInventory = {
  coins: number; // Moedas Atlas, nunca negativo
  ownedItemIds: string[]; // itens comprados (gratuitos não precisam constar)
  equipped: {
    themeId: string;
    soundPackId: string;
    flagFrameId: string;
    mascotId: string;
    visualEffectId: string;
  };
};

// UserProgress += {
//   cosmetics: CosmeticInventory;
// }
```

O **catálogo** (`cosmetic.catalog.ts`) é código, não storage: só o `cosmetics`
(moedas, itens possuídos e equipados) é persistido no progresso.

### Moedas Atlas

Locais, cosméticas e sem valor real. Concedidas ao concluir sessões (+10, +5 de
bônus por sessão perfeita), missões (+15), conquistas (+25) e sobrevivência
(pelo score, com teto). Cada recompensa é concedida na transição de
conclusão/desbloqueio, garantindo pagamento único. Não alteram dificuldade, XP
real, domínio nem vantagem.

### Tema × settings.theme

`settings.theme` (light/dark/system) continua controlando o **modo claro/escuro**.
O tema cosmético `Padrão` (`theme-default`) segue essa preferência; temas
especiais definem paleta própria (ignoram claro/escuro). Não há duplicação de
estado nem migração destrutiva — o `settings.theme` antigo é preservado.

### Compatibilidade

Progresso V1/V2/V3 sem `cosmetics` carrega com defaults seguros
(`coins = 0`, `ownedItemIds = []`, equipados no padrão de cada tipo). Moedas
inválidas viram 0, itens desconhecidos são descartados e itens equipados
inválidos/não possuídos voltam ao padrão. `PROGRESS_SCHEMA_VERSION` permanece 1.

## Versão 4.5 — Mastery 2.0 e insígnias

O domínio por país usa escala interna `0–100` (`MAX_MASTERY_POINTS = 100`).
Os níveis públicos permanecem:

```txt
new → Novo / sem insígnia
recognized → Reconhecido / Bronze
learned → Aprendido / Prata
dominated → Dominado / Ouro
master → Mestre / Platina
```

Faixas por pontos:

```txt
0      → Novo
1–19   → Reconhecido / Bronze
20–49  → Aprendido / Prata
50–100 → Dominado / Ouro, ou candidato a Mestre
```

`Mestre` não é derivado apenas de pontos. A função final de domínio considera
evidência real:

```txt
masteryPoints >= 85
correctCount >= 20
precisão do país >= 80%
acertos em pelo menos 3 dias locais diferentes
typedCorrectCount >= 2
reviewCorrectCount >= 2 ou successfulReviews >= 2
needsReview = false
sem erro recente pendente
```

`CountryProgress` ganha campos opcionais normalizados:

```ts
type CountryProgress += {
  masterySystemVersion?: 2;
  correctDateKeys?: string[]; // YYYY-MM-DD local, únicos, limitados aos 30 mais recentes
  typedCorrectCount?: number;
  choiceCorrectCount?: number;
  reviewCorrectCount?: number;
  similarCorrectCount?: number;
  survivalCorrectCount?: number;
  successfulReviews?: number;
  lastPromotionAt?: string;
  nextReviewAt?: string; // YYYY-MM-DD local
  lastMasteryMode?: SessionMode;
  lastMasteryQuestionType?: QuestionType;
};
```

Revisão espaçada simples:

- erro: `needsReview = true` e `nextReviewAt = hoje`;
- acerto Reconhecido: próxima revisão em 1 dia;
- acerto Aprendido: próxima revisão em 3 dias;
- acerto Dominado: próxima revisão em 7 dias;
- acerto Mestre: próxima revisão em 14 dias.

Compatibilidade:

- `PROGRESS_SCHEMA_VERSION` permanece 1;
- país sem `masterySystemVersion` é tratado como legado `0–10`;
- legacy `10` vira `80` pontos, nível `Dominado`, nunca `Mestre`;
- legacy `8` vira `65`, legacy `5` vira `40`, legacy `2` vira `15`;
- campos novos ausentes recebem defaults seguros;
- progresso moderno `masterySystemVersion: 2` não é reconvertido.
