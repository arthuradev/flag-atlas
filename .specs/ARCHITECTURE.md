# Architecture — Flaggo

## 1. Tipo de arquitetura

Use um **monólito modular frontend**.

O projeto é uma PWA estática sem backend no MVP.

## 2. Princípio principal

A lógica de jogo deve ser separada da UI.

Componentes React não devem conter regras complexas de:

- seleção de países;
- geração de alternativas;
- cálculo de XP;
- evolução de domínio;
- persistência;
- validação de progresso.

## 3. Estrutura recomendada

```txt
src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  pages/
    OnboardingPage/
    HomePage/
    TrainingPage/
    SessionResultPage/
    ContinentsPage/
    ContinentPage/
    CollectionPage/
    SettingsPage/
  features/
    training/
      components/
      logic/
      store/
    collection/
      components/
      logic/
    settings/
    progress/
    onboarding/
  entities/
    country/
      country.types.ts
      country.selectors.ts
    continent/
    progress/
    session/
  shared/
    components/
    data/
    i18n/
    storage/
    audio/
    motion/
    theme/
    utils/
    test/
```

## 4. Estado

Use Zustand para estado global necessário:

- progresso do usuário;
- configurações;
- sessão ativa;
- estado de áudio/tema/idioma.

Evite colocar tudo em uma store única gigante. Separe por domínio quando fizer sentido.

## 5. Dados

Os dados dos países e continentes devem ser dados estáticos importáveis.

Recomendações:

```txt
src/shared/data/countries.ts
src/shared/data/continents.ts
src/shared/data/extras.ts
```

O schema pode ser adaptado do ZIP original.

## 6. Storage

Implementar wrapper de storage:

```txt
src/shared/storage/
  storageKeys.ts
  storageSchema.ts
  localStorageClient.ts
  progressRepository.ts
```

Requisitos:

- schema versionado;
- validação ao carregar;
- fallback seguro para estado inicial;
- reset explícito.

## 7. i18n

Usar i18next.

Estrutura sugerida:

```txt
src/shared/i18n/
  index.ts
  locales/
    pt-BR.json
    en-US.json
```

Os nomes de países podem ficar no dataset, mas a interface deve usar arquivos de tradução.

## 8. Tema

Usar Tailwind CSS + CSS Variables.

Tokens sugeridos:

- background;
- surface;
- surface-raised;
- text;
- text-muted;
- primary;
- primary-foreground;
- success;
- warning;
- danger;
- border;
- ring;
- progress.

## 9. Animação

Usar Motion para microinterações.

Todas as animações devem respeitar:

- configuração de reduzir animações;
- `prefers-reduced-motion` quando possível.

## 10. Áudio

Usar Howler.js.

Sons do MVP:

- click;
- success;
- error;
- session complete.

Deve haver:

- toggle de sons;
- volume;
- modo silencioso efetivo.

## 11. PWA

Configurar PWA/offline desde o MVP.

Requisitos:

- manifest;
- service worker;
- app carregando offline após primeiro carregamento;
- cache dos assets essenciais;
- cache das bandeiras do MVP;
- teste smoke de offline.

Pode usar plugin Vite PWA se for a solução mais simples e estável.

## 12. Roteamento

Usar HashRouter no MVP.

Motivo: compatibilidade simples com GitHub Pages.

## 13. Testabilidade

Criar funções puras para:

- seleção de sessão;
- geração de alternativas;
- cálculo de XP;
- atualização de domínio;
- cálculo de progresso;
- validação de dados;
- normalização de schema local.

Essas funções devem ter testes unitários.
