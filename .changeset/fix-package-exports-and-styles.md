---
'@nciocpl/react-components': minor
---

Fix package distribution issues surfaced during downstream integration:

- **Subpath exports** (`@nciocpl/react-components/core`, `@nciocpl/react-components/ncids`): rollup now uses multi-entry input so the documented subpath bundles (and matching type declarations) are actually emitted.
- **Bundled stylesheet** (`@nciocpl/react-components/styles`): the export now resolves to a real compiled CSS file (USWDS global, `usa-pagination`, `usa-icon`, `usa-collection`). Consumers that don't already compile NCIDS SCSS can `import '@nciocpl/react-components/styles'` and serve `node_modules/@nciocpl/ncids-css/uswds-img` at `/img`. README updated with Vite/Webpack recipes.
- **React peer dependency** raised to `>=17.0.0`. The build emits `react/jsx-runtime` imports (modern JSX transform), which only exist on React ≥ 16.14 — and React 16 has been EOL since 2024. Setting the floor at 17 prevents cryptic `Can't resolve 'react/jsx-runtime'` errors on outdated React installations.
- **`@nciocpl/ncids-css` peer dependency** is now declared (`>=3.0.0`, optional) so the existing `peerDependenciesMeta.optional` entry has effect.
