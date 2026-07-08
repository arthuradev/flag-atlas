# Flag Atlas — Pacote de Marca (V3 Final)

Sistema de identidade em duas peças: **Orbi** (mascote) e **Bandeira-Mundo** (símbolo).

## Arquivos

### SVG (vetorial, escalável, editável)
| Arquivo | Uso |
|---|---|
| `orbi.svg` | Mascote completo (com pés). Onboarding, marketing, prêmios. |
| `symbol.svg` | Símbolo Bandeira-Mundo (com detalhes). Ícone, selo, institucional. |
| `favicon.svg` | Símbolo simplificado. Favicon e usos ≤ 48 px. |
| `app-icon.svg` | Ícone do app 1024 px (Orbi em squircle marinho). |
| `logo-horizontal.svg` | Mascote + wordmark lado a lado. Cabeçalho, navegação. |
| `logo-vertical.svg` | Mascote acima do wordmark. Abertura, materiais. |
| `wordmark.svg` | Só o texto "Flag Atlas". |

### PNG (rasterizado, alta resolução, fundo transparente)
`png/app-icon-1024.png` · `png/orbi-512.png` · `png/symbol-512.png` · `png/favicon-64.png` · `png/favicon-32.png` · `png/favicon-16.png`

## Paleta
| Nome | HEX | Papel |
|---|---|---|
| Aqua Viva | `#17B4C9` | Cor da marca / base |
| Teal Profundo | `#0E8CA1` | Apoio, texto sobre claro, links |
| Azul Atlas | `#12303B` | Tinta: contornos e texto |
| Sol | `#FFC53D` | Destaque (XP, brilho) |
| Coral Bandeira | `#FF6F61` | Bandeira e detalhes quentes |
| Folha | `#2FB98A` | Terra (uso secundário) |
| Ardósia | `#5A7480` | Texto secundário |
| Névoa | `#EAF6F8` | Fundo claro |

## Tipografia
- **Fredoka** SemiBold (600) — wordmark, títulos, display.
- **Figtree** — texto de UI e corpo.

## Regras rápidas
- **Área de respiro:** margem mínima = metade da altura do globo.
- **Tamanho mínimo:** símbolo até 16 px; wordmark até 18 px de altura.
- **Abaixo de 48 px** use `favicon.svg` (sem rosto, pés ou continentes) — nunca o mascote encolhido.
- **Não** deforme, gire ou aplique sombras pesadas na marca.
- **Qual versão:** mascote = tamanhos grandes; símbolo = tamanhos pequenos + favicon.

## Nota sobre os logos com texto
`logo-*.svg` e `wordmark.svg` usam a fonte **Fredoka** via `@import`. Ao abrir como imagem estática, alguns programas não carregam a webfont — nesse caso instale a Fredoka ou converta o texto em contornos (Path > Object to Path) no editor vetorial. Os ícones (`orbi`, `symbol`, `favicon`, `app-icon`) são 100% vetor puro e não dependem de fonte.
