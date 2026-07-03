# SDD — Software Design Document

## 1. Visão geral

Flag Atlas é uma aplicação web/PWA para ensinar bandeiras dos 195 países do mundo por meio de sessões curtas, feedback imediato, progressão por país e coleção.

A proposta não é criar um quiz genérico. O objetivo é criar uma experiência de aprendizado leve, gostosa e colecionável.

## 2. Objetivos do MVP

O MVP deve provar que o ciclo principal é divertido:

```txt
abrir → jogar → responder → receber feedback → ver progresso → jogar de novo
```

## 3. Usuários-alvo

- Crianças.
- Jovens.
- Adultos.
- Idosos.
- Pessoas com pouca familiaridade tecnológica.
- Pessoas que gostam de geografia, bandeiras ou quizzes rápidos.

A linguagem deve ser clara e humana. Evitar termos técnicos na UI.

## 4. Requisitos funcionais

### 4.1 Onboarding

- Exibir onboarding curto na primeira abertura.
- Explicar o objetivo do jogo em linguagem amigável.
- Salvar conclusão localmente.

### 4.2 Home

- Mostrar progresso geral.
- Exibir CTA principal “Continuar treino”.
- Oferecer atalhos para Continentes, Coleção e Configurações.

### 4.3 Treino principal

- Criar sessão com uma pergunta por tela.
- Mostrar uma bandeira.
- Mostrar 4 alternativas.
- Receber resposta do usuário.
- Exibir feedback imediato.
- Avançar automaticamente.
- Gerar resumo final.

### 4.4 Treino por continente

- Permitir selecionar continente.
- Gerar sessão restrita ao continente escolhido.
- Usar a mesma mecânica principal de sessão.

### 4.5 Coleção

- Exibir todos os países do MVP.
- Mostrar domínio/status por país.
- Permitir busca e filtros.

### 4.6 Configurações

- Idioma.
- Tema.
- Sons.
- Volume.
- Reduzir animações.
- Tamanho da sessão.
- Resetar progresso.

### 4.7 Progresso local

Salvar localmente:

- XP total;
- nível;
- configurações;
- onboarding concluído;
- países vistos;
- acertos;
- erros;
- domínio por país;
- revisão pendente;
- progresso por continente.

## 5. Requisitos não funcionais

- Responsivo.
- Offline desde o MVP.
- Acessível.
- Performance boa em celular.
- Sem backend no MVP.
- Sem login no MVP.
- Dados e assets locais.
- Testável.
- Código modular.
- Documentação em português.
- Código em inglês.

## 6. Experiência visual

- Bandeira sempre como protagonista.
- Cards grandes e arredondados.
- Botões fáceis de tocar.
- Feedback claro.
- Animações curtas e sutis.
- Cores amigáveis.
- Evitar excesso de partículas ou efeitos cansativos.

## 7. Internacionalização

- Interface em pt-BR e en-US.
- Usar i18next.
- Evitar strings fixas nos componentes.
- Países devem ter nomes localizados.
- Aliases podem ser documentados/preparados para modo digitação futuro.

## 8. Persistência

MVP usa localStorage com validação e versionamento de schema.

Futuro pode migrar para IndexedDB.

## 9. Segurança

- Não usar eval.
- Não usar innerHTML com dados não confiáveis.
- Validar conteúdo do localStorage antes de carregar.
- Não depender de progresso local para competição.
- Não adicionar scripts externos desnecessários.

## 10. Limites do MVP

O MVP deve terminar com um app jogável, bonito, offline e validado, mas sem features futuras complexas.
