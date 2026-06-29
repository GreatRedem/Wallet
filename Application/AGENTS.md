# Project Development Guide

## Project Overview

**GWallet** is a cross-platform Ethereum wallet application built with React, TypeScript, Tauri, and ethers.js. The frontend is a React SPA embedded in Tauri, with wallet cryptography managed via TypeScript. Sensitive data is encrypted and stored using the Tauri Store plugin. The Rust backend handles platform integration (system tray, OS detection).

**Key technologies:**

- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: Rust, Tauri 2
- Blockchain: ethers.js 6 (Ethereum HD wallet, BIP39)
- Storage: AES-GCM encryption + Tauri Store
- Platforms: Desktop (Windows/Mac/Linux) + Android + iOS

## Architecture

**No React Router.** Navigation uses a custom event bus (`utility/event.ts`) and Context API helpers (`utility/context.tsx`). Pages are managed through events.

## Code Formatting

This project uses **Prettier** for consistent code formatting across all files.

### Formatting Commands

- **Format all files**: `npm run format`
- **Check formatting**: `npm run format:check`

### Prettier Configuration

The Prettier configuration is defined in `.prettierrc`:

### Ignored Files

Prettier ignores the following files/directories (defined in `.prettierignore`):

### Editor Integration

For the best development experience, install the Prettier extension in your editor:

- **VS Code**: Install the "Prettier - Code formatter" extension
- **Settings**: Set "Format on Save" to true for automatic formatting

## Linting

The project uses ESLint with TypeScript support:

- **Lint**: `npm run lint`
- **Lint and fix**: `npm run lint:fix`

## Build Commands

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Desktop dev**: `npm run desktop`
- **Desktop build**: `npm run desktop-build`

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

## Notes

- All source files are automatically formatted when you run `npm run format`
- The project uses EditorConfig for consistent editor settings
- Prettier is configured to work well with the existing ESLint setup

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

## Useful links

- [Tauri docs](https://tauri.app/start/)
- [ethers.js documentation](https://docs.ethers.org/v6/)
- [Vite guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React docs](https://react.dev/)
- [Contributing guidelines](../contributing.md)
- [Architecture & AI reference](./Application/docs/readme.md)
