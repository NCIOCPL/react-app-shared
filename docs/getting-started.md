# Getting Started

## Installation

```bash
npm install @nciocpl/react-components
```

For components that use NCIDS styling:

```bash
npm install @nciocpl/ncids-css
```

## Basic Usage

```tsx
import { Spinner } from '@nciocpl/react-components/core';

function App() {
  return <Spinner />;
}
```

## Import Strategies

The library supports three import paths to help with tree-shaking:

| Path | Contents |
|------|----------|
| `@nciocpl/react-components` | All components, hooks, and utilities |
| `@nciocpl/react-components/core` | Only core components (no NCIDS dependency) |
| `@nciocpl/react-components/ncids` | Only NCIDS-styled components |
