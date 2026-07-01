# Language Sub-Menu — Specification

> **Feature**: Opening a language selection sub-menu when clicking the Language button on the intro.tsx page.

---

## 1. Overview

The Language button on the intro/onboarding page currently renders as a static `<button>` with a globe icon, the text "Language", and a down-arrow chevron. It has **no `onClick` handler**. This feature wires up that button to open a **modal dialog** listing available languages, allowing the user to switch the app locale.

---

## 2. UI Pattern: Centered Modal Dialog

| Aspect | Decision |
|--------|----------|
| Container | A centered modal dialog with a semi-transparent backdrop |
| Backdrop | `bg-black/25 backdrop-blur-xs` (same as IntroWallet) |
| Animation | **Fade + Scale**: backdrop fades in (`opacity: 0 → 1`), content scales up from `scale: 0.9 → 1` |
| Dismissal | Selecting a language closes the modal (auto-dismiss). Backdrop click should also dismiss. |

### 2.1 Modal Anatomy

```
┌─────────────────────────────────────┐
│          (backdrop overlay)          │
│                                     │
│   ┌─────────────────────────────┐   │
│   │     Select Language         │   │
│   │                             │   │
│   │  🇺🇸  English           ✓   │   │  ← active (checkmark)
│   │  🇮🇷  فارسی                 │   │  ← inactive
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Backdrop** — Same as IntroWallet:
- `absolute inset-0 z-10 size-full bg-black/25 backdrop-blur-xs`
- click handler calls `onClose` to dismiss

**Modal card** — Positioned absolute center; rounded corners; card-like appearance.

---

## 3. Language List Content

| Aspect | Decision |
|--------|----------|
| Languages shown | Only **English** and **Persian** (the two with translation JSONs) |
| Display format | **Emoji flag + Native language name** |
| Active indicator | **Checkmark icon** on the right side of the active row |
| Row layout | Flag on left, name next to it, checkmark on right (if active) |

**Row states:**

| State | Visual |
|-------|--------|
| Active | `🇺🇸 English` + `✓` checkmark, normal background |
| Inactive | `🇮🇷 فارسی` no checkmark |

### 3.1 Flag mapping (emoji, not flag-icons package)

| Language | Country | Emoji Flag |
|----------|---------|------------|
| English | us | 🇺🇸 |
| Persian | ir | 🇮🇷 |

Use inline emoji flag characters — no need to import the `flag-icons` CSS dependency.

---

## 4. Behavior & Interactions

### 4.1 Opening

- Clicking the Language button (`<button className="btn-normal ...">`) triggers the modal to open.
- Implementation: use the same `subPage` state + `AnimatePresence` pattern already used for IntroWallet in `intro.tsx`.
- The modal component receives an `onClose` callback.

### 4.2 Language Selection

- Clicking a language row calls `setLanguage(code)`.
- The modal auto-dismisses via `onClose`.
- The **Swiper carousel slides below** may need to update their text immediately to reflect the new language (they already use `T()` which is reactive on re-render, so the parent re-mounting should trigger re-render).
- Document direction updates are handled by `setLanguage()` (`fa`/`ar` → RTL, others → LTR).

### 4.3 Dismissal

| Trigger | Behavior |
|---------|----------|
| Select a language | ✓ Close modal |
| Click backdrop | ✓ Close modal |
| Click close button | ✓ Close modal (include an X button in the modal header) |

### 4.4 State Handling

- Use `subPage` state (already exists in `intro.tsx`) to render the modal component.
- Modal gets `onClose` callback that sets `subPage(undefined)`.

---

## 5. Component Structure

### 5.1 New file: `src/components/intro.language.tsx`

A new reusable component specifically for the language selection modal.

**Props**:
```typescript
interface IntroLanguageProps {
    onClose: () => void;
}
```

**Internal logic**:
- Import `getLanguage()` and `setLanguage()` from `../utility/language`
- Import `T()` for translating the modal title
- Read current active language via `getLanguage()`
- Define a local list of available languages (en, fa) with their emoji flags and native names
- On row click: call `setLanguage(code)` then `onClose()`

### 5.2 Changes to `src/page/intro.tsx`

- Add `onClick` handler to the Language button:
  ```
  onClick={ () => { setSubPage(<IntroLanguage onClose={ () => { setSubPage(undefined); } } />); } }
  ```
- Import the new `IntroLanguage` component.

### 5.3 Changes to translation files

Add new key to `en.json`:
```json
"Intro": {
    "Language": {
        "Select": "Select Language"
    }
}
```

Add new key to `fa.json`:
```json
"Intro": {
    "Language": {
        "Select": "انتخاب زبان"
    }
}
```

---

## 6. Animation Details

**Backdrop** (motion.div):
```
initial: { opacity: 0 }
animate: { opacity: 1 }
exit: { opacity: 0 }
```

**Modal card** (motion.div):
```
initial: { opacity: 0, scale: 0.9 }
animate: { opacity: 1, scale: 1 }
exit: { opacity: 0, scale: 0.9 }
transition: { duration: 0.2 }
```

Matches the scale animation pattern already used on `IntroPage`'s root `motion.div`:
```tsx
initial={ { scale: 0 } }
animate={ { scale: 1 } }
```

---

## 7. Excluded / Out of Scope

| Item | Reason |
|------|--------|
| Other 5 languages (tr, ar, zh, ru, hi) | No translation JSONs exist; will be added in a future pass |
| flag-icons CSS dependency | Using emoji flags instead |
| flag-icons CSS import | Not needed since we use emoji |
| Zustand for state | Not needed — local `subPage` state is sufficient |
| toast/notification on language change | Not requested; language switches silently |

---

## 8. Dependencies

No new npm packages needed. Existing dependencies used:
- `motion` — for `motion.div` and `AnimatePresence` (already in use)
- `react-icons/io5` — `IoClose` for close button (already used by IntroWallet)
- `react-icons/fi` — `FiCheck` for checkmark indicator (new import)
- `T()` from `../utility/language` — for translations
- `getLanguage()` / `setLanguage()` from `../utility/language` — for reading/switching language

---

## 9. Files to Modify/Create

| File | Action |
|------|--------|
| `src/components/intro.language.tsx` | **Create** — Language selection modal component |
| `src/page/intro.tsx` | **Modify** — Add onClick to Language button, import new component |
| `src/assets/lang/en.json` | **Modify** — Add `Intro.Language.Select` key |
| `src/assets/lang/fa.json` | **Modify** — Add `Intro.Language.Select` key |
