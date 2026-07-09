# Flaggo — Pacote de Marca

Sistema de identidade em duas peças: **Orbi** (mascote) e o **planeta-o** do wordmark.

## Arquivos

### SVG (vetorial, escalável, editável)
| Arquivo | Uso |
|---|---|
| `orbi.svg` | Mascote completo (com pés). Onboarding, marketing, prêmios. |
| `symbol.svg` | Símbolo Bandeira-Mundo (com detalhes). Selo, institucional. |
| `favicon.svg` | Símbolo simplificado. Favicon e usos <= 48 px. |
| `app-icon.svg` | Ícone do app 1024 px (Orbi em squircle marinho). |
| `logo-horizontal.svg` | Mascote + wordmark "Flaggo" lado a lado. |
| `logo-vertical.svg` | Mascote acima do wordmark "Flaggo". |
| `wordmark.svg` | O texto "Flagg" com o planeta-o de anel dourado. |

No app, o wordmark oficial é o componente React `src/shared/brand/FlaggoLogo.tsx`
(texto via `currentColor` + planeta com cores fixas de marca); os SVGs estáticos
existem para materiais externos.

### PNG (rasterizado, alta resolução, fundo transparente)
`png/app-icon-1024.png` · `png/orbi-512.png` · `png/symbol-512.png` · `png/favicon-64.png` · `png/favicon-32.png` · `png/favicon-16.png`

## Paleta (tokens do design final em `src/index.css`)
| Nome | HEX (claro) | Papel |
|---|---|---|
| Turquesa Flaggo | `#0C97AD` | Primária (CTA, item ativo) |
| Turquesa Viva | `#12C2D6` | Ring/realce; primária no escuro |
| Marinho | `#0F2A44` | Texto, sidebar |
| Dourado XP | `#F5A836` | XP, meta diária, anel do planeta-o |
| Ouro Moeda | `#E7A81E` | Moedas Flaggo |
| Coral | `#FF6F5C` | Sequência, erro |
| Verde | `#22B07A` | Sucesso |
| Névoa | `#EAF2F8` | Fundo claro |
| Noite | `#0A1E33` | Fundo escuro |

## Tipografia
- **Nunito** (variable) — todo o produto, do wordmark ao corpo.

## Regras rápidas
- **Área de respiro:** margem mínima = metade da altura do globo.
- **Tamanho mínimo:** símbolo até 16 px; wordmark até 18 px de altura.
- **Abaixo de 48 px** use `favicon.svg` — nunca o mascote encolhido.
- **Não** deforme, gire ou aplique sombras pesadas na marca.
- O leitor deve sempre ler "Flaggo": o planeta-o é a letra final, não um enfeite.
