# AGENTS.md

This file describes the project architecture, directory layout, development conventions, and known issues for AI coding agents and new developers. Read it before making changes.

> `docs/architecture.md` gives a higher-level overview. This file is the operational source of truth for tooling, conventions, and pitfalls.

## 1. Project Overview

`vyckey.github.io` is a personal website plus an online developer toolbox: a pure frontend single-page application (SPA) with no backend and no database.

- Home `/`: a terminal-styled personal introduction page.
- Tools `/tools/*`: timestamp, timer, text diff, encoder/decoder, encryption/decryption, JSON, QR code, IP lookup, Cron, regex, password generator, and more.
- All computation happens locally in the browser; the only external request is the IP lookup (`ip-api.com`).
- UI copy is primarily in Chinese.

The build tooling was migrated from Create React App (`react-scripts`) to **Vite** so the project can run with the native TypeScript 7 compiler. Vite transpiles TS/JSX without calling the TypeScript compiler API; type checking is a separate `tsc --noEmit` step.

### Tech Stack

| Category | Choice |
| --- | --- |
| Framework | React 19 + TypeScript 7 |
| UI | Ant Design 6 (`antd`) + `@ant-design/icons` |
| Routing | React Router 7 (`createBrowserRouter`) |
| Build | Vite 8 + `@vitejs/plugin-react` |
| Testing | Vitest 5 + jsdom + Testing Library |
| Time | `moment` / `moment-timezone`, a little `dayjs` (antd DatePicker) |
| Crypto | `crypto-js` (MD5/Base64/HMAC), `jsencrypt` (RSA) |
| Text diff | `diff` + `diff2html` + `highlight.js` |
| JSON viewer | `react-json-view` |
| Package manager | pnpm 11 (the repo only has `pnpm-lock.yaml`) |
| Deployment | GitHub Pages (GitHub Actions → `gh-pages` branch); Docker + Nginx is also available |

## 2. Quick Commands

```bash
pnpm install                              # Install dependencies
CI=true pnpm install --no-frozen-lockfile # After package.json changes; updates the lockfile
pnpm start                                # Vite dev server on http://localhost:3000
pnpm dev                                  # Same as pnpm start
pnpm build                                # Production build, output to build/
pnpm preview                              # Preview the production build
pnpm test                                 # Vitest run (CI mode)
pnpm test:watch                           # Vitest watch mode
npx tsc --noEmit                          # Type check only; this currently passes
pnpm run eslint                           # ESLint; currently fails because of TypeScript 7
pnpm run prettier-check                   # Check formatting
pnpm run prettier-write                   # Format (do not run across the whole repo, see Section 6)
pnpm deploy                               # Build and publish to gh-pages
docker compose up --build                 # Build the image and serve via Nginx on port 80
```

> Measured locally: Node `v24.20.0`, pnpm `11.25.0`, npm `11.19.0`. CI uses Node 24; Docker uses Node 24.

## 3. Architecture

### 3.1 Startup Chain

```
index.html  (#root, /src/index.tsx, GitHub Pages SPA redirect script)
        │
        ▼
src/index.tsx  ── ReactDOM.createRoot ──▶  src/App.tsx
                                             │  <RouterProvider router={router} />
                                             ▼
                                   src/router/Router.tsx
                     ┌───────────────────────┼──────────────────────────┐
                     ▼                       ▼                          ▼
           pages/Homepage.tsx       tools/password               pages/ToolsLayout.tsx
           (/, /home)               PasswordGenerator            (/tools, top menu + <Outlet />)
                                                                        │
                                              ┌─────────────────────────┴───────────────────────┐
                                              ▼                                                 ▼
                               /tools/timestamp … /tools/regex                     components/tools/*.tsx
```

`vite.config.ts` wires the React plugin, pins the dev server to port 3000, writes production output to `build/`, and configures Vitest with jsdom and `src/setupTests.js`.

### 3.2 Route Table

All routes are defined in `src/router/Router.tsx` with `createBrowserRouter`.

| Path | Component | Description |
| --- | --- | --- |
| `/` | `pages/Homepage.tsx` | Terminal-styled home page |
| `/home` | `pages/Homepage.tsx` | Alias of the home page |
| `/tools` | `pages/ToolsLayout.tsx` | Tools layout; has no index child route itself |
| `/tools/timestamp` | `components/tools/Timestamp.tsx` | Timestamp/date conversion, time zones |
| `/tools/timer` | `components/tools/TimerPanel.tsx` | Countdown and elapsed-time tools |
| `/tools/textdiff` | `components/tools/TextDiffTool.tsx` | Text comparison; rendering delegated to `TextDiffView.tsx` |
| `/tools/encoder_decoder` | `components/tools/EncoderDecoder.tsx` | Encoding/decoding (currently only a "case conversion" tab) |
| `/tools/encryption` | `components/tools/Encryption.tsx` | MD5, Base64, RSA encryption/decryption |
| `/tools/json` | `components/tools/JsonTools.tsx` | JSON parsing, formatting, sorting, themes, download |
| `/tools/qrcode` | `components/tools/QRCodeGenerator.tsx` | QR code generation with canvas/SVG, colors, size, and logo |
| `/tools/ipaddress` | `components/tools/IPAddressView.tsx` | IPv4/IPv6 validation + `ip-api.com` lookup |
| `/tools/cron` | `components/tools/CronTool.tsx` | Cron parsing and next-run prediction |
| `/tools/regex` | `components/tools/RegexTool.tsx` | Regex matching, highlighting, replacement, flags, syntax reference |
| `/tools/password` | `components/tools/PasswordGenerator.tsx` | **Special case**: mounted directly at the root router level, bypasses `ToolsLayout`, and is not in the top menu |

### 3.3 Layout and Navigation

`src/pages/ToolsLayout.tsx`:

- Uses antd `Layout` (Header/Content/Footer) plus a horizontal `Menu`.
- `topItems` defines the menu entries; **each key must match the last segment of the route path** (for example, `timestamp`).
- The selected key is derived from the last segment of `useLocation().pathname`; unknown values fall back to `timestamp`.
- Menu clicks navigate via `navigate(e.keyPath[0])`; tool content is rendered through `<Outlet />`.
- When adding a tool, you must update both `Router.tsx` and `topItems`; otherwise it cannot be reached from the menu.

### 3.4 Tool Component Pattern

Each tool is a standalone function component under `src/components/tools/`:

- State is fully local (`useState` / `useRef` / `useEffect`); there is no Redux/Zustand/Context.
- Forms use antd `Form`, feedback uses `message`, and layout uses `Flex` / `Space` / `Card`.
- Multi-mode tools are organized with `Tabs type="card"` (encryption, encoding, JSON, regex).
- Prefer reusing `CopyableTextArea` for text input/output; use `CopyButton` for copy actions.
- Timer logic is created in `useEffect` (or a submit handler) and cleared in the cleanup function.

### 3.5 Shared Modules

| Module | Responsibility |
| --- | --- |
| `src/components/CopyButton.tsx` | Copy to clipboard using `src/utils/clipboard.ts`; shows success/failure feedback |
| `src/components/CopyableTextArea.tsx` | `TextArea` with a copy button (placed left of antd's clear icon) |
| `src/util/password.tsx` | Deterministic password hashing based on HMAC-SHA256 and password generation |
| `src/utils/clipboard.ts` | Clipboard API plus `document.execCommand('copy')` fallback |
| `src/utils/cronParser.ts` | Cron expression parsing, validation and Chinese descriptions |
| `src/utils/cronScheduler.ts` | Predicts the next N execution times |
| `src/utils/ip.ts` | Strict IPv4/IPv6 validation |
| `src/utils/passwordStrength.ts` | UI strength score for generated passwords |
| `src/utils/regex.ts` | Regex match collection and highlighting without infinite loops |
| `src/utils/rsa.ts` | PKCS#1 → PKCS#8 private key conversion |

> Note: utility code is split between `src/util` (singular) and `src/utils` (plural). This is historical legacy. Put new pure logic in `src/utils/` and do not widen the split.

### 3.6 Data Flow

1. The browser requests any path; GitHub Pages restores it as an SPA route via `public/404.html` and the redirect script in the root `index.html`.
2. `RouterProvider` matches the route, and `ToolsLayout` renders the menu plus `<Outlet />`.
3. Tool components own their state and call browser APIs or third-party libraries directly; results are displayed with antd components.
4. There are no network requests other than the IP lookup, and there is no global cache or persistence (a refresh resets everything).

### 3.7 Styling

- `src/index.css`: global base styles, fonts, and `.form-container`.
- `src/App.css`: global styles, including the terminal-themed home page (`.bright-*`, `.terminal-*`).
- Components use mostly antd `style` props; there are no CSS Modules, Tailwind, or CSS-in-JS solutions.
- No custom theme is configured; the antd default theme is used (`theme.useToken()` reads colors).

### 3.8 Build and Deployment

- **Vite**: `pnpm build` runs `vite build` with `outDir: 'build'` and hashed asset filenames.
- **GitHub Pages**: `.github/workflows/node.js.yml` runs on pushes to `main`/`test` (and PRs to `main`): install pnpm → `pnpm install --frozen-lockfile` → `pnpm build` → deploy `build/` to the `gh-pages` branch with `JamesIves/github-pages-deploy-action`.
- **SPA routing**: `public/404.html` and the rafgraph/spa-github-pages script in the root `index.html` work together to keep deep links working.
- **Docker**: `Dockerfile` is a multi-stage build (`node:24-alpine` build with pnpm → `nginx:alpine` serve), and `nginx.conf` uses `try_files $uri $uri/ /index.html` for history routing.
- **Artifacts**: `build/` is generated and ignored by `.gitignore`; never edit or commit it manually.

## 4. Main File Structure

```
vyckey.github.io/
├── AGENTS.md                       # This file
├── README.md                       # Project overview
├── index.html                      # Vite entry HTML (must stay at the repo root)
├── vite.config.ts                  # Vite + Vitest configuration
├── package.json                    # Dependencies and scripts
├── pnpm-lock.yaml                  # The only lockfile (no package-lock.json)
├── pnpm-workspace.yaml             # Contains only allowBuilds configuration
├── tsconfig.json                   # strict; bundler resolution; Vite/Vitest types
├── eslint.config.mjs               # ESLint 10 flat config (TS + React)
├── .prettierrc.yaml                # Single quotes, 2 spaces, printWidth 80, etc.
├── Dockerfile                      # Multi-stage build (Node → Nginx)
├── docker-compose.yml              # Exposes port 80
├── nginx.conf                      # Static serving + SPA fallback + gzip
├── .dockerignore
├── .github/
│   └── workflows/
│       └── node.js.yml             # CI: pnpm build and deploy to gh-pages
├── docs/
│   └── architecture.md             # High-level architecture overview
├── public/                         # Static assets, copied as-is into build/
│   ├── 404.html                    # GitHub Pages deep-link fallback
│   ├── favicon.ico
│   ├── logo192.png / logo512.png
│   ├── manifest.json
│   ├── robots.txt
│   └── playground/
│       └── firework/               # Standalone static mini-game (not part of React routing)
│           ├── index.html
│           ├── style.css
│           ├── favicon.png / firework_preview.png
│           ├── js/{MyMath,Stage,fscreen,script}.js
│           ├── README.md / LICENSE
├── src/
│   ├── index.tsx                   # Application entry point (ReactDOM.createRoot)
│   ├── App.tsx                     # Mounts only RouterProvider
│   ├── App.css                     # Global styles + terminal home theme
│   ├── index.css                   # Global base styles
│   ├── App.test.tsx                # Vitest smoke test for the home page
│   ├── setupTests.js               # jest-dom matchers + jsdom polyfills
│   ├── logo.svg
│   ├── router/
│   │   └── Router.tsx              # All route definitions
│   ├── pages/
│   │   ├── Homepage.tsx            # Terminal-styled home page
│   │   └── ToolsLayout.tsx         # Tools layout + top menu
│   ├── components/
│   │   ├── CopyButton.tsx          # Shared copy button
│   │   ├── CopyableTextArea.tsx    # Text area with a copy button
│   │   └── tools/                  # Tool components (one per route)
│   │       ├── Timestamp.tsx
│   │       ├── TimerPanel.tsx
│   │       ├── TextDiffTool.tsx
│   │       ├── TextDiffView.tsx    # diff2html rendering layer
│   │       ├── EncoderDecoder.tsx
│   │       ├── Encryption.tsx
│   │       ├── JsonTools.tsx
│   │       ├── QRCodeGenerator.tsx
│   │       ├── IPAddressView.tsx
│   │       ├── CronTool.tsx
│   │       ├── RegexTool.tsx
│   │       └── PasswordGenerator.tsx
│   ├── util/
│   │   └── password.tsx            # Password hashing/generation
│   └── utils/
│       ├── clipboard.ts            # Clipboard API + fallback
│       ├── cronParser.ts           # Cron parsing and validation
│       ├── cronScheduler.ts        # Cron next-run prediction
│       ├── ip.ts                   # IPv4/IPv6 validation
│       ├── passwordStrength.ts     # Password strength score
│       ├── regex.ts                # Regex matching/highlighting
│       └── rsa.ts                  # PKCS#1 to PKCS#8 conversion
└── build/                          # Build output (generated, ignored, do not edit)
```

> `public/index.html` intentionally does not exist: Vite uses the root `index.html`, and a stray `public/index.html` would conflict with it during build.

## 5. Development Conventions

1. **Component style**: function components + hooks, default exports. Existing code commonly uses `React.FC`; stay consistent. TypeScript `strict` is enabled, so avoid adding new `any`.
2. **UI**: prefer antd components and icons; do not add a second UI library. Use Chinese copy and `message` for feedback.
3. **Copy actions**: use `CopyButton` / `CopyableTextArea`; do not reimplement clipboard logic in each tool.
4. **Time handling**: use `moment-timezone` for the timestamp tool and `moment` durations for the timer; antd DatePicker returns `dayjs`, so pay attention when converting.
5. **Pure logic**: extract parseable/calculable logic into `src/utils/`; components should only handle interaction and presentation.
6. **New dependencies**: declare them explicitly in `package.json` and update `pnpm-lock.yaml`; do not rely on transitive dependencies.
7. **Formatting**: follow `.prettierrc.yaml` (single quotes, semicolons, 2 spaces, `printWidth: 80`, `bracketSameLine: true`, `arrowParens: avoid`). Format only the files you change; never run `prettier-write` across the whole repo.
8. **Build artifacts**: do not edit or commit `build/`; static assets under `public/` are copied as-is.
9. **Routes and menu**: keep the route path segment, the `ToolsLayout` menu key, and the component name semantically consistent.
10. **No backend**: do not assume a server API exists; prefer browser-local implementations when network capability is needed.
11. **Environment variables**: use Vite's `import.meta.env.VITE_*` convention. There is no CRA `REACT_APP_*` support and no `process.env` injection.
12. **React 19 hooks**: `useState` and `useRef` require an initial argument when explicitly typed. Prefer `useRef<ReturnType<typeof setInterval> | null>(null)` for timer handles; do not use `NodeJS.Timer`, which conflicts with DOM timer signatures.
13. **TypeScript config**: keep `moduleResolution: "bundler"` and `types: ["vite/client", "vitest/globals"]`. Do not add `"node"` to `types` (Node globals such as `setInterval` conflict with DOM types in the browser code). `@types/node` is installed only for tooling.
14. **Tests**: Vitest runs in jsdom. `src/setupTests.js` supplies the `ResizeObserver` and `matchMedia` polyfills required by antd; keep them when adding antd components to tests.
15. **No type checking during build**: `vite build` strips types but does not check them. Run `npx tsc --noEmit` before considering a change complete.

### Adding a New Tool

1. Create a component in `src/components/tools/` (for example, `MyTool.tsx`).
2. Import it in `src/router/Router.tsx` and add `{ path: 'mytool', element: <MyTool /> }` to the `tools` children.
3. Add `{ key: 'mytool', label: '<Chinese name>', icon: ... }` to `topItems` in `src/pages/ToolsLayout.tsx`; the key must exactly match the path.
4. Reuse `CopyableTextArea` / `CopyButton` and the antd form/card layout.
5. Run `npx tsc --noEmit`, `pnpm test`, and `pnpm build`, then manually verify `/tools/mytool`. If the tool needs a standalone layout (like `/tools/password`), register it separately at the root router level and document it in this file.

## 6. Verification and Self-Check

At minimum run:

```bash
npx tsc --noEmit   # Type check
pnpm test          # Vitest
pnpm build         # Vite production build
pnpm start         # Manual smoke test on http://localhost:3000
```

Manually check `/`, `/home`, `/tools/timestamp`, `/tools/json`, and `/tools/password` after tooling or routing changes. If the change affects formatting, format only the changed files:

```bash
npx prettier --write src/components/tools/MyTool.tsx
```

`pnpm run eslint` currently fails because `typescript-eslint` does not support TypeScript 7. Do not treat that failure as a regression introduced by your change (see Section 7).

## 7. Known Issues and Caveats

1. **ESLint is incompatible with TypeScript 7 (important)**
   - `typescript-eslint@8.72.1` supports TypeScript `<6.1.0`, so `pnpm run eslint` fails immediately.
   - Vite, Vitest, and `tsc --noEmit` do work with TypeScript 7.
   - Options: migrate linting to oxlint/Biome, run ESLint with a separate TypeScript 5 installation, or wait for typescript-eslint support.
2. **Single large bundle**
   - The production build emits one ~3.5 MB JS chunk (about 940 KB gzip) and Vite warns about the 500 kB threshold. This is not a build failure. Route-level `lazy()` imports are the natural next optimization.
3. **`react-json-view` is old and needs CJS interop**
   - It declares React 17 peer dependencies while the project uses React 19. The build succeeds, but verify `/tools/json` at runtime when changing JSON tooling. Consider replacing it with a maintained viewer if issues appear.
   - Its UMD bundle assigns `module.exports.default` at runtime, which Vite's dependency optimizer cannot detect, so the default import resolves to `{ default: Component }` in dev. `JsonTools.tsx` unwraps this shape before rendering; keep that normalization when changing the import, and do not "simplify" it back to a bare default import.
4. **`/tools/password` is a standalone route**
   - It bypasses `ToolsLayout`, has no top navigation, and is not in `topItems`. Unifying the experience requires changing both the router structure and the menu.
5. **No fallback route**
   - There is no 404 / `*` route. Visiting `/tools` or an unknown path leaves the content area empty or shows React Router's default error page.
6. **IP lookup depends on an external HTTP API**
   - `IPAddressView.tsx` requests `http://ip-api.com/json/...`. When the site is served over HTTPS on GitHub Pages this is mixed content and may be blocked by the browser; there is no backend proxy.
7. **`src/util` and `src/utils` coexist**
   - Historical legacy; put new logic in `src/utils/`.
8. **`public/playground/firework/` is a standalone static page**
   - It does not participate in React routing or bundling; it is only copied with `public/`. It uses global scripts rather than modules.
9. **Do not restore `public/index.html`**
   - Vite uses the root `index.html` as the entry. A second `index.html` under `public/` would be copied into the build and can overwrite the generated entry.
10. **pnpm store is project-local in this environment**
    - The sandbox cannot write the global pnpm store, so installs use `./.pnpm-store` (gitignored). CI uses its own pnpm store and `--frozen-lockfile`.
11. **Branches and releases**
    - The current working branch may be `test`; CI deploys to `gh-pages` on pushes to both `main` and `test`. Push carefully.
12. **Unused dependency**
    - `react-markdown` is currently not imported anywhere. It can be removed in a cleanup change, but is harmless.
