# GSD — Game/System Design Document

## 1. Fantasia do jogador

O jogador não está apenas fazendo um quiz. Ele está completando o mundo.

Cada país dominado deve parecer uma pequena conquista.

## 2. Loop principal

```txt
Abrir app
→ Continuar treino
→ Ver bandeira
→ Escolher país
→ Receber feedback
→ Ganhar XP/progresso
→ Concluir sessão
→ Ver resumo
→ Jogar mais uma
```

## 3. Sessões

- Padrão: 10 perguntas.
- Opções: 5, 10, 20, 50.
- Uma pergunta por tela.
- 4 alternativas.
- Avanço automático.
- Feedback visual e sonoro opcional.

## 4. Feedback de resposta

### Acerto

Transmitir recompensa:

- borda positiva;
- leve animação;
- XP;
- streak;
- possível evolução de domínio.

Mensagem exemplo:

```txt
Boa!
Essa é a bandeira do Japão.
+15 XP
Japão: Aprendido → Dominado
```

### Erro

Ensinar sem punir:

```txt
Quase!
Essa era a bandeira do Chade.
Você escolheu Romênia.
```

Não usar linguagem agressiva como “você perdeu”.

## 5. Avanço automático

- Acerto: feedback curto, aproximadamente 1,2s.
- Erro: feedback um pouco mais longo, aproximadamente 2s.
- Permitir botão “Continuar” opcional para avançar antes.
- Com reduzir animações ativo, reduzir efeitos e transições.

## 6. HUD da sessão

Topo discreto:

- pergunta atual: `3/10`;
- barra fina de progresso;
- streak atual;
- XP da sessão, discreto.

A bandeira deve continuar sendo o foco.

## 7. Resumo final

A tela final deve ser emocionalmente satisfatória.

Mostrar:

- acertos;
- erros;
- melhor sequência;
- XP ganho;
- países que evoluíram;
- países para revisar;
- CTA “Jogar mais uma”;
- ação “Voltar ao início”.

Exemplo:

```txt
Sessão concluída!

✅ 8 acertos
❌ 2 erros
🔥 Melhor sequência: 5
⭐ +120 XP

Evoluíram:
🇯🇵 Japão — Aprendido → Dominado
🇧🇷 Brasil — Dominado → Mestre

Para revisar:
🇹🇩 Chade
🇷🇴 Romênia

[ Jogar mais uma ]
[ Voltar ao início ]
```

## 8. Gamificação do MVP

Entram:

- XP;
- níveis;
- streak dentro da sessão;
- domínio por país;
- progresso por continente;
- coleção;
- resumo final.

Ficam fora:

- conquistas;
- missões diárias;
- streak diário;
- moedas;
- loja.

## 9. Domínio público por país

Estados:

```txt
Novo
Reconhecido
Aprendido
Dominado
Mestre
```

O jogador deve ver nomes humanos, não termos técnicos.

## 10. Revisão no MVP

O MVP não terá revisão inteligente completa, mas deve marcar países errados para revisão e aumentar a chance deles voltarem no botão “Continuar treino”.

## 11. Continentes

O progresso por continente é parte central da sensação de completar o mundo.

Contagens oficiais do MVP:

- África: 54.
- América: 35.
- Ásia: 48.
- Europa: 44.
- Oceania: 14.

## 12. Coleção

A coleção é o álbum de bandeiras.

Deve reforçar a frase:

```txt
Estou completando o mundo.
```
