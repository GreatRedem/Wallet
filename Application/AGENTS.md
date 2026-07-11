# GWallet — Agent Guide

## Commands (run from `Application/`)

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server on `http://localhost:1420` |
| `npm run build` | `tsc && vite build` — typecheck **before** bundle |
| `npm run desktop` | `npm run tauri dev` — Tauri + Vite HMR |
| `npm run desktop-build` | `npm run tauri build` |
| `npm run android` | `npm run tauri android dev` |
| `npm run android-aab` | Android release .aab |
| `npm run android-apk` | Android release .apk |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint with --fix |

No test framework exists — no test runner, no test files.

## Architecture

- **No React Router** — event-driven navigation. Call `openPage(Component)` from `utility/context.tsx` to switch pages. `layout/page.tsx` renders the active page via `AnimatePresence` (`motion`, framer-motion successor).
- Vite `root` is `src/`, so `src/index.html` is the HTML entry; build output goes to `../dist`.
- Storage uses `@tauri-apps/plugin-store` (encrypted file `application.bin`). Only works inside Tauri — `npm run dev` in a browser will error on storage calls.
- Ethereum HD wallet at `core/wallet.ts` using ethers.js 6 + BIP39 (`m/44'/60'/0'/0/{index}`).
- Context menu is disabled globally (`app.tsx` calls `preventDefault()` on `contextmenu` event).
- `Swiper` 14 drives the intro carousel (`page/intro.tsx`).
- Tauri window is `alwaysOnTop` on desktop (see `tauri.windows.conf.json`).

## Code conventions (enforced by ESLint)

- **Braces**: Allman style
- **Indent**: 4 spaces
- **Quotes**: single in JSX, double elsewhere
- **Semicolons**: required
- **Line endings**: LF (unix)
- **Naming**: `PascalCase` for **all** functions (not just components), `camelCase` for variables
- Base config: `@typescript-eslint/all` (strictest preset, relaxed via overrides), `@stylistic`, `better-tailwindcss`
- No Prettier — formatting is entirely ESLint-driven via `@stylistic`

## Quirks / not yet wired

- Only 2 of 7 declared languages have translation JSONs: `en.json` and `fa.json` in `assets/lang/`.
- `zustand` 5 is a dependency but not used anywhere yet. `flag-icons` 7 **is** used (`fi fi-<country>` classes in `components/intro.language.tsx`).
- `src/core/providers/` and `src-tauri/src/commands/` exist but are empty (no Tauri IPC commands registered).
- `package-lock.json` is intentionally gitignored.
- `Zustand` for state management and `flag-icons` for flag CSS are available if needed.

## Commit style

Conventional Commits (`contributing.md` at repo root): `<type>(<scope>): <subject>` (50 chars max, imperative, lowercase, no period).

## Reference docs

- `docs/CODE_STYLE.md` — **read before writing code** — formatting, naming, JSDoc, JSX, and styling conventions with real examples
- `docs/PATTERNS.md` — copy-paste recipes for adding pages, overlays, events, storage keys, translations, and wallet ops consistently
- `ARCHITECTURE.md` — component flow diagrams and detailed architecture
- `eslint.config.ts` — authoritative source for all code style rules
