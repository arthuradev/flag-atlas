# Acceptance Criteria — V4.5 Mastery 2.0

## Domínio

- [x] `MAX_MASTERY_POINTS = 100`.
- [x] `masteryLevelForPoints` não concede Mestre só por pontos.
- [x] `deriveMasteryLevel` exige pontos altos e evidências reais.
- [x] Mestre não pode ser alcançado em uma única sessão.
- [x] Erros recentes impedem ou suspendem Mestre.
- [x] Digitação, revisão e bandeiras parecidas valem mais que múltipla escolha comum.

## Revisão

- [x] `nextReviewAt` existe em `CountryProgress`.
- [x] Erro agenda revisão para hoje.
- [x] Acerto agenda próxima revisão por intervalo simples.
- [x] Home/revisão consideram `needsReview` e `nextReviewAt <= hoje`.
- [x] Revisão vencida correta incrementa `successfulReviews`.

## Migração

- [x] Progresso legado `0–10` é convertido para `0–100`.
- [x] Legacy `10` não vira Mestre automaticamente.
- [x] Progresso moderno `masterySystemVersion: 2` não é reconvertido.
- [x] Campos novos ausentes recebem defaults seguros.
- [x] XP, conquistas, missões, sobrevivência, moedas e cosméticos são preservados.

## UI

- [x] Coleção exibe insígnias visuais.
- [x] Cada nível tem identidade: cinza, Bronze, Prata, Ouro e Platina.
- [x] Coleção mostra progresso `x/100` e revisão.
- [x] Feedback/resumo de sessão mostram promoção de insígnia.
- [x] Stats mostra contagens por Bronze/Prata/Ouro/Platina.
- [x] Stats mostra “Quase Platina” com motivo simples.

## Conquistas

- [x] `firstMastery` e `collector` continuam baseados em Ouro/Dominado.
- [x] `worldMaster` exige Mestre/Platina real.
- [x] Novas conquistas de Platina têm i18n e avaliação.
- [x] Conquistas antigas já desbloqueadas continuam persistidas.

## Qualidade

- [x] i18n pt-BR/en-US completo para textos novos.
- [x] Testes unitários cobrem escala, Mestre difícil, pontos, erros, revisão, migração, stats, coleção e conquistas.
- [x] V5 de cultura dos países não foi implementada.
- [x] `pnpm lint` passa.
- [x] `pnpm typecheck` passa.
- [x] `pnpm test` passa.
- [x] `pnpm build` passa.
- [x] `pnpm e2e` passa ou tem justificativa clara.
