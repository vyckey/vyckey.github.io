# Project Architecture

## Overview

This is a React-based developer tools web application built with TypeScript. The application provides various utility tools including timestamp conversion, timers, text comparison, JSON formatting, encoding/decoding, encryption, QR code generation, and IP address lookup.

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Routing**: React Router v6
- **UI Components**: Ant Design (antd)
- **Build Tool**: Create React App
- **Deployment**: GitHub Pages

## Project Structure

```
.
├── public/                 # Static assets
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   │   └── tools/          # Individual tool components
│   ├── pages/              # Page-level components
│   ├── router/             # Routing configuration
│   └── App.tsx             # Main application component
├── docs/                   # Documentation
└── package.json            # Project dependencies and scripts
```

## Key Components

### 1. Routing (src/router/Router.tsx)

The application uses React Router v6 for client-side routing. The main routes include:

- `/` and `/home` - Homepage
- `/tools/*` - Tools layout with nested routes for individual tools:
  - `/tools/timestamp` - Timestamp converter
  - `/tools/timer` - Timer utility
  - `/tools/textdiff` - Text comparison tool
  - `/tools/json` - JSON formatting tool
  - `/tools/encoder_decoder` - Encoding/decoding utilities
  - `/tools/encryption` - Encryption/decryption utilities
  - `/tools/qrcode` - QR code generator
  - `/tools/ipaddress` - IP address lookup
  - `/tools/cron` - Cron expression parser and scheduler

### 2. Tools Layout (src/pages/ToolsLayout.tsx)

The ToolsLayout component serves as the main layout for all tool pages with:

- A horizontal navigation menu with tab items for each tool
- Dynamic tab selection based on the current URL path
- Content area that renders the active tool component via `<Outlet />`

Key features:
- Uses `useLocation` hook to track URL changes
- Implements `useState` and `useEffect` to dynamically update the selected tab
- Automatically activates the corresponding tab based on the URL path

### 3. Individual Tool Components

Each tool is implemented as a standalone component in the `src/components/tools/` directory:

- **TimestampPanel** - Time conversion utilities
- **TimerPanel** - Countdown and stopwatch functionality
- **TextDiffTool** - Text comparison with visual highlighting
- **JsonTools** - JSON formatting and validation
- **EncoderDecoderTabs** - Multiple encoding/decoding formats
- **EncryptionTabs** - Various encryption/decryption algorithms
- **QRCodeGenerator** - QR code generation from text input
- **IPAddressView** - IP address information lookup
- **CronTool** - Cron expression parsing and schedule prediction

## Data Flow

1. User navigates to a URL (e.g., `/tools/json`)
2. React Router matches the route and renders the `ToolsLayout` component
3. `ToolsLayout` determines the active tab based on the URL path
4. The corresponding tool component is rendered in the content area via `<Outlet />`
5. User interacts with the tool, which manages its own state and UI

## GitHub Pages Deployment

The application is configured for deployment to GitHub Pages with special handling in `public/index.html` to support client-side routing:

- Includes a script to handle redirects for single-page applications
- Uses the `spa-github-pages` approach to ensure proper routing

## State Management

- Each tool component manages its own local state using React hooks
- The ToolsLayout component manages the active tab state
- No external state management library is used (e.g., Redux, Zustand)

## Styling

- Primarily uses Ant Design components for UI
- Custom CSS is minimal and located in `src/App.css`
- Responsive design through Ant Design's built-in responsive features

## Build Process

- Uses Create React App's default build process
- Optimizes assets for production deployment
- Outputs to the `build/` directory