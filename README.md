# @nciocpl/react-components

Shared React component library for NCI OCPL applications.

## Documentation

Browse the component library and interactive examples at the [Storybook documentation site](https://nciocpl.github.io/react-app-shared/).

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

NCIDS components rely on USWDS CSS classes. The library ships a pre-bundled stylesheet that compiles the relevant NCIDS/USWDS modules. Import it once at your app entry:

```ts
// e.g. src/main.tsx
import '@nciocpl/react-components/styles';
```

The bundled CSS resolves USWDS sprite/font URLs against `/img`. Configure your app to serve `node_modules/@nciocpl/ncids-css/uswds-img` at that path.

**Vite (vite.config.ts):**

```ts
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
	publicDir: path.resolve(
		__dirname,
		'node_modules/@nciocpl/ncids-css/uswds-img'
	),
	// ...or copy the directory to your existing public/ as `public/img`
});
```

**Webpack / Create React App:** copy `node_modules/@nciocpl/ncids-css/uswds-img` into your `public/img` folder (e.g. via `copy-webpack-plugin` or a postinstall script).

If your app already compiles NCIDS SCSS for non-React UI, skip the bundled stylesheet — the components render with whatever NCIDS rules you have loaded.

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
