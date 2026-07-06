Você está trabalhando no projeto `flag-atlas`, um app Vite + React + TypeScript + Capacitor/PWA.

Objetivo: remover completamente o sistema atual de mascotes do jogo. Esse sistema será refeito futuramente do zero, então ele não deve continuar aparecendo na UI, na Loja, nos tipos de cosméticos, no catálogo, nos testes ou nas traduções.

## Contexto técnico atual

O sistema atual de mascotes está integrado como um tipo de cosmético chamado `mascot`. Ele aparece em:

- `src/entities/cosmetic/cosmetic.types.ts`
- `src/entities/cosmetic/cosmetic.catalog.ts`
- `src/entities/cosmetic/cosmetic.selectors.ts`
- `src/features/cosmetics/components/Mascot.tsx`
- `src/features/cosmetics/logic/mascots.ts`
- `src/features/cosmetics/components/CosmeticItemCard.tsx`
- `src/pages/HomePage/HomePage.tsx`
- `src/pages/SessionResultPage/SessionResultPage.tsx`
- `src/shared/components/Icon.tsx`
- `src/shared/i18n/locales/pt-BR.json`
- `src/shared/i18n/locales/en-US.json`
- `src/entities/cosmetic/cosmetic.selectors.test.ts`
- `src/features/cosmetics/logic/cosmeticVisuals.test.ts`
- `src/shared/storage/storageSchema.test.ts`

## Tarefa principal

Remova por completo o sistema de mascotes atual, mantendo intactos os outros sistemas de cosméticos:

- Temas
- Sons
- Molduras de bandeira
- Efeitos visuais
- Moedas Atlas
- Compra/equipar cosméticos restantes
- Loja
- Progresso/localStorage
- PWA/Capacitor

Não remova ou quebre esses sistemas.

---

## Mudanças esperadas

### 1. Remover `mascot` dos tipos de cosmético

Arquivo provável:

`src/entities/cosmetic/cosmetic.types.ts`

Remover `"mascot"` de `COSMETIC_TYPES`.

Atualizar `CosmeticType` automaticamente a partir disso.

Remover `mascotId` de `CosmeticEquipped`.

Remover o default:

```ts
mascot: "mascot-none"
````

de `DEFAULT_COSMETIC_IDS`.

Remover o mapeamento:

```ts
mascot: "mascotId"
```

de `EQUIPPED_KEY_BY_TYPE`.

Remover `mascotId` de `createInitialCosmeticEquipped()`.

Depois dessa alteração, o inventário deve continuar tendo:

```ts
{
  themeId: string;
  soundPackId: string;
  flagFrameId: string;
  visualEffectId: string;
}
```

sem `mascotId`.

### 2. Remover os itens de mascote do catálogo

Arquivo provável:

`src/entities/cosmetic/cosmetic.catalog.ts`

Remover completamente o array `MASCOTS`.

Remover estes itens do catálogo:

* `mascot-none`
* `mascot-globe`
* `mascot-compass`
* `mascot-owl`
* `mascot-rocket`

Remover `...MASCOTS` de `COSMETIC_CATALOG`.

O catálogo final deve continuar incluindo:

```ts
...THEMES,
...SOUND_PACKS,
...FLAG_FRAMES,
...VISUAL_EFFECTS,
```

### 3. Remover componente e lógica de mascotes

Remover os arquivos, se não forem mais usados:

```txt
src/features/cosmetics/components/Mascot.tsx
src/features/cosmetics/logic/mascots.ts
```

Também remover qualquer import desses arquivos.

### 4. Remover mascote da Home

Arquivo provável:

`src/pages/HomePage/HomePage.tsx`

Remover:

```ts
import { Mascot } from "@/features/cosmetics/components/Mascot";
```

Remover o JSX:

```tsx
<Mascot size="md" className="mt-2" />
```

Não alterar a estrutura principal da Home além disso.

### 5. Remover mascote do resultado da sessão

Arquivo provável:

`src/pages/SessionResultPage/SessionResultPage.tsx`

Remover:

```ts
import { Mascot } from "@/features/cosmetics/components/Mascot";
```

Remover o JSX:

```tsx
<Mascot size="sm" className="ml-2 align-middle" />
```

Não alterar a lógica da tela de resultado.

### 6. Atualizar a Loja

Arquivo provável:

`src/pages/ShopPage/ShopPage.tsx`

Como a Loja renderiza categorias com `COSMETIC_TYPES.map(...)`, remover `mascot` de `COSMETIC_TYPES` já deve fazer a seção de mascotes desaparecer automaticamente.

Mesmo assim, verifique se não sobrou nenhuma referência visual ou textual a mascotes na Loja.

Arquivo provável:

`src/features/cosmetics/components/CosmeticItemCard.tsx`

Remover lógica especial para `item.type === "mascot"`.

Atualmente existe uma diferença de borda/preview para mascotes:

```tsx
item.type === "mascot" ? "rounded-full" : "rounded-xl"
```

Como `mascot` deixará de existir, simplifique para uma classe única, provavelmente:

```tsx
rounded-xl
```

### 7. Atualizar traduções PT-BR e EN-US

Arquivos:

```txt
src/shared/i18n/locales/pt-BR.json
src/shared/i18n/locales/en-US.json
```

Remover a categoria:

```json
"mascot": "Mascotes"
```

e em inglês:

```json
"mascot": "Mascots"
```

Remover os itens:

```json
"mascot-none"
"mascot-globe"
"mascot-compass"
"mascot-owl"
"mascot-rocket"
```

Atualizar textos que mencionam mascotes.

Em PT-BR, trocar:

```txt
Temas, sons, molduras, mascotes e efeitos ficam na Loja.
```

por algo como:

```txt
Temas, sons, molduras e efeitos ficam na Loja.
```

Em EN-US, trocar:

```txt
Themes, sounds, frames, mascots and effects live in the Shop.
```

por algo como:

```txt
Themes, sounds, frames and effects live in the Shop.
```

Manter JSON válido.

### 8. Atualizar ícones

Arquivo provável:

`src/shared/components/Icon.tsx`

Remover referências específicas a mascotes no comentário principal, se houver.

Remover do tipo `IconName` os ícones que só existiam para mascotes, caso não sejam usados em outro lugar:

```ts
"owl"
"rocket"
```

Remover os cases correspondentes no `IconPaths`:

```ts
case "owl":
case "rocket":
```

Importante: não remover `ban`, porque ele ainda é usado por `effect-none`.

Importante: não remover `globe` nem `compass`, porque são usados em outras partes do app.

Antes de remover qualquer ícone, confirme com busca no projeto inteiro se ele não é usado em outro lugar.

### 9. Atualizar testes

Atualize todos os testes quebrados pela remoção dos mascotes.

Arquivos prováveis:

```txt
src/entities/cosmetic/cosmetic.selectors.test.ts
src/features/cosmetics/logic/cosmeticVisuals.test.ts
src/shared/storage/storageSchema.test.ts
```

Mudanças esperadas:

#### `cosmetic.selectors.test.ts`

Remover testes que compram/equipam mascotes, por exemplo:

```ts
ownedItemIds: ["mascot-globe"]
equipCosmetic(start, "mascot-globe")
```

Substituir por outro cosmético existente, se o teste for sobre regra genérica de equipar/comprar.

Exemplo: usar `theme-oceano`, `frame-neon`, `sound-silent` ou `effect-glow`, conforme o caso.

Remover expectativa:

```ts
expect(equipped.mascot.id).toBe("mascot-none");
```

O objeto `getEquippedCosmetics(...)` não deve mais ter chave `mascot`.

#### `cosmeticVisuals.test.ts`

Remover import:

```ts
import { mascotIcon } from "./mascots";
```

Remover o bloco:

```ts
describe("mascots", ...)
```

#### `storageSchema.test.ts`

Remover expectativas com:

```ts
result.cosmetics.equipped.mascotId
```

Atualizar testes de sanitização para garantir compatibilidade com dados antigos.

Importante: dados antigos de localStorage podem conter:

```ts
ownedItemIds: ["mascot-owl"]
equipped: { mascotId: "mascot-owl" }
```

Depois da remoção, esses dados antigos devem ser ignorados sem quebrar.

Adicione ou ajuste um teste para validar que o normalizador descarta IDs antigos de mascote:

```ts
const result = normalizeUserProgress({
  countries: {},
  cosmetics: {
    coins: 50,
    ownedItemIds: ["mascot-owl", "theme-oceano"],
    equipped: { mascotId: "mascot-owl", themeId: "theme-oceano" },
  },
});

expect(result.cosmetics.ownedItemIds).toEqual(["theme-oceano"]);
expect(result.cosmetics.equipped.themeId).toBe("theme-oceano");
expect("mascotId" in result.cosmetics.equipped).toBe(false);
```

A ideia é: progresso antigo com mascote não pode quebrar o app, mas o sistema removido não deve continuar existindo em runtime.

### 10. Compatibilidade com storage antigo

Não crie uma migração complexa.

A função `normalizeCosmeticInventory` já filtra itens desconhecidos via catálogo. Depois que os mascotes forem removidos do catálogo, IDs como `mascot-owl` devem cair automaticamente.

Garanta que:

* `ownedItemIds` antigos de mascote sejam descartados
* `equipped.mascotId` antigo seja ignorado
* nenhum objeto novo de `equipped` tenha `mascotId`
* app antigo com mascote salvo no localStorage carregue normalmente

### 11. Busca final obrigatória

Depois das alterações, rode uma busca no projeto.

Em `src`, não deve sobrar referência a:

```txt
mascot
Mascot
mascote
Mascotes
mascot-
```

Use algo como:

```bash
rg -n "mascot|Mascot|mascote|Mascotes|mascot-" src
```

O resultado esperado em `src` deve ser vazio.

Observação: referências antigas em `docs/design/*.html` podem existir por serem handoffs/design docs gerados anteriormente. Não precisa editar HTML gigante de documentação estática, a menos que seja simples e seguro. O foco é remover o sistema ativo do app e dos testes.

### 12. Não alterar coisas fora do escopo

Não refatorar o sistema de cosméticos inteiro.

Não remover Loja.

Não remover moedas.

Não remover temas.

Não remover sons.

Não remover molduras.

Não remover efeitos visuais.

Não alterar comportamento de treino, XP, missões, domínio, conquistas ou Capacitor.

Não criar um novo sistema de mascotes agora.

---

## Validação obrigatória

Ao final, rode:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Se o projeto tiver problemas de formatação/imports, rode antes:

```bash
pnpm exec biome check --write .
```

e depois repita os comandos de validação.

Também rode:

```bash
rg -n "mascot|Mascot|mascote|Mascotes|mascot-" src
```

Não deve sobrar nenhuma referência ativa em `src`.

## Resultado esperado

O sistema de mascotes deve desaparecer completamente do app atual:

* Não aparece na Home
* Não aparece na tela de resultado
* Não aparece na Loja
* Não aparece nas categorias de cosméticos
* Não existe mais no catálogo
* Não existe mais no tipo `CosmeticType`
* Não existe mais em `CosmeticEquipped`
* Não existe mais `mascotId` em inventário normalizado
* Testes atualizados
* Storage antigo com mascotes não quebra o app
* `lint`, `typecheck`, `test` e `build` passam
