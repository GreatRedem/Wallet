# GApp — Architecture & AI Reference

> **Audience:** AI agents and developers working on this codebase.
> **Entry point:** All source lives under `Application/`. Run commands from `Application/`.

## What this app is

GApp is a cross-platform Ethereum wallet shell. The frontend is a React SPA embedded in Tauri. Wallet cryptography runs in TypeScript via ethers.js. Sensitive data is encrypted and stored with the Tauri Store plugin. The Rust backend handles platform integration (tray, OS detection) and optional Windows-only tun2socks proxy control.

---

## High-level architecture

```
┌─────────────────────────────────────────────────────────────┐
│  app.tsx (bootstrap)                                        │
│    ├── Theme.Initialize()                                   │
│    ├── Language.Initialize()                                │
│    └── Application                                          │
│          ├── PageLayout   ← event-driven page stack         │
│          ├── ModalLayout  ← event-driven modal stack        │
│          └── ToastLayout  ← event-driven toast stack        │
├─────────────────────────────────────────────────────────────┤
│  Navigation: Context API (utility/context.tsx)              │
│    OpenPage / OpenModal / OpenToast / SetHomePage           │
│    → EventMap.Emit() → layout listeners render components   │
├─────────────────────────────────────────────────────────────┤
│  Core logic                                                 │
│    core/wallet.ts   — BIP39, HD derivation, sign/verify     │
│    core/account.ts  — login state, credential storage       │
│    utility/storage.ts — AES-GCM encrypt + Tauri Store       │
├─────────────────────────────────────────────────────────────┤
│  Tauri backend (src-tauri/)                                 │
│    lib.rs     — plugins, tray, invoke handler               │
│    command.rs — tun_start / tun_stop (JS → Rust)            │
│    tun.rs     — Windows tun2socks.exe launcher              │
└─────────────────────────────────────────────────────────────┘
```

**No React Router.** Pages, modals, and toasts are managed through a custom event bus (`utility/event.ts`) and the `Context` helper.

---

## Application flow

### Startup (`src/app.tsx`)

1. On Windows: create system tray with Open/Quit menu.
2. Call `IsLogged()` from `core/account.ts`.
3. If logged in → `Context.OpenPage(HomePage)`.
4. If not → `Context.OpenPage(SplashPage)`.

### Onboarding (Splash)

```
SplashPage
  ├── "Create New Wallet" → PasscodeModal (Phrase="")
  │     → generates mnemonic via WalletManager.Generate()
  │     → hashes 4-digit passcode → Account.Login()
  │     → navigates to HomePage
  └── "Import Existing Wallet" → MenuModal
        └── "Existing Wallet" → WalletModal (12-word entry)
              → PasscodeModal (Phrase=recovery phrase)
              → Account.Login() → HomePage
```

### Home screen

```
HomePage
  ├── listens to EventMap 'Home.Page' for active tab content
  └── NavigationComponent (bottom bar)
        ├── WALLET → components/home/wallet.tsx
        ├── HOME   → components/home/home.tsx (placeholder)
        └── BROWSER → components/home/browser.tsx (iframe → tokenlottery.io)
```

---

## Directory map

```
src/
├── app.tsx                    # Root component, tray init, page routing
├── index.html                 # HTML shell (#root)
├── style.css                  # Tailwind entry + CSS custom properties
├── type.d.ts                  # Global types: EventMap, StorageKey, NavigationMap
│
├── page/
│   ├── splash.tsx             # Onboarding carousel
│   └── home.tsx               # Shell with nav + dynamic home content
│
├── layout/
│   ├── page.tsx               # Page stack renderer + WindowBar
│   ├── modal.tsx              # Modal stack renderer
│   └── toast.tsx              # Toast stack renderer
│
├── components/
│   ├── window_bar.tsx         # Windows-only custom title bar
│   ├── splash/
│   │   ├── passcode.modal.tsx # 4-digit PIN entry (create + confirm)
│   │   ├── wallet.modal.tsx   # 12-word mnemonic import
│   │   ├── menu.modal.tsx     # Import options menu
│   │   ├── language.modal.tsx # Language picker
│   │   └── info.toast.tsx     # Transient info toast
│   └── home/
│       ├── navigation.tsx     # Bottom tab bar
│       ├── wallet.tsx         # Wallet tab UI (balance, send/receive stubs)
│       ├── home.tsx           # Home tab (placeholder)
│       └── browser.tsx        # Embedded iframe browser
│
├── core/
│   ├── wallet.ts              # WalletManager class (ethers HD wallet)
│   └── account.ts             # Login, IsLogged, GetPasscode, GetPhrase
│
├── utility/
│   ├── context.tsx            # OpenPage/Modal/Toast helpers
│   ├── event.ts               # Typed pub/sub event bus
│   ├── storage.ts             # Encrypted Tauri Store wrapper
│   ├── language.ts            # i18n loader + T() translation function
│   ├── theme.ts               # Light/dark OKLCH theme
│   └── misc.ts                # Passcode validation + SHA-256 hashing
│
└── assets/
    ├── lang/*.json            # Translation files (7 languages)
    ├── wordlist.json          # BIP39 English wordlist for import validation
    └── image/                 # Splash slide images

src-tauri/
├── src/
│   ├── main.rs                # Entry point → lib::run()
│   ├── lib.rs                 # Tauri builder, plugins, tray handler
│   ├── command.rs             # #[tauri::command] handlers
│   └── tun.rs                 # Windows tun2socks process management
├── tauri.conf.json            # Base Tauri config (identifier: io.gapp)
├── tauri.windows.conf.json    # Windows-specific window + permissions
├── Cargo.toml
└── gen/android/               # Generated Android project files
```

---

## Core modules (detailed)

### `core/wallet.ts` — WalletManager

| Method | Purpose |
|--------|---------|
| `constructor(mnemonic, index)` | Derives wallet at `m/44'/60'/0'/0/{index}` |
| `Retrieve()` | Returns `{ Public, Private }` keys |
| `Sign(message)` | Signs with private key |
| `Verify(message, signature)` | Checks signature matches this wallet |
| `static Generate()` | Creates random BIP39 mnemonic |
| `static Validate(mnemonic)` | Validates BIP39 phrase |
| `static Verify(message, sig)` | Recovers signer address from signature |

### `core/account.ts` — Session management

| Export | Storage key | Notes |
|--------|-------------|-------|
| `Login(passcode, phrase)` | `App.Passcode`, `App.Phrase` | Both encrypted via `SetValueSafe` |
| `IsLogged()` | reads both keys | **Currently hardcoded `return false`** — always shows Splash |
| `GetPasscode()` | `App.Passcode` | Decrypted retrieval |
| `GetPhrase()` | `App.Phrase` | Decrypted retrieval |
| `Logout()` | — | **Not implemented** (placeholder only) |

### `utility/storage.ts` — Persistence

- **Store file:** `application.bin` (Tauri Store plugin)
- **Encryption:** PBKDF2 (100k iterations, SHA-256) → AES-GCM 256-bit
- **Seed/Salt:** Hardcoded in source (`GApp.Internal.Seed.2025`, `GApp.Internal.Salt.2025`)
- **API:**
  - `SetValue` / `GetValue` — plaintext
  - `SetValueSafe` / `GetValueSafe` — encrypted

**Storage keys** (defined in `type.d.ts`):

| Key | Content |
|-----|---------|
| `App.Language` | Language code (plaintext) |
| `App.Theme` | `LIGHT` or `DARK` (plaintext) |
| `App.Passcode` | SHA-256 hashed 4-digit PIN (encrypted) |
| `App.Phrase` | BIP39 mnemonic (encrypted) |

### `utility/misc.ts` — Passcode helpers

- `ValidatePasscode(digits[])` — Returns `true` if first 4 digits ≠ second 4 (mismatch = invalid). Returns `false` when they match (valid).
- `HashWithSalt(message)` — SHA-256 of `message + 'GApp.Internal.Salt.Hash'`

---

## Event system

Defined in `type.d.ts`, implemented in `utility/event.ts`, consumed via `utility/context.tsx`.

| Event | Payload | Handler |
|-------|---------|---------|
| `Page.Open` | `JSX.Element` | `layout/page.tsx` pushes to stack |
| `Page.Close` | `number` (ID) | Removes page by React key |
| `Page.CloseAll` | `number` | Clears all pages |
| `Modal.Open` | `JSX.Element` | `layout/modal.tsx` pushes to stack |
| `Modal.Close` | `number` (ID) | Removes modal by key |
| `Modal.CloseAll` | `number` | Clears all modals |
| `Toast.Open` | `JSX.Element` | `layout/toast.tsx` pushes to stack |
| `Toast.Close` | `number` (ID) | Removes toast by key |
| `Home.Page` | `JSX.Element` | `page/home.tsx` sets active tab content |

**Usage pattern:**

```typescript
import Context from './utility/context';
import MyModal from './components/my.modal';

Context.OpenModal(MyModal);                          // auto ID via Date.now()
Context.OpenModal<{ Foo: string }>(MyModal, { Foo: 'bar' });
Context.CloseModal(id);
Context.OpenPage(HomePage, { ID: 1 });
Context.SetHomePage(WalletNavigation);
```

---

## Tauri backend

### Plugins

- `tauri-plugin-os` — `platform()` detection
- `tauri-plugin-store` — persistent key-value storage

### Invoke commands

| Command | Args | Platform | Behavior |
|---------|------|----------|----------|
| `tun_start` | `config: string` | Windows only | Writes `bin/config.yml`, launches `bin/tun2socks.exe` as admin |
| `tun_stop` | — | Windows only | `taskkill /IM tun2socks.exe /F` as admin |

**Note:** These commands are registered but **not yet called from the TypeScript frontend**.

### Windows-specific features

- Custom undecorated window (`tauri.windows.conf.json`: 360×640, no decorations)
- `WindowBar` component: minimize, restore (360×700), maximize, hide
- System tray: double-click toggles visibility; menu has Open/Quit
- Close button hides window (does not quit)

---

## Internationalization

- **Files:** `src/assets/lang/{en,fa,tr,ar,zh,ru,hi}.json`
- **Loader:** `utility/language.ts` — dynamic `import()` per language
- **Function:** `T('Dotted.Key.Path', ...args)` — `%s` positional substitution
- **RTL:** `fa` and `ar` set `document.documentElement.dir = 'rtl'`
- **Persistence:** `App.Language` storage key

**Adding a translation key:**

1. Add the key to all 7 JSON files under `src/assets/lang/`.
2. Use `T('Your.New.Key')` in components.

**Adding a language:**

1. Create `src/assets/lang/{code}.json`.
2. Add entry to `Language` array in `utility/language.ts`.
3. Add `case` in `Initialize()` switch.
4. Add key in `Splash.LanguageModal` section of each lang file.

---

## Theming

- **Manager:** `utility/theme.ts`
- **Modes:** `LIGHT` / `DARK`, persisted as `App.Theme`
- **Implementation:** Sets CSS custom properties on `:root` using OKLCH color space
- **Tailwind classes used:** `bg-base`, `text-base-text`, `border-base-border`, `bg-primary`, etc. (defined in `style.css`)

---

## Code conventions

Follow existing patterns when editing:

| Convention | Example |
|------------|---------|
| 4-space indent, Allman braces, semicolons | `function Foo() { ... }` |
| PascalCase for locals and params | `const ActiveIndex`, `function OnPush(Value)` |
| Default exports for components/modules | `export default function SplashPage()` |
| Named exports for utility functions | `export const T = ...` |
| JSDoc on all public functions | `/** Description @param ... */` |
| Tailwind utility classes inline | `className='flex h-full w-full'` |
| Motion for modal animations | `motion.div` with `y: '100%'` slide-up |
| Readonly props | `{ ID }: Readonly<{ ID: number }>` |

**ESLint:** `@stylistic/all` + `typescript-eslint` + `better-tailwindcss`. Run `npm run lint` before committing.

**Commits:** Conventional Commits — see `../../contributing.md`. Max 50-char subject, scopes like `wallet`, `auth`, `config`.

---

## Vite configuration

- **Root:** `./src` (not project root)
- **Dev port:** 1420 (strict)
- **HMR port:** 1421 (when `TAURI_DEV_HOST` is set)
- **Build output:** `dist/` (referenced by Tauri as `frontendDist`)

---

## Known gaps & work-in-progress

| Area | Status |
|------|--------|
| `IsLogged()` | Hardcoded `return false` — session never persists across restarts |
| `Logout()` | Placeholder, no storage clear implementation |
| Wallet balance | Shows hardcoded `0$` |
| Send / Receive / Sync | UI buttons exist, no logic |
| Transaction history | UI stub only |
| Home tab | Placeholder "Ali" boxes |
| Ledger pairing | Menu item shows "Coming Soon" toast |
| Watch account | Menu item shows "Coming Soon" toast |
| `tun_start` / `tun_stop` | Rust commands exist, not wired to frontend |
| 24-word mnemonic | WalletModal supports 12 words only; UI text mentions 24 |
| macOS / Linux | No platform config files |

---

## Security notes (for reviewers)

1. **Encryption keys are hardcoded** in `storage.ts` (seed/salt in source). Same binary = same key for all users.
2. **Passcode is 4 digits** — low entropy; hashed with static salt.
3. **Mnemonic stored locally** — encrypted but key derivation is not user-specific.
4. **Browser tab** loads external iframe (`tokenlottery.io`) with sandbox attrs.
5. **Context menu disabled** globally in `app.tsx`.
6. **F3/F5/F7/Ctrl+R** keyblock is commented out.

---

## Common tasks for AI agents

### Add a new modal

1. Create `src/components/{area}/{name}.modal.tsx` following `passcode.modal.tsx` pattern.
2. Use `motion.div` slide animation, accept `{ ID: number }` prop.
3. Open via `Context.OpenModal(YourModal)`.
4. Close via `SetIsClose(true)` → animation → `Context.CloseModal(ID)`.

### Add a new home tab

1. Add key to `NavigationMap` in `type.d.ts`.
2. Create component in `src/components/home/`.
3. Add case in `navigation.tsx` `OnClickNav` switch.
4. Add translation keys under `Home.*` in all lang files.

### Use wallet signing

```typescript
import WalletManager from '../core/wallet';
import { GetPhrase } from '../core/account';

const phrase = await GetPhrase();
const wallet = new WalletManager(phrase!, 0);
const sig = await wallet.Sign('Hello');
const valid = wallet.Verify('Hello', sig);
```

### Call Tauri commands (when needed)

```typescript
import { invoke } from '@tauri-apps/api/core';

await invoke('tun_start', { config: 'yaml content here' });
await invoke('tun_stop');
```

---

## Build & run reference

```bash
# From Application/
npm install
npm run desktop          # Dev: Tauri + Vite hot-reload
npm run desktop-build    # Release desktop binary
npm run android          # Android dev
npm run android-apk      # APK output
npm run android-aab      # AAB for Play Store
```

**Tauri identifier:** `io.gapp` (base), `io.gapp.windows` (Windows overlay config)

**Window defaults:** 360×640 (config), 360×700 (restore button in WindowBar)
