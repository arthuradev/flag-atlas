# Data Model — Flag Atlas MVP

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
