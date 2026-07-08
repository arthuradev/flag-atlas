# UI/UX Guide — Flaggo

## 1. Direção visual

Flaggo deve ser:

- amigável;
- casual;
- colorido na medida certa;
- arredondado;
- recompensador;
- confortável em mobile;
- inspirado na sensação do Duolingo, mas sem copiar sua identidade.

A fantasia visual é:

```txt
geografia casual + app moderno + exploração do mundo
```

## 2. O que não fazer

Não criar:

- UI corporativa fria;
- UI infantil demais;
- excesso de partículas;
- animações longas;
- telas piscando;
- linguagem técnica;
- muitos modos na Home;
- sistemas punitivos.

## 3. Componentes principais

### Botões

- Grandes o suficiente para toque no celular.
- Arredondados.
- Com estado hover/focus/pressed.
- CTA principal visualmente destacado.

### Cards

- Superfícies arredondadas.
- Boa sombra ou borda sutil.
- Espaçamento generoso.

### Bandeira

- Deve ser a protagonista da sessão.
- Exibir em tamanho grande.
- Usar contêiner estável para evitar layout shift.
- Preservar proporção.

### Alternativas

- 4 opções claras.
- Estados: default, selected, correct, wrong, disabled.
- Feedback acessível além da cor.

## 4. Onboarding sugerido

Três cards/telas curtas:

```txt
1. Bem-vindo ao Flaggo
Aprenda as bandeiras do mundo em treinos rápidos e divertidos.

2. Complete o mundo
Domine países, avance por continentes e acompanhe seu progresso.

3. Treine no seu ritmo
Sem pressão. Erre, revise e jogue mais uma quando quiser.

[Começar]
```

## 5. Home sugerida

```txt
🌍 Flaggo

Aprenda as bandeiras do mundo
em treinos rápidos e divertidos.

37/195 países aprendidos

[ Continuar treino ]

[ Continentes ] [ Coleção ] [ Configurações ]
```

## 6. Sessão sugerida

```txt
Pergunta 3/10     🔥 4     ⭐ +45 XP
[barra fina]

[ bandeira grande ]

[ Japão ]
[ China ]
[ Coreia do Sul ]
[ Vietnã ]
```

## 7. Feedback

### Acerto

- destacar alternativa correta;
- borda positiva;
- microanimação;
- som opcional;
- mostrar XP/evolução se houver.

### Erro

- destacar escolha do usuário;
- destacar resposta correta;
- explicar de forma calma;
- marcar revisão.

## 8. Tema

Implementar com CSS Variables.

Temas:

- claro;
- escuro;
- sistema se viável.

Tema claro deve ser alegre e limpo.

Tema escuro deve ser confortável, não preto absoluto em tudo.

## 9. Acessibilidade

- Contraste adequado.
- Focus visível.
- Navegação por teclado.
- Labels compreensíveis.
- Feedback não depender apenas de cor.
- Respeitar redução de movimento.
- Botões com área de toque confortável.

## 10. Microcopy

Usar linguagem humana:

- Continuar treino.
- Jogar mais uma.
- Coleção.
- Revisar erros.
- Aprendido.
- Dominado.
- Mestre.
- Quase!
- Boa!

Evitar:

- mastery score;
- algorithm;
- retention;
- adaptive session;
- failure.
