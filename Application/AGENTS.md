# GWallet — Agent Guide

## Project structure

```
Wallet/
  Application/          <-- working directory for all commands
    src/                <-- Vite root (config: root: 'src')
      app.tsx           entrypoint (mounts at #root)
      layout/page.tsx   page stack container
      page/             pages
      components/       reusable UI
      core/wallet.ts    Ethereum HD wallet (ethers.js, BIP39, m/44'/60'/0'/0/{index})
      utility/
        event.ts        typed event bus (Page.Open, Toast.Open/Close, Modal.Open/Close)
        context.tsx      openPage(Component, props?) wrapper
        language.ts     i18n (en, fa, tr, ar, zh, ru, hi); RTL for fa/ar
        storage.ts      Tauri Store wrapper (key: 'App.Language', file: application.bin)
      assets/lang/      translation JSONs
    src-tauri/
      src/
        main.rs         entry, calls app_lib::run()
        lib.rs          Tauri builder (plugins: OS, Store; tray icon on desktop)
        commands/       empty -- no Tauri commands registered yet
```

## Commands (run from `Application/`)

| Command | Purpose |
|---------|---------|
| `npm run dev` | Vite dev server on `http://localhost:1420` |
| `npm run build` | `tsc && vite build` -- typecheck **before** bundle |
| `npm run desktop` | `npm run tauri dev` -- Tauri + Vite HMR |
| `npm run desktop-build` | `npm run tauri build` |
| `npm run android` | `npm run tauri android dev` |
| `npm run android-aab` | Android release .aab |
| `npm run android-apk` | Android release .apk |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint with --fix |

## Code conventions (enforced by ESLint)

- **Indent**: 4 spaces
- **Braces**: Allman style
- **Quotes**: single in JSX, double elsewhere unless interpolated
- **Semicolons**: required
- **Line endings**: LF (unix)
- **Naming**: `PascalCase` for functions & types, `camelCase` for variables
- `no-console` is `warn`
- Base config: `@typescript-eslint/all` (with several relaxations), `@stylistic`, `better-tailwindcss`
- Config file: `eslint.config.ts` (overrides apply on top of strict rulesets)

## Architecture notes

- **No React Router** -- navigation is event-driven via `utility/event.ts`. Call `openPage(Component)` from `utility/context.tsx` to switch pages.
- All navigation events (`Page.Open`) are typed via `EventMap` in `event.ts`.
- Storage uses `@tauri-apps/plugin-store` (encrypted under the hood). Only works inside Tauri; will fail in plain browser dev.
- Vite `root` is `src/`, so `src/index.html` is the HTML entry.
- Tauri `beforeDevCommand` runs `npm run dev` pointing at `http://localhost:1420`.

## What's missing / not yet wired

- No test framework (none in `package.json`).
- No Prettier (no dependency, no config -- ignore any Prettier references).
- No Tauri commands (Rust `commands/` dir is empty; frontend uses only Tauri plugins directly).
- No CI workflows.

## Commit style

Follow Conventional Commits (`contributing.md` at repo root): `<type>(<scope>): <subject>` (50 chars max, imperative, lowercase, no period).

## Reference docs

- `ARCHITECTURE.md` -- component flow diagrams and detailed architecture
- `contributing.md` at repo root -- commit conventions
