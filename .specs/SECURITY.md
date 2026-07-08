# Security — Flaggo MVP

## 1. Superfície de segurança

O MVP não tem backend, login, ranking ou pagamentos. Isso reduz risco, mas não elimina cuidados.

## 2. Regras obrigatórias

- Não usar `eval`.
- Não usar `new Function`.
- Não usar `innerHTML` para renderizar dados do usuário.
- Não carregar scripts externos desnecessários.
- Não depender de CDN para assets essenciais do app.
- Validar dados vindos do `localStorage`.
- Tratar progresso local como dado não confiável.
- Usar HTTPS no deploy.

## 3. SVGs

- Usar SVGs como arquivos estáticos via `img`.
- Não injetar SVG inline sem necessidade.
- Adicionar teste de padrões perigosos.

## 4. Storage

- Schema versionado.
- Parser seguro.
- Fallback para estado inicial se dados estiverem corrompidos.
- Reset com confirmação.

## 5. Dependências

- Evitar dependências desnecessárias.
- Manter lockfile.
- Preferir bibliotecas conhecidas.
- Não adicionar pacotes para tarefas simples que podem ser feitas com poucas funções.

## 6. Ranking futuro

Ranking global fica fora do MVP porque exigiria backend, autenticação e proteção contra fraude.
