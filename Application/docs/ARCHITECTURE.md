# Wallet Application Architecture

## Overview
This is a cross-platform cryptocurrency wallet application built with **Tauri** (Rust backend) + **React** (TypeScript frontend). It supports desktop (Windows) and mobile (Android) platforms.

## Architecture Diagram

```mermaid
graph TB
    subgraph "Rust Backend (Tauri)"
        MAIN[main.rs]
        LIB[lib.rs]
        PLUGINS[Plugins<br/>- OS<br/>- Store]
        TRAY[Tray Icon Handler]
    end

    subgraph "React Frontend"
        APP[app.tsx<br/>Root Component]
        LAYOUT[page.tsx<br/>Page Layout]
        INTRO[intro.tsx<br/>Intro Page]
        WALLET[intro.wallet.tsx<br/>Wallet Creation]
    end

    subgraph "Core Utilities"
        CONTEXT[context.tsx<br/>Page Navigation]
        EVENT[event.ts<br/>Event Bus]
        LANGUAGE[language.ts<br/>i18n]
        STORAGE[storage.ts<br/>Persistent Storage]
        WALLET_MGR[wallet.ts<br/>Ethereum Wallet Manager]
    end

    subgraph "External Libraries"
        ETHERS[ethers.js<br/>Ethereum Library]
        TAURI_API[@tauri-apps/api<br/>Tauri APIs]
    end

    MAIN --> LIB
    LIB --> PLUGINS
    LIB --> TRAY
    
    APP --> LAYOUT
    APP --> LANGUAGE
    APP --> TAURI_API
    
    LAYOUT --> EVENT
    EVENT --> LAYOUT
    
    INTRO --> CONTEXT
    INTRO --> LANGUAGE
    INTRO --> WALLET
    
    WALLET --> CONTEXT
    WALLET --> LANGUAGE
    WALLET --> WALLET_MGR
    
    CONTEXT --> EVENT
    LANGUAGE --> STORAGE
    STORAGE --> TAURI_API
    
    WALLET_MGR --> ETHERS
    
    APP --> INTRO
    INTRO --> WALLET
    
    style MAIN fill:#f4d03f
    style LIB fill:#f4d03f
    style APP fill:#3498db
    style LAYOUT fill:#3498db
    style INTRO fill:#3498db
    style WALLET fill:#3498db
    style CONTEXT fill:#2ecc71
    style EVENT fill:#2ecc71
    style LANGUAGE fill:#2ecc71
    style STORAGE fill:#2ecc71
    style WALLET_MGR fill:#2ecc71
```

## Component Flow

### 1. Application Startup
```
Rust main.rs → lib.rs → Tauri Builder
                ↓
         Initialize Plugins (OS, Store)
                ↓
         React app.tsx Mounts
                ↓
         Initialize Language (from storage)
                ↓
         Setup Windows Tray Icon (if Windows)
                ↓
         Render PageLayout
                ↓
         Open IntroPage (default)
```

### 2. Page Navigation System
- **Event-driven**: Uses custom event bus (`event.ts`)
- **Events**: `Page.Open`, `Toast.Open`, `Toast.Close`, `Modal.Open`, `Modal.Close`
- **Flow**: Component calls `openPage(Component)` → emits `Page.Open` event → PageLayout receives and renders component

### 3. Wallet Creation Flow
```
IntroPage (onboarding)
    ↓ (user clicks "Create")
IntroWallet (form)
    ↓ (user submits)
WalletManager (generates wallet)
    ↓
Storage (persists wallet data)
```

## Key Components

### Backend (Rust)
- **`main.rs`**: Entry point, calls `app_lib::run()`
- **`lib.rs`**: Tauri app builder
  - Tray icon double-click handler (show/hide window)
  - Plugin initialization (OS, Store)

### Frontend (React)
- **`app.tsx`**: Root component
  - Initializes language
  - Sets up Windows tray icon with menu
  - Opens initial page (IntroPage)
  - Prevents browser shortcuts/context menu

- **`layout/page.tsx`**: Page stack container
  - Listens to `Page.Open` events
  - Renders active page with animations (AnimatePresence)

- **`page/intro.tsx`**: Onboarding page
  - Swiper carousel with intro slides
  - Language selector
  - "Create Wallet" and "Import Wallet" buttons

- **`components/intro.wallet.tsx`**: Wallet creation form
  - Name, password, confirm password fields
  - Password visibility toggles
  - Terms agreement checkbox

### Core Utilities
- **`utility/context.tsx`**: Page navigation helper
  - `openPage(Component, props)` - emits page open event

- **`utility/event.ts`**: Type-safe event bus
  - `on(name, listener)` - register listener
  - `emit(name, ...args)` - trigger event
  - `off(name, listener)` - remove listener

- **`utility/language.ts`**: Internationalization
  - Supports: en, fa, tr, ar, zh, ru, hi
  - `T(key, ...args)` - translate with placeholders
  - `setLanguage(code)` - switch language
  - Persists preference to storage
  - Auto-sets RTL for fa, ar

- **`utility/storage.ts`**: Persistent storage wrapper
  - Uses Tauri Store plugin
  - `setValue(key, value)` - save
  - `getValue(key)` - retrieve

- **`core/wallet.ts`**: Ethereum wallet manager
  - Uses ethers.js library
  - BIP39 mnemonic support
  - HD wallet derivation (m/44'/60'/0'/0/{index})
  - Methods:
    - `Generate()` - create random mnemonic
    - `Validate(mnemonic)` - check validity
    - `sign(message)` - sign with private key
    - `verify(message, signature)` - verify signature
    - `retrieve()` - get public/private keys

## Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS 4** - Styling
- **Motion** - Animations
- **Swiper** - Carousel
- **Ethers.js 6** - Ethereum library
- **React Icons** - Icon library

### Backend
- **Rust** - Systems language
- **Tauri 2** - Desktop/mobile framework
- **Tauri Plugins**:
  - `@tauri-apps/plugin-os` - OS detection
  - `@tauri-apps/plugin-store` - Persistent storage

## Data Flow

### Language Initialization
```
app.tsx → initLanguage()
    ↓
getValue('App.Language') from storage
    ↓
If found → setLanguage(saved)
If not → setLanguage('en')
    ↓
Load JSON bundle from assets/lang/{code}.json
    ↓
Set document direction (ltr/rtl)
```

### Page Navigation
```
Component → openPage(MyComponent)
    ↓
emit('Page.Open', <MyComponent />)
    ↓
PageLayout (listening to Page.Open)
    ↓
setLayoutMap(component)
    ↓
AnimatePresence renders with animation
```

## File Structure

```
Application/
├── src/
│   ├── app.tsx              # Root component
│   ├── index.html           # HTML entry
│   ├── style.css            # Global styles
│   ├── components/
│   │   └── intro.wallet.tsx # Wallet creation form
│   ├── core/
│   │   └── wallet.ts        # Ethereum wallet manager
│   ├── layout/
│   │   └── page.tsx         # Page layout container
│   ├── page/
│   │   └── intro.tsx        # Intro/onboarding page
│   ├── utility/
│   │   ├── context.tsx      # Page navigation
│   │   ├── event.ts         # Event bus
│   │   ├── language.ts      # i18n system
│   │   └── storage.ts       # Persistent storage
│   └── assets/
│       ├── image/           # Images
│       └── lang/            # Translation JSONs
└── src-tauri/
    └── src/
        ├── main.rs          # Rust entry point
        └── lib.rs           # Tauri app builder
```

## Key Patterns

1. **Event-Driven Architecture**: Components communicate via typed event bus rather than props drilling
2. **Single Page Stack**: Only one page active at a time, managed by PageLayout
3. **Utility-First Design**: Core functionality isolated in utility modules
4. **Type Safety**: TypeScript throughout with strict typing for events
5. **Cross-Platform**: Conditional logic for Windows (tray icon) vs mobile
