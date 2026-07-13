# Code Style Guide

> The authoritative, machine-enforced rules live in [`eslint.config.ts`](../eslint.config.ts)
> and [`.editorconfig`](../.editorconfig). This document explains the *intent* and the
> conventions ESLint cannot catch, with real examples from this codebase. When in doubt,
> run `npm run lint` — it is the source of truth. **Match the surrounding code.**

---

## 1. Formatting (enforced by `@stylistic`)

| Rule | Value | Notes |
|------|-------|-------|
| Indentation | **4 spaces** | Never tabs. `SwitchCase: 1`. |
| Brace style | **Allman** | Opening brace on its **own line**, at the same indent as the statement. |
| Semicolons | **Required** | |
| Quotes (TS/JS) | **Single** `'…'` | Double only when the string contains a single quote. |
| Quotes (JSX attributes) | **Single** `'…'` | `className='…'`, not `className="…"`. |
| Trailing commas | **Never** | `commaDangle: 'never'`. |
| Line endings | **LF** (unix) | Enforced. |
| Final newline | **Required** | |
| Trailing whitespace | Trimmed (except `*.md`) | |
| Arrow parens | **Always** | `(x) => …`, never `x => …`. |
| Operator line-break | **After** the operator | `a ||\n b`, condition ends the line with the operator. |
| Object/array bracket spacing | **Spaced** | `{ a: 1 }`, `[ 1, 2 ]`. |
| Template curly spacing | **Spaced** | `` `${ value }` ``, not `` `${value}` ``. |
| JSX curly spacing | **Spaced** | `{ expr }`, `size={ 16 }`. |
| Padded blocks | **Never** for logic blocks | But JSX return bodies use blank lines liberally (see §6). |

### The Allman + blank-line house style

Every block opens its brace on a new line, and function bodies breathe with blank lines
between logical steps:

```ts
export const setLanguage = async(lang: LanguageType) =>
{
    languageCurrent = lang;

    await setValue('App.Language', lang);

    languageMap = (await import(`../assets/lang/${ lang }.json`)).default;

    document.documentElement.dir = [ 'fa', 'ar' ].includes(lang) ? 'rtl' : 'ltr';
};
```

Note `async(` with **no space** before the paren (`space-before-function-paren` is `never`
for named/anonymous/async-arrow, but `always` for `catch`).

---

## 2. Naming conventions (enforced by `@typescript-eslint/naming-convention`)

| Kind | Case | Example |
|------|------|---------|
| **Functions** (all — components, helpers, handlers) | **PascalCase** | `function Application()`, `function IntroPage()` |
| Variables, parameters, arrow-function consts | **camelCase** | `languageCurrent`, `rootElement`, `openHandler` |
| Types, interfaces, type aliases, classes | **PascalCase** | `EventMap`, `LanguageType`, `WalletManager` |
| React components | PascalCase (they are functions) | `PageLayout`, `IntroWallet` |

> ⚠️ **Gotcha:** the naming rule classifies *arrow functions assigned to a const* as
> `variableLike` → **camelCase** (`openPage`, `setLanguage`, `emit`). Only `function`
> **declarations** are `function` → **PascalCase**. So `function IntroPage()` is PascalCase,
> but `export const openPage = () => …` is camelCase. `openPage` carries an inline
> `// eslint-disable-next-line @typescript-eslint/naming-convention` because it takes a
> `Component` and behaves like a factory — follow that pattern only when genuinely needed.

### Class members

Classes (see [`core/wallet.ts`](../src/core/wallet.ts)) use **PascalCase** for fields and
static methods that form the public API (`WalletSigner`, `Generate`, `Validate`,
`FromPrivateKey`), and camelCase for instance verbs (`retrieve`, `sign`, `verify`). Match
the existing class when extending it.

---

## 3. TypeScript conventions

- `strict: true` everywhere. Prefer inference; add explicit return types only when it aids
  clarity (`explicit-function-return-type` is **off**).
- Config base is `typescript-eslint/configs.all` (the strictest preset) with targeted
  relaxations in `eslint.config.ts`. Expect strict rules by default.
- Use `import type { … }` for type-only imports:
  ```ts
  import type { JSX } from 'react';
  import type { ComponentType } from 'react';
  ```
- Prefer `undefined` checks written explicitly: `if (listeners === undefined)`,
  `?? []`, `?.`. Avoid truthiness for possibly-`0`/`''` values.
- Escape hatches (`@ts-expect-error`, `eslint-disable`) are used **sparingly and with a
  justifying comment** on the same construct. Copy that discipline; don't scatter disables.
- Asset/module typings live in [`src/type.d.ts`](../src/type.d.ts) (`*.png`, `*.css`, …).

---

## 4. Import ordering

Imports are grouped, blank-line separated, and **roughly ordered shortest→longest within a
group** (visual "ragged-left" style). Observed grouping, top to bottom:

1. `import type` type-only imports
2. React / third-party runtime imports
3. Local modules — layouts, then pages, then components
4. Local utilities (`./utility/*`)
5. Assets (images), then CSS side-effect imports last

Example from [`page/intro.tsx`](../src/page/intro.tsx):

```ts
import type { Swiper as SwiperType } from 'swiper';

import { LuImport } from 'react-icons/lu';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRef, useCallback, useState, type ReactNode } from 'react';

import IntroImport from '../components/intro.import';

import { getDirection, T } from '../utility/language';

import IntroConnect from '../assets/image/intro_connect.png';

import 'swiper/css';
```

---

## 5. Documentation comments (JSDoc)

Exported functions, utilities, and class methods carry **JSDoc blocks**. Two flavors coexist:

- **Prefixed style** (utilities/event/storage): start with `name - one-line summary`, then
  `@param`/`@returns`.
  ```ts
  /**
   * on - Registers a listener for the specified event name.
   * @template T
   * @param {T} name - The event name to listen for.
   * @param {EventCall<T>} listener - The callback invoked when the event is emitted.
   */
  ```
- **Prose style** (language/theme): a sentence or short paragraph describing intent, then
  tags. Both are acceptable; match the file you are editing.

Keep `@param`/`@returns` types in `{braces}` even though TS already types them — the codebase
does this consistently. Non-obvious behavior (fallbacks, side effects, platform guards) gets
a sentence explaining *why*.

---

## 6. React & JSX conventions

- **Function components are default exports** for pages/components:
  `export default function IntroWallet(...)`. Utilities are **named exports**.
- Props are typed inline for small components:
  `function IntroLanguage({ onClose }: { onClose: () => void })`.
- **Hooks:** `useState`, `useEffect`, `useCallback`, `useRef` are the vocabulary. Wrap
  event handlers passed down or used in effects in `useCallback` with correct deps.
- **`useEffect` for subscriptions** must return a cleanup that unsubscribes — mirror the
  event-bus pattern:
  ```ts
  useEffect(() =>
  {
      const openHandler = (component: JSX.Element) => { setLayoutMap(component); };

      on('Page.Open', openHandler);

      return () =>
      {
          off('Page.Open', openHandler);
      };
  }, [ ]);
  ```
- **Fire-and-forget promises** are prefixed with `void` (satisfies `no-floating-promises`):
  `void setTheme(next);`, `void getCurrentWindow().show();`.
- **JSX spacing house style:** blank lines inside JSX between the opening tag and children,
  and around `{ expr }` blocks. Multi-line ternaries are required
  (`multiline-ternary: always-multiline`). One expression per JSX line
  (`jsx-one-expression-per-line`). Closing bracket goes **after props**
  (`jsx-closing-bracket-location: after-props`):
  ```tsx
  <button
      onClick={ toggleTheme }
      type='button'
      className='btn-normal flex size-10 items-center justify-center rounded-lg'>

      {
          theme === 'light' ? <FiMoon size={ 16 } /> : <FiSun size={ 16 } />
      }

  </button>
  ```
- **Icons:** from `react-icons/*` sub-packages, sized with `size={ 16 }` (not Tailwind
  `w-/h-` on the icon). Pick the icon set already imported nearby (`fi`, `io`, `io5`, `lu`,
  `fa`, `hi`).

---

## 7. Styling (Tailwind 4 + semantic tokens)

Styling is **Tailwind utility classes in `className`**, linted by `better-tailwindcss`
against [`src/style.css`](../src/style.css). Do **not** add inline `style={}` for anything
themable.

### Use the semantic layer, not raw colors

The theme system swaps a full palette via `[data-theme='light'|'dark']` on `<html>`. Always
reach for the **semantic tokens and component classes**, never hard-coded colors:

- **Component classes** (defined in `style.css`): `glass-panel`, `glass-input`,
  `btn-primary`, `btn-normal`, `btn-muted`, `btn-secondary`.
- **Color tokens** (as Tailwind utilities): `bg-base-1/2/3`, `text-txt-normal`,
  `text-txt-muted`, `text-txt-reverse`, `input-normal`, etc.
- **Type scale tokens:** `text-tiny` (12px), `text-small` (14px), `text-medium` (16px),
  `text-large` (18px). Prefer these over `text-sm`/`text-lg`.

```tsx
<div className='glass-panel flex w-72 flex-col gap-2 rounded-lg p-4'>
    <div className='text-medium font-bold text-txt-normal'> … </div>
</div>
```

- Opacity modifiers are fine on tokens: `text-txt-normal/75`, `bg-black/25`.
- `!` important modifier appears where overriding component-class defaults:
  `bg-base-3!`, `size-4!`.
- **RTL:** the app supports RTL (fa/ar). Use logical utilities (`text-start`, `ms-`/`me-`,
  `ps-`/`pe-`) and gate directional rotation on `getDirection() === 'rtl'`, as
  `page/intro.tsx` does for arrow icons.
- New reusable visual treatments belong as a class in `style.css` (following the
  `glass-*`/`btn-*` pattern), not copy-pasted utility soup.

---

## 8. Comments & logging

- `no-console` is a **warning** — avoid `console.*` in committed code.
- Comments explain *why*, not *what*. See the `@theme inline` comment in `style.css` and the
  guard comments in `app.tsx`.

---

## 9. Quick checklist before proposing a change

- [ ] Allman braces, 4-space indent, single quotes, semicolons, no trailing commas.
- [ ] `function Declarations()` are PascalCase; `const arrow = () =>` are camelCase.
- [ ] JSDoc on new exported functions / class methods.
- [ ] Type-only imports use `import type`; imports grouped and blank-line separated.
- [ ] Floating promises prefixed with `void`; effects clean up their subscriptions.
- [ ] Styling uses semantic tokens / component classes, RTL-safe, no hard-coded colors.
- [ ] New user-facing strings go through `T('…')` with keys in **both** `en.json` and
      `fa.json` (see [`PATTERNS.md`](./PATTERNS.md)).
- [ ] `npm run lint` passes; `npm run build` typechecks.
