# Architecture Constitution — Flag Atlas

Estas regras devem guiar decisões técnicas futuras.

## Artigo 1 — Simplicidade do MVP

O MVP deve ser pequeno, jogável e sólido.

Não implementar sistemas futuros complexos antes de validar o ciclo principal.

## Artigo 2 — Offline-first

O app deve funcionar offline desde o começo.

Bandeiras, dados essenciais, traduções e UI principal devem estar disponíveis localmente.

## Artigo 3 — Domínio separado da UI

A lógica de jogo deve ser testável sem React.

## Artigo 4 — UX humana

A interface não deve mostrar termos técnicos como “mastery score”, “retention algorithm” ou “adaptive scheduling”.

Use linguagem como:

- Continuar treino;
- Aprendido;
- Dominado;
- Revisar erros;
- Coleção;
- Progresso;
- Jogar mais uma.

## Artigo 5 — Sem punição agressiva

Erros devem ensinar.

Não usar mecânicas punitivas como vidas, bloqueios ou mensagens de fracasso no MVP.

## Artigo 6 — Dados confiáveis

O dataset de países e bandeiras é parte crítica do produto.

Deve haver testes para garantir integridade.

## Artigo 7 — Expansível sem inflar

A arquitetura deve permitir futuras features, mas não deve implementá-las antes da hora.

## Artigo 8 — Acessibilidade

O app deve ser confortável para mobile, teclado, leitores de tela básicos e pessoas sensíveis a movimento.

## Artigo 9 — Build sempre saudável

Não avançar fases com lint, typecheck, testes ou build quebrados.

## Artigo 10 — Commits pequenos

Usar Conventional Commits e commits reversíveis.
