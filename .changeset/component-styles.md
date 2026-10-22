---
'@nciocpl/react-components': minor
---

Components now include their own styles automatically. Each component imports a stylesheet with its complete NCIDS styling, compiled from the NCIDS packages it renders and scoped to a `.nci-react-app` wrapper, so it renders fully styled on any page without a style import and without affecting the host page.

- **Wrap your app in `<div className="nci-react-app">`.** Components rendered outside it are unstyled.
- **`@nciocpl/react-components/styles` now contains only page-level base styles** (`uswds-global`) for standalone apps. It no longer includes component styles; apps on cancer.gov pages should not import it.
- The Autocomplete uses the NCIDS `nci-autocomplete` styles instead of hand-written colors, and its input now fills the field at any width.
