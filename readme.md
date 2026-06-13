# GApp (GApplication)

Cross-platform cryptocurrency wallet built with **React 19**, **TypeScript**, **Tauri 2**, and **ethers.js**. Supports Windows desktop and Android mobile.

## Repository layout

```
Wallet/                          # Git repository root
├── readme.md                    # This file — start here
├── contributing.md              # Conventional Commits guidelines
├── license                      # Apache 2.0
└── Application/                 # All application source code lives here
    ├── package.json             # npm scripts and dependencies
    ├── docs/readme.md           # Detailed architecture & AI reference
    ├── src/                     # React/TypeScript frontend
    └── src-tauri/               # Rust/Tauri backend
```

**Important:** All development, builds, and dependency installs happen inside `Application/`.

## Quick start

```bash
cd Application
npm install
npm run desktop          # Windows/macOS/Linux desktop dev
npm run android          # Android dev (requires Android SDK)
```

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server only (port 1420) |
| `npm run desktop` | Tauri desktop app with hot-reload |
| `npm run desktop-build` | Production desktop build |
| `npm run android` | Android dev build |
| `npm run android-aab` | Android App Bundle (Play Store) |
| `npm run android-apk` | Standalone APK |
| `npm run build` | Frontend production build (`tsc && vite build`) |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | Auto-fix lint issues |

## Features

- BIP39 mnemonic wallet creation and import (12-word phrase)
- HD wallet derivation (Ethereum path `m/44'/60'/0'/0/{index}`)
- 4-digit passcode with SHA-256 hashing
- AES-GCM encrypted persistent storage (Tauri Store plugin)
- Message signing and verification via ethers.js
- 7-language i18n (en, fa, tr, ar, zh, ru, hi) with RTL support
- Light/dark theme (OKLCH CSS variables)
- Windows system tray, custom title bar, tun2socks proxy backend (Rust)

## Platform support

| Platform | Status |
|----------|--------|
| Windows Desktop | Production-ready |
| Android | Development |
| macOS / Linux | Not configured |

## Documentation

- **[Application/docs/readme.md](Application/docs/readme.md)** — Architecture, file map, data flows, conventions, and known gaps. **Read this before making changes.**
- **[contributing.md](contributing.md)** — Commit message format (Conventional Commits)

## Tech stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, TypeScript, Vite 8, TailwindCSS 4, Motion, Swiper, ethers.js 6 |
| Backend | Tauri 2, Rust 2021, tauri-plugin-store, tauri-plugin-os |
| Desktop extras | System tray, custom window chrome, tun2socks (Windows) |

## Prerequisites

- Node.js 18+
- Rust toolchain (for Tauri)
- Android SDK (for Android builds only)
