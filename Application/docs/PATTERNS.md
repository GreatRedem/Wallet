# Patterns & Recipes

> How to add things **the way this codebase already does it**. Follow these recipes so new
> code is indistinguishable from existing code. Pair this with [`CODE_STYLE.md`](./CODE_STYLE.md)
> for formatting and [`../ARCHITECTURE.md`](../ARCHITECTURE.md) for the high-level map.

---

## Mental model

- **No router.** Navigation is an event bus. A component calls `openPage(Component)` and the
  single [`layout/page.tsx`](../src/layout/page.tsx) host renders it inside `<AnimatePresence>`.
- **Overlays/sub-pages are local state**, not the bus. Pages hold a `subPage` state and render
  a component (modal/drawer) that receives an `onClose` callback — see `page/intro.tsx` →
  `IntroLanguage` / `IntroWallet` / `IntroImport`.
- **Persistence** goes through [`utility/storage.ts`](../src/utility/storage.ts) (Tauri Store,
  file `application.bin`). **Storage only works inside Tauri** (`npm run desktop`), not a plain
  browser `npm run dev`.
- **Every user-facing string** is a translation key resolved by `T('…')`.
- **State singletons** for cross-cutting concerns (language, theme) are module-level `let`
  variables with `get*`/`set*`/`init*` functions, not React context. `zustand` is a dependency
  but is **not currently used** — do not introduce it without a reason.

---

## Recipe: add a new page

1. Create `src/page/<name>.tsx` with a **default-exported PascalCase function component**.
   Wrap the root in a `motion.div` with an enter animation, matching `IntroPage`:
   ```tsx
   export default function SettingsPage()
   {
       return (
           <motion.div
               initial={ { scale: 0 } }
               animate={ { scale: 1 } }
               transition={ { type: 'tween' } }
               className='relative size-full'>

               { /* content */ }

           </motion.div>
       );
   }
   ```
2. Navigate to it from anywhere with:
   ```ts
   import { openPage } from '../utility/context';
   openPage(SettingsPage);
   // with props: openPage(SettingsPage, { userId })
   ```
   `openPage` emits `Page.Open`; `PageLayout` swaps the rendered element. Only one page is
   active at a time (`setLayoutMap` replaces, it does not stack).

## Recipe: add a sub-page / modal / drawer overlay

Model it on [`components/intro.language.tsx`](../src/components/intro.language.tsx). It:
- takes `{ onClose }: { onClose: () => void }`,
- renders a `motion.div` backdrop (`absolute z-10 size-full bg-black/25 backdrop-blur-xs`)
  wired to `onClose`,
- renders a `glass-panel` body with matching `initial`/`animate`/`exit` transitions.

Host it from the parent page via local state so it participates in `<AnimatePresence>`:
```tsx
const [ subPage, setSubPage ] = useState<ReactNode>();
// open:
setSubPage(<SettingsModal onClose={ () => { setSubPage(undefined); } } />);
// render:
<AnimatePresence>{ subPage }</AnimatePresence>
```

## Recipe: add a new event to the bus

Edit [`utility/event.ts`](../src/utility/event.ts). Add the typed entry to `EventMap`
(name is `Domain.Action`, payload is a **labeled tuple**), then `emit`/`on`/`off` stay generic
and type-safe automatically:
```ts
interface EventMap
{
    'Page.Open': [component: JSX.Element];
    'Wallet.Created': [address: string];   // ← new
}
```
Always pair `on(name, handler)` in a `useEffect` with `off(name, handler)` in its cleanup.

## Recipe: add a persisted value

1. Add the key to the `StorageKey` union in
   [`utility/storage.ts`](../src/utility/storage.ts) (`'Domain.Name'` dotted convention):
   ```ts
   type StorageKey = 'App.Language' | 'App.Theme' | 'Wallet.Address';
   ```
2. Read/write via `await getValue(key)` / `await setValue(key, value)`. Values are strings.
3. For settings with an in-memory current value, follow the **language/theme module pattern**:
   a module-level `let current`, an `apply()` that mutates the DOM/state, `set*` that applies +
   persists, `get*`, and an `init*` that loads from storage with a sensible fallback (see
   [`utility/theme.ts`](../src/utility/theme.ts)). Call your `init*` in `app.tsx` **before**
   `createRoot(...).render()`, alongside `initTheme()`/`initLanguage()`.

## Recipe: add or use a translation string

1. Add the key to **both** [`src/assets/lang/en.json`](../src/assets/lang/en.json) **and**
   [`src/assets/lang/fa.json`](../src/assets/lang/fa.json). Keys are nested objects; reference
   them dotted: `T('Settings.Title')`.
2. Use in JSX: `{ T('Settings.Title') }`. For placeholders, `%s` tokens are filled positionally:
   `T('Wallet.Balance', amount)` against `"Balance: %s"`.
3. Missing keys render as `[Settings.Title]` (visible in dev) — a fast way to spot gaps.
4. Only `en` and `fa` bundles exist today, even though `LanguageType` declares
   `en|fa|tr|ar|zh|ru|hi`. If you add a locale, add its JSON, its `languageRecord` entry, and
   (for RTL languages) include its code in the `[ 'fa', 'ar' ]` direction checks in
   `language.ts`.

## Recipe: wallet / crypto operations

Use [`core/wallet.ts`](../src/core/wallet.ts) — do **not** call `ethers` directly from UI code.
- `WalletManager.Generate()` → new BIP39 mnemonic phrase.
- `WalletManager.Validate(mnemonic)` → boolean.
- `new WalletManager(mnemonic, index)` → HD wallet at `m/44'/60'/0'/0/{index}`; then
  `.retrieve()`, `.sign()`, `.verify()`.
- `WalletManager.FromPrivateKey(hex)` → wrapper with the **same public API** for raw-key
  imports. Keep this API parity if you add a new import source.
- Mnemonics are normalized `NFKD` before derivation — preserve that.

## Recipe: platform-specific behavior

Detect with `platform()` from `@tauri-apps/plugin-os` (e.g. `if (platform() === 'windows')` in
`app.tsx` for the tray icon). Rust-side platform gating uses `#[cfg(desktop)]` / `mobile` in
[`src-tauri/src/lib.rs`](../src-tauri/src/lib.rs). New Tauri IPC commands would be registered
there (the `src-tauri/src/commands/` area is currently empty).

---

## Do / Don't

| Do | Don't |
|----|-------|
| `openPage(Component)` for navigation | Add react-router or `<a href>` navigation |
| Semantic tokens & `btn-*`/`glass-*` classes | Hard-code hex/oklch colors or inline `style` |
| `T('Key')` for every visible string | Inline literal user-facing text |
| `void promise` for fire-and-forget | Leave floating promises (lint warns) |
| Add storage keys to the `StorageKey` union | Pass arbitrary string keys to `getValue` |
| Keep `en.json` and `fa.json` in sync | Add a key to only one locale |
| `import type` for types | Runtime-import type-only symbols |
| Run `npm run lint && npm run build` | Assume formatting; there is **no Prettier** |

---

## Known gaps / not-yet-wired (as of this writing — verify before relying on)

- No test framework or test files exist.
- `src/core/providers/` and `src-tauri/src/commands/` are empty — no Tauri IPC commands
  registered yet.
- `zustand` and `flag-icons` are installed; `flag-icons` CSS **is** used (`fi fi-<country>`),
  `zustand` is not yet used.
- `package-lock.json` handling and commit conventions: see [`../AGENTS.md`](../AGENTS.md).
