# Changelog

## 0.5.0

### Minor Changes

- [#90](https://github.com/NCIOCPL/react-app-shared/pull/90) [`fef9a97`](https://github.com/NCIOCPL/react-app-shared/commit/fef9a97952febbaf5f23f3733c50dec96f5a32b4) Thanks [@adriancofie](https://github.com/adriancofie)! - Components now include their own styles automatically. Each component imports a stylesheet with its complete NCIDS styling, compiled from the NCIDS packages it renders and scoped to a `.nci-react-app` wrapper, so it renders fully styled on any page without a style import and without affecting the host page.

  - **Wrap your app in `<div className="nci-react-app">`.** Components rendered outside it are unstyled.
  - **`@nciocpl/react-components/styles` now contains only page-level base styles** (`uswds-global`) for standalone apps. It no longer includes component styles; apps on cancer.gov pages should not import it.
  - The Autocomplete uses the NCIDS `nci-autocomplete` styles instead of hand-written colors, and its input now fills the field at any width.

## 0.4.0

### Minor Changes

- [#84](https://github.com/NCIOCPL/react-app-shared/pull/84) [`fa13673`](https://github.com/NCIOCPL/react-app-shared/commit/fa13673427b3b3fb1217db5156e9e5f82e4f8142) Thanks [@adriancofie](https://github.com/adriancofie)! - Add a `type` prop to `Autocomplete` (`'text'` | `'search'`, default `'text'`). With `type="search"` the input renders as a native search input and the component's clear (×) button is omitted, so the browser's own clear button is used — matching the NCIDS header search box.

- [#84](https://github.com/NCIOCPL/react-app-shared/pull/84) [`94dbd53`](https://github.com/NCIOCPL/react-app-shared/commit/94dbd53adb4d31a7b6e5d257107c07a746102cbd) Thanks [@adriancofie](https://github.com/adriancofie)! - Add `Radio` and `RadioGroup` (NCIDS Radio Buttons) components. `Radio` wraps a native radio `<input>` with USWDS `usa-radio` styling and supports an optional description and tile variant. `RadioGroup` renders an accessible `fieldset`/`legend` wrapper, manages selection state for its child radios (controlled or uncontrolled), and supports hint text, required, disabled, tile, and error states.

## 0.3.0

### Minor Changes

- [#75](https://github.com/NCIOCPL/react-app-shared/pull/75) [`99b6960`](https://github.com/NCIOCPL/react-app-shared/commit/99b6960322429cf30c18b911bb2ad9b01f23ede3) Thanks [@adriancofie](https://github.com/adriancofie)! - Add `Autocomplete` (NCIDS combobox) component and fix its packaging.

  - **Search-box features:** new `minChars` / `minCharsMessage` props (shows a "enter N or more characters" hint below the threshold), an `onSubmit` callback plus a built-in search button (Enter submits when no option is highlighted; a highlighted option is selected first), `highlightMatch` to bold the matched substring in each option, and a `searchButtonLabel` for localization.
  - **Styling now ships:** the component previously relied on a CSS-module (`Autocomplete.module.scss`) that the rollup pipeline silently dropped — class names resolved to `undefined` and no CSS was emitted to the bundled stylesheet. Styles are now plain `nci-autocomplete*` classes shipped via `@nciocpl/react-components/styles`.

- [#75](https://github.com/NCIOCPL/react-app-shared/pull/75) [`d00f0dd`](https://github.com/NCIOCPL/react-app-shared/commit/d00f0dd423a3702f68b83e1efc3db71cf03bf6a9) Thanks [@adriancofie](https://github.com/adriancofie)! - Add `TextInput` (NCIDS Text Input) component. Wraps a native `<input>` with USWDS `usa-input` styling and supports text, email, password, tel, url, number, and search input types. Forwards standard input props for use as a controlled or uncontrolled input.

## 0.2.0

### Minor Changes

- [#70](https://github.com/NCIOCPL/react-app-shared/pull/70) [`9c1438f`](https://github.com/NCIOCPL/react-app-shared/commit/9c1438fc9a277d503be2df16504a4e6363626f01) Thanks [@adriancofie](https://github.com/adriancofie)! - Add `Dropdown` (NCIDS Select) component. Wraps a native `<select>` with USWDS styling and forwards standard form props for use as a controlled or uncontrolled input.

- [#70](https://github.com/NCIOCPL/react-app-shared/pull/70) [`6ce5456`](https://github.com/NCIOCPL/react-app-shared/commit/6ce5456e642e2b6b50792f9e3d91d781947841ce) Thanks [@adriancofie](https://github.com/adriancofie)! - Fix package distribution issues surfaced during downstream integration:

  - **Subpath exports** (`@nciocpl/react-components/core`, `@nciocpl/react-components/ncids`): rollup now uses multi-entry input so the documented subpath bundles (and matching type declarations) are actually emitted.
  - **Bundled stylesheet** (`@nciocpl/react-components/styles`): the export now resolves to a real compiled CSS file (USWDS global, `usa-pagination`, `usa-icon`, `usa-collection`). Consumers that don't already compile NCIDS SCSS can `import '@nciocpl/react-components/styles'` and serve `node_modules/@nciocpl/ncids-css/uswds-img` at `/img`. README updated with Vite/Webpack recipes.
  - **React peer dependency** raised to `>=17.0.0`. The build emits `react/jsx-runtime` imports (modern JSX transform), which only exist on React ≥ 16.14 — and React 16 has been EOL since 2024. Setting the floor at 17 prevents cryptic `Can't resolve 'react/jsx-runtime'` errors on outdated React installations.
  - **`@nciocpl/ncids-css` peer dependency** is now declared (`>=3.0.0`, optional) so the existing `peerDependenciesMeta.optional` entry has effect.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.1.0

### Added

- Initial release of @nciocpl/react-components shared component library
- Initial repository setup with folder structure and configuration
- Initial TypeScript, Rollup, Jest, ESLint, Prettier, and Storybook configuration
- Project documentation (README, LICENSE, CONTRIBUTING)
