# Theming

## Component Categories

### Core Components

Core components use CSS Modules with SCSS. Their styles are self-contained and do not depend on any external design system. You can customize them by:

- Passing `className` props to override or extend styles
- Using CSS custom properties where supported

### NCIDS Components

NCIDS components rely on `@nciocpl/ncids-css` for styling. To use them:

1. Install `@nciocpl/ncids-css` as a dependency
2. Include the NCIDS CSS in your application's stylesheet
3. Components will automatically pick up the NCIDS design tokens

## CSS Custom Properties

Where applicable, components expose CSS custom properties for theming. Refer to individual component documentation in Storybook for available properties.
