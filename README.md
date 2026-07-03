# Flag Atlas

**Flag Atlas** é uma PWA gamificada para aprender as bandeiras dos 195 países do mundo.

A experiência central é simples:

```txt
abrir → continuar treino → responder bandeiras → receber feedback → ver progresso → jogar de novo
```

O projeto deve ser:

- simples;
- bonito;
- acessível;
- responsivo;
- offline;
- gamificado;
- não punitivo;
- preparado para crescer.

## MVP

O MVP implementa:

- PWA para desktop e mobile;
- funcionamento offline desde o começo;
- 195 países;
- bandeiras SVG locais;
- pt-BR e en-US;
- onboarding inicial;
- Home com CTA principal “Continuar treino”;
- múltipla escolha com 4 alternativas;
- sessões configuráveis: 5, 10, 20 ou 50 perguntas;
- sessão padrão de 10 perguntas;
- treino por continente;
- coleção com busca e filtros;
- XP básico;
- nível básico;
- streak de sessão;
- domínio por país até Mestre;
- progresso por continente;
- feedback visual e sonoro opcional;
- animações sutis e opção de reduzir animações;
- tema claro, escuro e preferência do sistema se viável;
- progresso salvo localmente;
- reset de progresso com confirmação;
- testes de dados, lógica, fluxo principal e PWA/offline básico;
- GitHub Actions para GitHub Pages.

## Stack

- Vite
- React
- TypeScript
- pnpm
- Tailwind CSS
- CSS Variables
- Zustand
- i18next
- Motion
- Howler.js
- Vitest
- Playwright
- Biome

## Documentação

A fonte da verdade do projeto fica em `.specs/`.
