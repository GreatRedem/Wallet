# GWallet AI Agent Instructions

## Project Overview

**GWallet** is a cross-platform Ethereum wallet application built with React, TypeScript, Tauri, and ethers.js. The frontend is a React SPA embedded in Tauri, with wallet cryptography managed via TypeScript. Sensitive data is encrypted and stored using the Tauri Store plugin. The Rust backend handles platform integration (system tray, OS detection) and optional Windows-specific tun2socks proxy control.

**Key technologies:**
- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: Rust, Tauri 2
- Blockchain: ethers.js 6 (Ethereum HD wallet, BIP39)
- Storage: AES-GCM encryption + Tauri Store
- Platforms: Desktop (Windows/Mac/Linux) + Android

**Run commands from:** `Application/` directory

---

## Architecture

### High-level flow

```
app.tsx (bootstrap)
  ├── Initialize Theme & Language
  ├── Check IsLogged() → Load HomePage or SplashPage
  └── Application
      ├── PageLayout (event-driven page stack)
      ├── ModalLayout (event-driven modal stack)
      └── ToastLayout (event-driven toast stack)
```

**No React Router.** Navigation uses a custom event bus (`utility/event.ts`) and Context API helpers (`utility/context.tsx`). Pages, modals, and toasts are managed through events.

### Key modules

| Module | Purpose |
|--------|---------|
| `core/wallet.ts` | BIP39 mnemonic generation, HD wallet derivation (m/44'/60'/0'/0/n), sign/verify with ethers.js |
| `core/account.ts` | Login state, passcode validation, credential storage |
| `utility/event.ts` | Typed pub/sub event bus for page/modal/toast navigation |
| `utility/context.tsx` | Helpers: `OpenPage()`, `OpenModal()`, `OpenToast()`, `SetHomePage()` |
| `utility/storage.ts` | Encrypted storage wrapper (AES-GCM + Tauri Store) |
| `utility/language.ts` | i18n loader; 7 languages: ar, en, fa, hi, ru, tr, zh |
| `src-tauri/lib.rs` | Tauri plugins, system tray handler, command routing |
| `src-tauri/command.rs` | Tauri command handlers (e.g., `tun_start`, `tun_stop`) |

### Directory structure

```
Application/
├── src/
│   ├── app.tsx               # Root bootstrap
│   ├── index.html
│   ├── type.d.ts             # Global types: EventMap, NavigationMap, StorageKey
│   ├── page/                 # Page screens (splash, home)
│   ├── layout/               # Layout renderers (page, modal, toast stacks)
│   ├── components/           # React components
│   │   ├── splash/           # Onboarding UI (passcode, wallet import)
│   │   └── home/             # Home tabs (wallet, home, browser)
│   ├── core/                 # Core logic (wallet, account)
│   ├── utility/              # Helpers (context, event, storage, language, theme)
│   └── assets/               # Language files, wordlist, images
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

- **No React Router** — Use `Context.OpenPage()`, `Context.OpenModal()`, `Context.OpenToast()` instead.
- Pages/modals emit events via `EventMap.Emit()` in `utility/event.ts`.
- Layouts listen to events and render components from the stack.

**Example:**
```typescript
import { Context } from '@/utility/context';
import HomePage from '@/page/home';

// Navigate to home
Context.OpenPage(HomePage);

// Open a modal
Context.OpenModal(SomeModalComponent);
```

### Storage

- Use `utility/storage.ts` for sensitive data (passwords, phrases, keys).
- Data is **AES-GCM encrypted** before Tauri Store.
- Non-sensitive data can use localStorage or Tauri Store directly.

**Example:**
```typescript
import { Storage } from '@/utility/storage';

await Storage.Set('walletPhrase', encryptedPhrase);
const phrase = await Storage.Get('walletPhrase');
```

### Wallet & Crypto

- **Generate mnemonic:** `WalletManager.Generate()` returns 12-word phrase.
- **Derive wallet:** `new WalletManager(mnemonic, index)` derives key at `m/44'/60'/0'/0/{index}`.
- **Sign transactions:** Use `wallet.signMessage()` or `wallet.signTransaction()` from ethers.js.
- **Passcode:** 4-digit PIN hashed with SHA-256 before storage; never store plaintext.

### TypeScript

- Strict mode enabled; all files must have proper types.
- Global types in `type.d.ts`: `EventMap`, `NavigationMap`, `StorageKey`.
- Use interfaces and avoid `any`.

### Styling

- **Tailwind CSS** for utility-first styling.
- **CSS custom properties** (in `style.css`) for theme variables (colors, spacing).
- Light/dark theme via `utility/theme.ts`.

### ESLint

- Configuration in `eslint.config.ts`.
- Plugins: `@typescript-eslint`, `eslint-plugin-better-tailwindcss`, `@stylistic`.
- Run `npm run lint` to check (add to package.json if missing).

### Commit conventions

Follow [Conventional Commits](../contributing.md):
- Format: `<type>(<scope>): <subject>`
- Types: `feat`, `fix`, `refactor`, `perf`, `style`, `test`, `docs`, `build`, `ci`, `chore`, `revert`
- Subject: 50 chars max, lowercase, imperative mood, no period.
- Scopes: `wallet`, `auth`, `storage`, `ui`, `core`, `tauri`, etc.

**Example:** `feat(wallet): add seed phrase export`

---

## Common tasks

### Add a new page

1. Create component in `src/page/` (e.g., `settings.tsx`).
2. Add navigation event to `type.d.ts` `NavigationMap`.
3. Import and emit from another page: `Context.OpenPage(SettingsPage)`.

### Add a new modal

1. Create component in `src/components/` with `.modal.tsx` suffix.
2. Emit: `Context.OpenModal(SomeModal)`.

### Add translations

1. Edit language files in `src/assets/lang/*.json` (add key-value pairs).
2. Use `T('key.path')` in components to render translated text.

### Add storage key

1. Add to `type.d.ts` `StorageKey` type.
2. Use `Storage.Set(key, value)` and `Storage.Get(key)`.

### Access OS/platform info

- Use `import { os } from '@tauri-apps/plugin-os'` for OS detection.
- Check `os.type()` for "Windows", "Darwin", "Linux", etc.

### Invoke Rust commands

- Define in `src-tauri/src/command.rs` with `#[tauri::command]`.
- Call from React: `await invoke('command_name', { arg1: value })`.

---

## Debugging tips

### React components not rendering?

- Check if page/modal is correctly emitted via `EventMap.Emit()`.
- Verify layout listeners exist in `layout/page.tsx`, `layout/modal.tsx`.
- Ensure component is in the event data.

### Storage data missing?

- Check if data is encrypted (use `Storage.Set()` not `localStorage`).
- Verify `StorageKey` type includes the key name.
- Use browser DevTools → Tauri plugin tab to inspect Store.

### Tauri commands not working?

- Ensure command is exported in `src-tauri/src/lib.rs`.
- Check `tauri.conf.json` security scope (allowlist).
- Verify `#[tauri::command]` macro is applied in `command.rs`.

### Wallet derivation incorrect?

- Verify mnemonic is valid BIP39 (use `wordlist.json` for validation).
- Check index is correct (usually 0 for first wallet).
- Ensure ethers.js HD path is `m/44'/60'/0'/0/{index}` (Ethereum standard).

---

## Useful links

- [Tauri docs](https://tauri.app/docs/)
- [ethers.js documentation](https://docs.ethers.org/v6/)
- [Vite guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React docs](https://react.dev/)
- [Contributing guidelines](../contributing.md)
- [Architecture & AI reference](./Application/docs/readme.md)
