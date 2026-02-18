# @nciocpl/react-components

Shared React component library for NCI OCPL applications.

## Overview

This library provides a canonical set of reusable React components used across NCI web applications. Components are organized into two categories:

- **Core Components** -- Framework-agnostic components with self-contained styling (Spinner, ErrorBoundary, Autocomplete, etc.)
- **NCIDS Components** -- Components that integrate with the [NCI Design System](https://designsystem.cancer.gov/) (Button, Accordion, Modal, etc.)

## Installation

```bash
pnpm add @nciocpl/react-components
```

For NCIDS-styled components, also install the NCIDS CSS package:

```bash
pnpm add @nciocpl/ncids-css
```

## Usage

```tsx
// Import all components
import { Spinner, ErrorBoundary } from '@nciocpl/react-components';

// Import only core components (smaller bundle)
import { Spinner } from '@nciocpl/react-components/core';

// Import only NCIDS components
import { Accordion } from '@nciocpl/react-components/ncids';
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

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Storybook dev server on port 6006 |
| `pnpm test` | Run test suite |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm build` | Build the library (ESM + CJS + types) |
| `pnpm lint` | Lint source files |
| `pnpm lint:fix` | Lint and auto-fix source files |
| `pnpm format` | Format source files with Prettier |
| `pnpm format:check` | Check formatting without writing |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm storybook:build` | Build static Storybook site |

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
