# GWallet AI Agent Instructions

## Project Overview

**GWallet** is a cross-platform Ethereum wallet application built with React, TypeScript, Tauri, and ethers.js. The frontend is a React SPA embedded in Tauri, with wallet cryptography managed via TypeScript. Sensitive data is encrypted and stored using the Tauri Store plugin. The Rust backend handles platform integration (system tray, OS detection).

**Key technologies:**

- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: Rust, Tauri 2
- Blockchain: ethers.js 6 (Ethereum HD wallet, BIP39)
- Storage: AES-GCM encryption + Tauri Store
- Platforms: Desktop (Windows/Mac/Linux) + Android + iOS

**Run commands from:** `Application/` directory

---

## Architecture

**No React Router.** Navigation uses a custom event bus (`utility/event.ts`) and Context API helpers (`utility/context.tsx`). Pages are managed through events.

### Directory structure

```
Application/
├── src/
│   ├── app.tsx               # Root bootstrap
│   ├── index.html
│   ├── type.d.ts             # Global types
│   ├── page/                 # Page screens
│   ├── layout/               # Layout renderers
│   ├── components/           # React components
│   ├── core/                 # Core logic
│   ├── utility/              # Helpers
│   └── assets/               # Assets files
├── src-tauri/                # Rust backend
├── vite.config.ts
├── tsconfig.json
├── package.json
└── eslint.config.ts
```

---

## Development commands

From `Application/` directory:

| Command | Purpose |
|---------|---------|

| `npm run dev` | Start Vite dev server (HMR) |
| `npm run build` | TypeScript check + Vite bundle |
| `npm run desktop` | Launch Tauri desktop dev (auto-reload on source changes) |
| `npm run desktop-build` | Build desktop release binaries |
| `npm run android` | Launch Android emulator/device debug build |
| `npm run android-aab` | Build Android release .aab (Google Play) |
| `npm run android-apk` | Build Android release .apk (sideload) |

---

## Key conventions

### Navigation

- **No React Router** — Use `openPage()` instead.
- Pages emit events via `emit()` in `utility/event.ts`.

### Wallet & Crypto

- **Generate mnemonic:** `WalletManager.Generate()` returns 12-word phrase.
- **Derive wallet:** `new WalletManager(mnemonic, index)` derives key at `m/44'/60'/0'/0/{index}`.
- **Sign transactions:** Use `wallet.signMessage()` or `wallet.signTransaction()` from ethers.js.
- **Passcode:** 5-digit PIN hashed with SHA-256 before storage; never store plaintext.

### TypeScript

- Strict mode enabled; all files must have proper types.
- Global types in `type.d.ts`
- Use interfaces and avoid `any`.

### Styling

- **Tailwind CSS** for utility-first styling.
- **CSS custom properties** (in `style.css`) for theme variables (colors, spacing).

### ESLint

- Configuration in `eslint.config.ts`.
- Plugins: `@typescript-eslint`, `eslint-plugin-better-tailwindcss`, `@stylistic`.
- Run `npm run lint` to check.

### Commit conventions

Follow [Conventional Commits](../contributing.md):

- Format: `<type>(<scope>): <subject>`
- Types: `feat`, `fix`, `refactor`, `perf`, `style`, `test`, `docs`, `build`, `ci`, `chore`, `revert`
- Subject: 50 chars max, lowercase, imperative mood, no period.
- Scopes: `wallet`, `auth`, `storage`, `ui`, `core`, `tauri`, etc.

**Example:** `feat(wallet): add seed phrase export`

---

## Useful links

- [Tauri docs](https://tauri.app/start/)
- [ethers.js documentation](https://docs.ethers.org/v6/)
- [Vite guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React docs](https://react.dev/)
- [Contributing guidelines](../contributing.md)
- [Architecture & AI reference](./Application/docs/readme.md)
