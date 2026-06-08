---
'@nciocpl/react-components': minor
---

Add `Autocomplete` (NCIDS combobox) component and fix its packaging.

- **Search-box features:** new `minChars` / `minCharsMessage` props (shows a "enter N or more characters" hint below the threshold), an `onSubmit` callback plus a built-in search button (Enter submits when no option is highlighted; a highlighted option is selected first), `highlightMatch` to bold the matched substring in each option, and a `searchButtonLabel` for localization.
- **Styling now ships:** the component previously relied on a CSS-module (`Autocomplete.module.scss`) that the rollup pipeline silently dropped — class names resolved to `undefined` and no CSS was emitted to the bundled stylesheet. Styles are now plain `nci-autocomplete*` classes shipped via `@nciocpl/react-components/styles`.
