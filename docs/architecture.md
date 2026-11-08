# Project Architecture

## Overview

`vyckey.github.io` is a personal website and an online developer toolbox. It is a pure frontend single-page application (SPA) with no backend or database. The home page is a terminal-styled profile; the tools area provides timestamp, timer, text diff, encoder/decoder, encryption, JSON, QR code, IP lookup, Cron, regex, and password tools.

## Technology Stack

- **Framework**: React 19 + TypeScript
- **UI**: Ant Design 6
- **Routing**: React Router 7 (`createBrowserRouter`)
- **Build tool**: Vite 8 with `@vitejs/plugin-react`
- **Testing**: Vitest 5 + jsdom + Testing Library
- **Package manager**: pnpm 11
- **Deployment**: GitHub Pages (GitHub Actions → `gh-pages`), with an alternative Docker + Nginx setup

## Runtime Architecture

```
index.html  (Vite entry, #root, GitHub Pages SPA redirect script)
    │
    ▼
src/index.tsx  ── ReactDOM.createRoot ──▶  src/App.tsx
                                             │ <RouterProvider />
                                             ▼
                                   src/router/Router.tsx
                     ┌───────────────────────┼──────────────────────────┐
                     ▼                       ▼                          ▼
           pages/Homepage.tsx       tools/password               pages/ToolsLayout.tsx
           (/, /home)               PasswordGenerator            (/tools, menu + <Outlet />)
                                                                        │
                                              ┌─────────────────────────┴───────────────────────┐
                                              ▼                                                 ▼
                               /tools/timestamp … /tools/regex                     components/tools/*.tsx
```

The Vite config is in `vite.config.ts`. The dev server runs on port 3000, production output goes to `build/`, and Vitest uses jsdom with `src/setupTests.js`.

## Routes

| Path | Component | Purpose |
| --- | --- | --- |
| `/` | `pages/Homepage.tsx` | Terminal-styled home page |
| `/home` | `pages/Homepage.tsx` | Home page alias |
| `/tools` | `pages/ToolsLayout.tsx` | Tools layout (no index child) |
| `/tools/timestamp` | `components/tools/Timestamp.tsx` | Timestamp/date conversion |
| `/tools/timer` | `components/tools/TimerPanel.tsx` | Countdown and elapsed-time tools |
| `/tools/textdiff` | `components/tools/TextDiffTool.tsx` | Text comparison |
| `/tools/encoder_decoder` | `components/tools/EncoderDecoder.tsx` | Encoding/decoding |
| `/tools/encryption` | `components/tools/Encryption.tsx` | MD5, Base64, RSA |
| `/tools/json` | `components/tools/JsonTools.tsx` | JSON viewer and formatter |
| `/tools/qrcode` | `components/tools/QRCodeGenerator.tsx` | QR code generator |
| `/tools/ipaddress` | `components/tools/IPAddressView.tsx` | IP address lookup |
| `/tools/cron` | `components/tools/CronTool.tsx` | Cron parser and predictor |
| `/tools/regex` | `components/tools/RegexTool.tsx` | Regex tester |
| `/tools/password` | `components/tools/PasswordGenerator.tsx` | Standalone password generator; bypasses `ToolsLayout` |

## Layout and State

`ToolsLayout` renders an antd `Layout` with a horizontal menu and an `<Outlet />`. Menu keys must match the final segment of each route path. All tools manage their own local state with React hooks; there is no global store or server API.

## Shared Modules

- `src/components/CopyButton.tsx` — copy button backed by `src/utils/clipboard.ts`.
- `src/components/CopyableTextArea.tsx` — text area with a copy button.
- `src/util/password.tsx` — password hashing/generation logic.
- `src/utils/clipboard.ts` — Clipboard API with a legacy fallback.
- `src/utils/cronParser.ts` — Cron expression parser and validator.
- `src/utils/cronScheduler.ts` — next-run prediction.
- `src/utils/ip.ts` — IPv4/IPv6 validation.
- `src/utils/passwordStrength.ts` — password strength score.
- `src/utils/regex.ts` — regex matching and highlighting helpers.
- `src/utils/rsa.ts` — PKCS#1 to PKCS#8 private key conversion.

## Styling

Global styles live in `src/index.css` and `src/App.css`; the latter includes the terminal-themed home page. Components mostly use antd primitives and inline `style` props. There is no CSS Modules, Tailwind, or CSS-in-JS setup.

## Build and Deployment

- `pnpm build` runs `vite build` and writes hashed assets to `build/`.
- `pnpm start` / `pnpm dev` starts the Vite dev server on port 3000.
- `.github/workflows/node.js.yml` installs with pnpm and deploys `build/` to the `gh-pages` branch.
- `public/404.html` plus the redirect script in the root `index.html` keep GitHub Pages deep links working.
- The Dockerfile builds with pnpm in a Node 24 stage and serves `build/` with Nginx; `nginx.conf` provides the SPA fallback.

## Testing

- `pnpm test` runs `vitest run`; `pnpm test:watch` starts watch mode.
- `src/setupTests.js` loads jest-dom matchers and provides `ResizeObserver` / `matchMedia` polyfills required by antd in jsdom.
- `src/App.test.tsx` verifies that the home page renders.

## Known Limitations

- ESLint cannot currently run because `typescript-eslint` does not support TypeScript 7.
- The production bundle is a single large chunk; route-level code splitting is a future improvement.
- `/tools/password` is intentionally outside `ToolsLayout`.
- There is no `/tools` index route or catch-all 404 route.
- The IP tool calls `http://ip-api.com`, which is mixed content on the HTTPS GitHub Pages site.
