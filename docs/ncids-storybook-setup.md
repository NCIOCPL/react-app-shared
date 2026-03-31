# NCIDS CSS Storybook Setup

This project uses `@nciocpl/ncids-css` for USWDS/NCIDS styling in Storybook. The package provides Sass source files that must be compiled with specific load paths.

## Required Dependencies

```bash
pnpm add -D @nciocpl/ncids-css @storybook/test@~8.4.0
```

## Configuration

### `.storybook/main.ts`

Three additions are needed:

1. **`staticDirs`** — Serves USWDS image assets (SVG sprite for icons) at `/img`
2. **`viteFinal`** — Configures Sass with:
   - `api: 'modern-compiler'` — Required for Vite to honor `loadPaths` (the legacy Sass API ignores them)
   - `loadPaths` — Points to `@nciocpl/ncids-css/packages` and `@nciocpl/ncids-css/uswds-packages`

```typescript
import path from 'path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	// ...existing config
	staticDirs: [
		{
			from: '../node_modules/@nciocpl/ncids-css/uswds-img',
			to: '/img',
		},
	],
	viteFinal: async (config) => {
		config.css = {
			...config.css,
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler',
					loadPaths: [
						path.resolve(
							__dirname,
							'../node_modules/@nciocpl/ncids-css/packages'
						),
						path.resolve(
							__dirname,
							'../node_modules/@nciocpl/ncids-css/uswds-packages'
						),
					],
				},
			},
		};
		return config;
	},
};
```

### `.storybook/preview.scss`

Configure `uswds-core` with theme settings, then forward the USWDS components you need:

```scss
@use 'uswds-core' with (
	$theme-image-path: '@nciocpl/ncids-css/uswds-img',
	$theme-show-notifications: false,
	$theme-show-compile-warnings: false
);

@forward 'uswds-global';
@forward 'usa-pagination';
@forward 'usa-icon';
@forward 'usa-collection';
```

**When adding new components**, add their corresponding `@forward` line here (e.g., `@forward 'usa-accordion';`).

### `.storybook/preview.ts`

Import the SCSS file:

```typescript
import './preview.scss';
```

## Troubleshooting

- **"Can't find stylesheet to import"** — Missing `api: 'modern-compiler'` in the Vite scss config. Without it, `loadPaths` are silently ignored.
- **"Failed to fetch dynamically imported module"** — Try a hard refresh (Cmd+Shift+R) or clear cache with `rm -rf node_modules/.vite`.
- **"Failed to load static files, no such directory"** — Use a relative path in `staticDirs` (e.g., `'../node_modules/...'`), not `path.resolve(__dirname, ...)`. Storybook resolves `staticDirs` relative to the `.storybook` directory automatically, and absolute paths can break with pnpm's store layout.
- **Missing `@storybook/test`** — Install it: `pnpm add -D @storybook/test@~8.4.0`. Match the version to your other `@storybook/*` packages.

## Reference

This follows the same pattern used in other NCI React apps (e.g., `clinical-trials-listing-app`), adapted from Webpack `includePaths` to Vite `loadPaths`.
