# Contributing

## Development Setup

1. Clone the repository
2. Run `pnpm install`
3. Run `pnpm run dev` to start Storybook

## Adding a New Component

1. Create a directory under `src/components/core/` or `src/components/ncids/`
2. Include the following files:
   - `ComponentName.tsx` -- Component implementation
   - `ComponentName.test.tsx` -- Tests using Testing Library
   - `ComponentName.stories.tsx` -- Storybook stories
   - `index.ts` -- Barrel export
   - `ComponentName.module.scss` -- Styles (core components only)
3. Export the component from the category's `index.ts`
4. Export the component from `src/index.ts`

## Code Standards

- All components must be functional components using hooks
- TypeScript strict mode is enforced
- All components must include accessibility testing (jest-axe)
- All components must have Storybook stories
- Test coverage must meet the 80% threshold

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the code standards above
3. Ensure all checks pass: `pnpm test`, `pnpm run lint`, `pnpm run typecheck`
4. Submit a PR using the pull request template
5. Request review from code owners
