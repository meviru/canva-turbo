# GitHub Copilot Instructions for canva-turbo Monorepo

## 1. Monorepo Overview

This is a **Turborepo** monorepo managed with **npm workspaces**.

**Root layout**

- `apps/`
  - `apps/web` – Next.js + React + Tailwind **design editor frontend**.
  - `apps/backend` – Express + TypeScript **API backend**.
- `packages/`
  - `packages/ui` – Shared UI library for React/Tailwind components.
  - `packages/eslint-config` – Centralized ESLint configs.
  - `packages/typescript-config` – Base TSConfigs for apps and packages.
- Root-level tooling:
  - `package.json` – workspace + scripts.
  - `turbo.json` – pipeline definitions.
  - Root `README.md` – repo documentation.

**Root scripts**

- `npm run dev` → `turbo run dev`
- `npm run build` → `turbo run build`
- `npm run lint` → `turbo run lint`
- `npm run check-types` → `turbo run check-types`
- `npm run format` → `prettier --write "**/*.{ts,tsx,md}"`

**Copilot:**
- Respect **app vs package boundaries**.
- Put **shared logic** in `packages/*` or `apps/web/app/shared/*` instead of duplicating code across routes.

---

## 2. Product / Domain Context

This repo is a **browser-based design editor**, similar to Canva:

- Canvas built on **Fabric.js**.
- Users work on **designs** (identified by `designId`).
- There is a **workspace** area and commands for **canvas actions**, likely supporting undo/redo, object manipulation, etc.
- Backend handles:
  - Asset uploads (e.g., images via `multer` / `imagekit`).
  - Persistence (MongoDB via `mongoose`).
  - External integrations (e.g., Unsplash).

**Copilot:**
- When generating examples or new features, bias towards:
  - Canvas-related utilities (zoom, pan, layers, object properties).
  - Design-oriented actions (duplicate, delete, align, resize, etc.).
  - REST endpoints that map to design entities, assets, and user data.

---

## 3. Frontend: `apps/web`

### 3.1 Tech Stack

- **Next.js** (App Router, ESM).
- **React** (function components + hooks).
- **TypeScript** (`tsconfig.json`).
- **Tailwind CSS** v4 (`tailwindcss`, `@tailwindcss/postcss`, `postcss.config.mjs`).
- **State management:** `@reduxjs/toolkit` + `react-redux` in `app/store`.
- **UI & tooling:**
  - Radix UI (`@radix-ui/react-*`) for primitives.
  - `lucide-react`, `@tabler/icons-react` for icons.
  - `sonner` for toasts.
  - `next-themes` for dark/light mode.
  - `axios` for HTTP.
  - `fabric` for canvas.

### 3.2 Folder Structure & Responsibilities

`apps/web/app/`:

- `app/(routes)/`
  - `design/`
    - `[designId]/` – **Design editor route** for a single design.
    - `components/` – Components specific to the design route.
      - `tabs/` – Tabbed UI (e.g., layers, uploads, templates, etc.).
    - `constants/` – Design-specific constants (tabs config, labels, etc.).
  - `workspace/`
    - `components/` – Shared workspace UI (layout, top-bar, side-panels).
    - `constants/` – Workspace-specific constants and configs.

- `app/components/`
  - `auth/` – Auth-related UI (login, signup, user menu).
  - `ui/` – Generic UI components (buttons, inputs, dialogs), typically built on Radix + Tailwind. Some may mirror `@repo/ui` or extend it.

- `app/handler/[...stack]/`
  - Stack-related handler for **Stackframe** auth/session integration.
  - Follow existing patterns here; don’t introduce other auth frameworks.

- `app/hooks/`
  - Reusable **React hooks** (e.g., `useSomething`, `useCanvas`, `useShortcut`, etc.).
  - Hooks should **not** contain UI; they manage logic and state.

- `app/services/`
  - API clients and wrappers (e.g., `axios` instances, REST calls).
  - Group by domain: `designService`, `assetService`, etc.

- `app/shared/`
  - `commands/` – Command pattern for canvas actions (undo/redo, delete, rotate, etc.).
  - `lib/` – Generic utilities (helpers, formatting, math, etc.).
  - `models/` – **TypeScript models/interfaces** (Design, Element, User, etc.).

- `app/store/`
  - `slices/` – Redux Toolkit slices (e.g., `canvasSlice`, `designSlice`, `uiSlice`).
  - Store configuration (root reducer, typed hooks).

`apps/web/public/icons/` – Static SVGs/icons.

Root frontend files:

- `components.json` – UI generator / shadcn-like config.
- `eslint.config.js` – ESLint config for web app.
- `next.config.js` – Next.js configuration.
- `stack.tsx` – Stackframe integration / provider.
- `tsconfig.json`, `next-env.d.ts` – TS setup.

### 3.3 Conventions for New Code in `apps/web`

**Routing & Components**

- Use **App Router patterns** (`app/(routes)/...`).
- Co-locate route-specific components under their route directory (`design/components`, `workspace/components`).
- For truly reusable UI, either:
  - Put them in `app/components/ui`, or
  - Create/extend them in `packages/ui`.

**State Management**

- Prefer **Redux Toolkit slices** in `app/store/slices` for global app state (design, canvas, user).
- Use local `useState` or `useReducer` for small UI-only concerns.
- Use typed hooks (`useAppDispatch`, `useAppSelector`) if present.

**Commands & Canvas**

- When adding new canvas features:
  - Implement actions as **commands** in `app/shared/commands` (e.g., `ResizeObjectCommand`, `ChangeColorCommand`).
  - Keep Fabric-specific logic in dedicated helpers/hooks, not scattered in multiple components.
- Avoid direct mutation of Fabric canvas in many places; centralize updates through a well-defined API or command system.

**Hooks**

- New hook files go under `app/hooks`.
- Name hooks with a clear purpose, e.g., `useKeyboardShortcuts`, `useCanvasHistory`, `useSelectionBox`.

**Services & API calls**

- API calls belong in `app/services`.
- Use a central `axios` instance if present (for baseURL, interceptors).
- Keep components lean: call services from hooks or thunks, not directly in deeply nested components.

**Styling & UI**

- Use **Tailwind CSS** classes.
- Use `clsx` and `tailwind-merge` (commonly via a `cn` helper) to merge conditional classNames.
- Prefer **Radix UI** primitives wrapped in our components for dialogs, menus, tooltips, etc.
- Keep `className` readable: group utilities logically and split across lines if long.

---

## 4. Backend: `apps/backend`

### 4.1 Tech Stack

- **Node.js** + **Express 5**.
- **TypeScript** (driven by `ts-node` in dev and compiled to `dist` for prod).
- **MongoDB** via `mongoose`.
- **File handling** via `multer`.
- **CORS** via `cors`.
- **Env configuration** via `dotenv`.
- External integrations via `imagekit`, `unsplash-js`, `cross-fetch`.

### 4.2 Folder Structure & Responsibilities

`apps/backend/src/`:

- `config/`
  - Database connection (e.g., Mongo URI, mongoose setup).
  - Configuration for `imagekit`, `unsplash`, or other services.
  - Environment variable loading and validation.

- `controllers/`
  - Route handlers containing **request/response logic**.
  - Controllers should be thin: validate input, call services/models, return results.

- `models/`
  - Mongoose schemas and models.
  - Model names should be singular and descriptive (e.g., `Design`, `User`, `Asset`).

- `routes/`
  - Express route definitions (e.g., `/designs`, `/assets`, `/auth`).
  - Each file wires HTTP verbs to controllers.

Other backend files:

- `nodemon.json` – Dev server configuration.
- `tsconfig.json` – Backend TS configuration.
- `package.json` – Scripts:
  - `dev`: `nodemon` (likely using `ts-node` to run `src/index.ts`).
  - `start`: `node dist/index.js`.

### 4.3 Conventions for New Backend Code

- Place initial Express entry point in `src/index.ts` (or follow existing pattern).
- For **new endpoints**:
  - Add route in `src/routes`.
  - Add corresponding controller in `src/controllers`.
  - Define or reuse Mongoose models under `src/models`.
- Keep business logic in **services or model statics** if controllers become heavy.

**Error Handling & Security**

- Use centralized error middleware (e.g., `app.use(errorHandler)`).
- Always validate input (params, body, query) before using it.
- Don’t return raw stack traces or internal error messages to clients.
- Load secrets and configuration from environment variables; never hardcode keys.

**File Uploads and Assets**

- Use `multer` for multipart uploads.
- Keep upload config (storage, limits, file filters) modular and reusable.
- Handle integration with `imagekit` or similar services in dedicated config/service files.

---

## 5. Shared Packages: `packages/*`

### 5.1 `packages/ui`

- `src/` – Shared React components and utilities.
- `turbo/generators/templates/` – Templates for generating new UI components.
- `eslint.config.mjs`, `tsconfig.json`, `package.json` – Local tooling.

**Conventions**

- Build reusable components that are:
  - Headless or styled using Tailwind (consistent with `apps/web`).
  - Possibly built on top of Radix UI primitives.
- Avoid coupling UI package components to app-specific state (Redux slices, app services). They should be generic.

### 5.2 `packages/eslint-config`

- `base.js`, `next.js`, `react-internal.js` – Base and app-specific ESLint configs.
- Used by apps to ensure consistent lint rules.

**Copilot:**
- Don’t introduce new ad-hoc ESLint rules in apps; extend or adjust the shared configs instead.

### 5.3 `packages/typescript-config`

- `base.json`, `nextjs.json`, `react-library.json` – Shared TS rules.
- Apps and packages extend these via their local `tsconfig.json`.

**Copilot:**
- When adding a new app/package, extend from these base configs rather than writing new TS configs from scratch.

---

## 6. Tooling & Coding Style

### TypeScript

- Prefer `type`/`interface` definitions over `any`.
- Use generics for reusable hooks, services, and helpers.
- Type:
  - Component props.
  - Return values of functions (especially async/Promise-returning ones).
  - Redux slices’ state and actions.

### ESLint & Prettier

- Follow `@repo/eslint-config` rules.
- Rely on Prettier formatting via `npm run format` at root.
- Do not introduce other formatters or conflicting configs.

### General Style

- Use **function components** and hooks only (no React class components).
- Prefer composition over inheritance.
- Keep functions and modules small and focused; extract helpers when logic grows.

---

## 7. Git, PRs, and Changes

- Group changes logically:
  - Frontend-only changes → `apps/web` and optionally `packages/ui`.
  - Backend-only changes → `apps/backend`.
  - Shared logic → `packages/*` or `app/shared/*` as appropriate.
- Avoid massive refactors unless necessary; prefer incremental and well-scoped changes.

---

## 8. Things to Avoid

- Don’t:
  - Introduce new state libraries (Zustand, MobX, etc.) when Redux Toolkit already exists.
  - Introduce new styling systems (CSS-in-JS, MUI, etc.) instead of Tailwind + Radix.
  - Use `any` without a clear and documented reason.
  - Hardcode secrets, keys, or environment-specific URLs.
  - Scatter Fabric canvas mutations across many components; prefer centralized APIs/commands.

---

## 9. How Copilot Should Respond

- Generate **complete, ready-to-paste** snippets including imports.
- Use the conventions and folder structure of the file being edited:
  - In `apps/web/app/(routes)/design/...` → Next.js App Router + canvas/editor patterns.
  - In `apps/backend/src/routes` → Express routes calling controllers.
  - In `packages/ui/src` → Generic, reusable React components.
- Keep explanations short and focused on why the chosen approach fits this repo’s architecture.
