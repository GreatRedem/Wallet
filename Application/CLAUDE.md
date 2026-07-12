# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from `Application/` (this directory):

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server on `http://localhost:1420` (browser — storage calls will error, see Gotchas) |
| `npm run desktop` | `tauri dev` — Tauri + Vite HMR, the real app shell |
| `npm run build` | `tsc && vite build` — typecheck **before** bundling; this is the closest thing to a test suite |
| `npm run desktop-build` | `tauri build` — desktop release |
| `npm run android` / `android-aab` / `android-apk` | Tauri Android dev / release builds |
| `npm run lint` / `npm run lint:fix` | ESLint check / autofix — this is also the formatter (no Prettier) |

There is no test framework and no test files in this repo. `npm run build` (tsc) and `npm run lint` are the only correctness gates.

## Architecture

Tauri 2 (Rust backend) + React 19/TypeScript (frontend). Desktop (Windows) and Android targets.

- **Navigation has no router.** `utility/context.tsx`'s `openPage(Component, props?)` emits a `Page.Open` event on the type-safe bus in `utility/event.ts`; `layout/page.tsx` is the sole listener and swaps the rendered page inside `AnimatePresence` (`motion`, the framer-motion successor). Only one page is mounted at a time — it replaces, not stacks.
- **Overlays/modals are local state, not the bus.** A page holds `useState<ReactNode>()` and renders a component that takes `{ onClose }`, animated via `AnimatePresence` — see `page/intro.tsx` hosting `IntroLanguage` / `IntroWallet` / `IntroImport`.
- **Persistence** (`utility/storage.ts`) wraps `@tauri-apps/plugin-store`, keyed by a `StorageKey` string union — add new keys there rather than passing arbitrary strings. **Only works inside Tauri** (`npm run desktop`); plain-browser `npm run dev` errors on storage calls.
- **Wallet logic** lives entirely in `core/wallet.ts` (`WalletManager`) — ethers.js 6 + BIP39, HD derivation at `m/44'/60'/0'/0/{index}`, mnemonics NFKD-normalized before derivation. UI code should call into this, not `ethers` directly.
- **i18n** (`utility/language.ts`): `T(key, ...args)` resolves dotted keys from a loaded JSON bundle, with `%s` positional placeholders; missing keys render as visible `[Key]` placeholders instead of throwing. `LanguageType` declares 7 locales but only `en` and `fa` have JSON bundles in `assets/lang/`. RTL (`fa`, `ar`) is handled by an explicit array check, not a locale property.
- **State singletons** (language, theme) are module-level `let` + `get*`/`set*`/`init*` functions, not React context/store — `zustand` is installed but not used anywhere; don't introduce it without reason.
- Global browser context menu is disabled (`app.tsx`); a keydown listener lists several shortcuts to guard (F3/F5/F7, Ctrl combos) but its `preventDefault()` is currently commented out, so nothing is actually blocked yet.
- Windows-only: system tray icon with show/quit menu, set up conditionally via `platform()` from `@tauri-apps/plugin-os`.
- Vite root is `src/` (`src/index.html` is the entry); build output goes to `../dist`. Rust entry points are `src-tauri/src/main.rs` → `lib.rs` (Tauri builder, plugin init, tray handler). `src/core/providers/` and `src-tauri/src/commands/` are placeholders — no Tauri IPC commands exist yet.

### Gotcha: storage is plaintext, not encrypted

`utility/storage.ts`'s `setValue`/`getValue` write directly to `@tauri-apps/plugin-store`'s `application.bin` with **no encryption** (`tauri-plugin-store` is used without any encryption feature in `src-tauri/Cargo.toml`). Anything written there — including a wallet mnemonic and a user-chosen password stored side by side — is recoverable in cleartext by anyone with filesystem access. Don't assume a "password" field stored this way protects the value next to it; if you're persisting wallet secrets, they need to be encrypted before they reach `setValue`, not after.

## Code conventions

Enforced by ESLint (`eslint.config.ts`, `@typescript-eslint/all` strictest preset + `@stylistic` + `better-tailwindcss`) — **there is no Prettier**, formatting is entirely lint-driven. Full rationale and examples: [`docs/CODE_STYLE.md`](docs/CODE_STYLE.md); recipes for adding pages/events/storage keys/translations/wallet ops "the way this codebase does it": [`docs/PATTERNS.md`](docs/PATTERNS.md).

Highlights that aren't obvious from skimming the code:
- Allman braces, 4-space indent, single quotes (double only to avoid escaping), no trailing commas, LF endings.
- **All functions are PascalCase, not just components** — but only `function` *declarations* count as "function" for the naming rule. `export const openPage = () => …` (arrow assigned to a const) is classified as a variable, so it stays **camelCase**. This trips people up.
- Exported functions/methods carry JSDoc (`@param`/`@returns` in `{braces}` even though TS already types them).
- Floating promises must be prefixed `void` (`no-floating-promises`); `useEffect` subscriptions to the event bus must return a matching `off(...)` cleanup.
- Styling: Tailwind utility classes only, via the semantic token/component-class layer in `src/style.css` (`glass-*`, `btn-*`, `bg-base-*`, `text-txt-*`, `text-tiny/small/medium/large`) — never hard-coded colors or inline `style={}`.
- Every user-facing string goes through `T('Domain.Key')`, added to **both** `en.json` and `fa.json`.

## Commit style

Conventional Commits (full spec in [`../contributing.md`](../contributing.md)): `<type>(<scope>): <subject>`, subject ≤50 chars, imperative mood, lowercase, no trailing period.

## Reference docs

- [`AGENTS.md`](AGENTS.md) — condensed agent-facing summary (commands, architecture, quirks)
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — component flow diagrams and data-flow walkthroughs
- [`docs/CODE_STYLE.md`](docs/CODE_STYLE.md) — formatting/naming/JSDoc/JSX conventions with examples
- [`docs/PATTERNS.md`](docs/PATTERNS.md) — copy-paste recipes for common changes
- `eslint.config.ts` — authoritative source for every style rule
