---
'@nciocpl/react-components': patch
---

The Autocomplete search button is now `type="submit"`, so a form wrapping the Autocomplete has a submit button (fixes the pa11y / WCAG H32 failure). Clicking it still runs the search once through `onSubmit` without natively submitting the surrounding form.
