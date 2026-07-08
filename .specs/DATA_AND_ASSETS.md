# Data and Assets — Flaggo

## 1. Fonte oficial do MVP

O pacote oficial de dados/assets está em:

```txt
_inputs/flag-atlas-data-assets.zip
```

Esse arquivo deve ser extraído e usado como insumo para o projeto final.

Ele não é a estrutura do app.

## 2. Conteúdo esperado do ZIP

O ZIP contém:

```txt
public/flags/mvp/       195 SVGs do MVP
public/flags/extras/    59 SVGs extras/territórios
src/data/countries.*    JSON, TS e CSV dos países
src/data/continents.*   JSON e TS dos continentes
src/data/extras.*       dados extras
src/data/manifest.json  manifesto dos dados
reports/                relatório de validação
docs/                   fonte e atribuição
```

Contagens esperadas:

- 195 países do MVP;
- 5 continentes;
- 195 SVGs do MVP;
- 59 SVGs extras;
- 254 SVGs totais.

## 3. Importação recomendada

Copiar para o projeto:

```txt
public/flags/
src/shared/data/
docs/attribution/
```

Ou manter `src/data`, desde que a arquitetura permaneça clara.

## 4. Schema atual observado

Exemplo do pacote original:

```ts
{
  id: "br",
  iso2: "BR",
  name: {
    ptBR: "Brasil",
    en: "Brazil"
  },
  continentId: "america",
  flag: "/flags/mvp/br.svg",
  slug: "brasil"
}
```

## 5. Schema recomendado para o app

Adaptar para algo mais alinhado ao i18n:

```ts
export type Locale = "pt-BR" | "en-US";

export type Country = {
  id: string;
  iso2: string;
  names: Record<Locale, string>;
  aliases?: Partial<Record<Locale, string[]>>;
  continentId: ContinentId;
  flagPath: string;
  slug: string;
};
```

Não é obrigatório manter exatamente esse shape, mas o app deve ter nomes em `pt-BR` e `en-US` de forma clara.

## 6. Nomes públicos amigáveis

Usar nomes comuns/amigáveis na UI.

Exemplos:

- Vaticano, não “Vaticano ou Santa Sé”.
- Palestina, não nomenclatura excessivamente formal.
- Estados Unidos.
- Reino Unido.
- Coreia do Sul.
- Coreia do Norte.
- República Tcheca.
- Turquia.

Nomes formais e variações devem ficar como aliases internos, úteis para futuro modo digitação.

## 7. Continentes

Usar os continentes do dataset MVP:

```txt
america: 35
europe: 44
africa: 54
asia: 48
oceania: 14
```

Países transcontinentais devem manter a classificação única do dataset no MVP.

## 8. Validações obrigatórias

Criar testes para garantir:

- existem exatamente 195 países no MVP;
- existem exatamente 5 continentes;
- cada país tem id único;
- cada país tem iso2;
- cada país tem nome em pt-BR;
- cada país tem nome em en-US;
- cada país tem continente válido;
- cada país tem flagPath;
- cada flagPath aponta para SVG existente;
- a resposta correta sempre aparece nas alternativas;
- alternativas não se repetem;
- nenhum SVG do MVP está ausente.

## 9. Segurança de SVG

SVGs devem ser usados como assets estáticos, preferencialmente via `<img src="...">`.

Não injetar SVG como HTML.

Criar checagens simples para detectar padrões proibidos em SVGs locais:

- `<script`;
- `javascript:`;
- `onload=`;
- `onerror=`;
- `foreignObject`.

## 10. Atribuição

Preservar a documentação de fonte/atribuição incluída no pacote de dados.

A UI pode incluir créditos em uma tela “Sobre” futura, mas no MVP deve pelo menos manter atribuição no README/documentação.
