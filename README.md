# @nciocpl/react-components

Shared React component library for NCI OCPL applications.

## Documentation

Browse the component library and interactive examples at the [Storybook documentation site](https://nciocpl.github.io/react-app-shared/).

Every pull request also gets its own Storybook preview at `https://nciocpl.github.io/react-app-shared/pr-preview/pr-<number>/`; a link is posted on the PR once it deploys. Previews are removed when the PR is closed, or after 14 days without an update.

## Overview

This library provides a canonical set of reusable React components used across NCI web applications. Components are organized into two categories:

- **Core Components** -- Framework-agnostic components with self-contained styling (Spinner, ErrorBoundary, Autocomplete, etc.)
- **NCIDS Components** -- Components that integrate with the [NCI Design System](https://designsystem.cancer.gov/) (Button, Accordion, Modal, etc.)

## Requirements

- React `>=17.0.0` and React DOM `>=17.0.0` (the build uses the modern `react/jsx-runtime` transform).
- `@nciocpl/ncids-css` `>=3.0.0` is required to use any NCIDS component (Pager, Collection, etc.). It is declared as an optional peer so apps that only use core components are not forced to install it.

## Installation

```bash
pnpm add @nciocpl/react-components @nciocpl/ncids-css
```

## Setup

### Wrap your app in `.nci-react-app`

Every component ships its own styles and loads them automatically when you use it; there is no stylesheet to import. Those styles are scoped to a `.nci-react-app` wrapper, so wrap your app's top-level component in it (render it inside your app's root element, never on the host page):

```tsx
export const App = () => <div className="nci-react-app">{/* your app */}</div>;
```

Components rendered outside the wrapper are unstyled.

Your bundler must handle `.css` imported from `node_modules` (Vite and Create React App do by default).

### Styling rules

Library CSS only ever affects the library's own markup, and can be inherited from and overridden by the host page and your app:

1. **Namespaced under `.nci-react-app`.** NCIDS package styles are scoped with zero-specificity `:where(.nci-react-app)`; the few structural rules a component adds on top of NCIDS use `.nci-react-app` so they win over a host page's unscoped NCIDS rules regardless of load order.
2. **Prefixed class selectors only** (`.nci-autocomplete__*`, `.usa-*`). No bare element selectors and nothing global (`html`, `body`, `*`).
3. **Complete NCIDS styling from NCIDS sources.** Each component's stylesheet is compiled from the NCIDS packages it renders (`sass:meta` `load-css` inside the scope), so components look right on any page and match the host's NCIDS exactly. Images are inlined, so nothing needs to be served.
4. **Low specificity.** Override any rule from your app without `!important`.
5. **Nothing page-level.** No `html`/`body`/reset rules and no `@font-face` in component styles. NCIDS uses Open Sans; load it on the page (cancer.gov already does) or components fall back to the system sans-serif.

`src/styles/component-styles.test.ts` enforces these rules for every component stylesheet.

### Optional: page-level base styles

Standalone apps not embedded in an NCIDS page can also import the USWDS/NCIDS page-level base styles (typography and body defaults). Apps on cancer.gov pages should not; the host page provides them.

```ts
import '@nciocpl/react-components/styles';
```

### Pager icons

`Pager` references the USWDS icon sprite at `/img/sprite.svg`. Serve `node_modules/@nciocpl/ncids-css/uswds-img` at `/img`:

- **Vite:** set `publicDir` to that directory, or copy it to `public/img`.
- **Webpack / Create React App:** copy it into `public/img` (e.g. via `copy-webpack-plugin` or a postinstall script).

## Usage

```tsx
// Import from the package root
import { Pager, Collection, CollectionItem } from '@nciocpl/react-components';

// Or scope imports to a category
import { Pager } from '@nciocpl/react-components/ncids';
```

## Development

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Getting Started

```bash
# Install dependencies
pnpm install

# Start Storybook for development
pnpm dev

# Run tests
pnpm test

# Build the library
pnpm build

# Type checking
pnpm typecheck
```

### Scripts

| Command                | Description                             |
| ---------------------- | --------------------------------------- |
| `pnpm dev`             | Start Storybook dev server on port 6006 |
| `pnpm test`            | Run test suite                          |
| `pnpm test:watch`      | Run tests in watch mode                 |
| `pnpm test:coverage`   | Run tests with coverage report          |
| `pnpm build`           | Build the library (ESM + CJS + types)   |
| `pnpm lint`            | Lint source files                       |
| `pnpm lint:fix`        | Lint and auto-fix source files          |
| `pnpm format`          | Format source files with Prettier       |
| `pnpm format:check`    | Check formatting without writing        |
| `pnpm typecheck`       | Run TypeScript type checking            |
| `pnpm storybook:build` | Build static Storybook site             |

## Testing

Tests use [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [vitest-axe](https://github.com/chaance/vitest-axe) for accessibility testing.

```bash
# Run all tests
pnpm test

# Run tests in watch mode (re-runs on file changes)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

Test files should be colocated with the source they test using the `*.test.ts` or `*.test.tsx` naming convention:

```
src/
├── components/
│   └── core/
│       └── Spinner/
│           ├── Spinner.tsx
│           └── Spinner.test.tsx
```

Coverage thresholds are set to 80% for branches, functions, lines, and statements. The coverage report is generated using the v8 provider.

## Project Structure

```
src/
├── components/
│   ├── core/           # Framework-agnostic components
│   └── ncids/          # NCIDS design system components
├── hooks/              # Shared React hooks
├── utils/              # Utility functions
└── types/              # Shared TypeScript types
```

## Contributing

See [docs/contributing.md](docs/contributing.md) for guidelines.

## License

Apache-2.0 -- see [LICENSE](LICENSE) for details.
