# Mastery 2.0 — Flag Atlas V4.5

Mastery 2.0 torna o domínio por país mais raro, justo e colecionável.

## Insígnias

| Nível público | Insígnia | Pontos | Requisitos extras |
| --- | --- | ---: | --- |
| Novo | Sem insígnia | 0 | País nunca visto ou progresso inexistente. |
| Reconhecido | Bronze | 1–19 | Primeiros acertos. |
| Aprendido | Prata | 20–49 | Histórico inicial consistente. |
| Dominado | Ouro | 50–100 | Bom domínio, mas sem todos os requisitos de Platina. |
| Mestre | Platina | 85–100 | 20 acertos, 80% de precisão, 3 dias com acerto, 2 acertos por digitação, 2 revisões bem-sucedidas, sem revisão pendente e sem erro recente. |

Pontos sozinhos nunca concedem Mestre. `masteryLevelForPoints` calcula a faixa
por pontos, e `deriveMasteryLevel` decide o nível final.

## Ganho e perda de pontos

| Evento | Pontos |
| --- | ---: |
| Acerto por múltipla escolha comum | +2 |
| Acerto por digitação | +4 |
| Acerto em revisão | +5 |
| Acerto em bandeiras parecidas | +4 |
| Acerto em sobrevivência | +2 |
| Bônus por revisão vencida correta | +3 |
| Erro em Novo | 0 |
| Erro em Reconhecido | -1 |
| Erro em Aprendido | -2 |
| Erro em Dominado | -4 |
| Erro em Mestre | -8 |

Dois erros recentes adicionam mais 1 ponto de perda. Pontos sempre ficam entre
0 e 100.

## Revisão espaçada simples

| Resultado | `needsReview` | `nextReviewAt` |
| --- | --- | --- |
| Erro | `true` | hoje |
| Acerto Reconhecido | `false` | +1 dia |
| Acerto Aprendido | `false` | +3 dias |
| Acerto Dominado | `false` | +7 dias |
| Acerto Mestre | `false` | +14 dias |

Home, coleção, stats e modo revisão consideram revisão pendente quando
`needsReview = true` ou `nextReviewAt <= hoje`.

## Migração

Países sem `masterySystemVersion` são legados `0–10`:

| Legado | V4.5 |
| ---: | ---: |
| 0 | 0 |
| 1 | 8 |
| 2 | 15 |
| 3 | 25 |
| 4 | 32 |
| 5 | 40 |
| 6 | 55 |
| 7 | 60 |
| 8 | 65 |
| 9 | 75 |
| 10 | 80 |

Isso preserva avanço sem transformar Mestre antigo em Platina automática.
`PROGRESS_SCHEMA_VERSION` permanece 1; a marca de versão fica por país em
`masterySystemVersion: 2`.

## Fora do escopo

V4.5 não implementa cultura dos países, backend, ranking, login ou vantagem de
cosméticos. Cultura fica para a Versão 5.
