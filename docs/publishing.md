# Publishing @nciocpl/react-components

## Prerequisites

- GitHub personal access token (classic) with `write:packages` and `read:packages` scopes
- Token configured in `~/.npmrc`:
  ```
  //npm.pkg.github.com/:_authToken=YOUR_TOKEN
  ```
  Or login interactively:
  ```bash
  npm login --registry=https://npm.pkg.github.com
  ```

## Manual Release Process

### 1. Create a changeset

From the branch with your changes (before or after merging to develop):

```bash
pnpm changeset
```

This will prompt you to:

- Select the package (`@nciocpl/react-components`)
- Choose a bump type (`patch`, `minor`, or `major`)
- Write a summary of the changes

It creates a markdown file in `.changeset/` that should be committed with your PR.

**Bump type guidance:**

- `patch` (0.1.0 -> 0.1.1) -- Bug fixes, documentation updates
- `minor` (0.1.0 -> 0.2.0) -- New components, new features, non-breaking additions
- `major` (0.1.0 -> 1.0.0) -- Breaking API changes, removed components

### 2. Version the package

After merging to develop/main:

```bash
pnpm changeset version
```

This consumes all pending changesets and:

- Bumps `version` in `package.json`
- Updates `CHANGELOG.md`

Commit the result:

```bash
git add .
git commit -m "Version package"
```

### 3. Build the library

```bash
pnpm build
```

Verify the `dist/` directory contains:

- `dist/esm/` -- ES module output
- `dist/cjs/` -- CommonJS output
- `dist/types/` -- TypeScript declarations
- `dist/styles/index.css` -- CSS bundle

### 4. Publish to GitHub Packages

```bash
npm publish
```

This publishes to the GitHub npm registry at `https://npm.pkg.github.com` (configured in `.npmrc`).

### 5. Verify the release

```bash
npm view @nciocpl/react-components --registry=https://npm.pkg.github.com
```

## Consuming the Package

### Configure the registry

In the consuming repo's `.npmrc`:

```
@nciocpl:registry=https://npm.pkg.github.com
```

### Install

```bash
npm install @nciocpl/react-components@<version>
```

Or with pnpm:

```bash
pnpm add @nciocpl/react-components@<version>
```

---

## Automating Releases with GitHub Actions

When ready to automate, create `.github/workflows/release.yml` with the following structure:

### Workflow Overview

The workflow should:

1. Trigger on push to `main` (or `develop`, depending on your branching strategy)
2. Check if there are pending changesets
3. If changesets exist, open a "Version Packages" PR that bumps versions and updates changelogs
4. When that PR is merged, build and publish to GitHub Packages

### Workflow File

```yaml
name: Release

on:
  push:
    branches:
      - main

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}

permissions:
  contents: write
  packages: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@nciocpl'

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Create Release PR or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm run release
          version: pnpm changeset version
          title: 'Version Packages'
          commit: 'Version Packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Required package.json Script

Add a `release` script to `package.json`:

```json
{
	"scripts": {
		"release": "pnpm build && npm publish"
	}
}
```

### How It Works

1. A developer merges a PR that includes a `.changeset/*.md` file
2. The workflow detects pending changesets and opens a "Version Packages" PR
3. That PR contains the version bump in `package.json` and `CHANGELOG.md` updates
4. When the "Version Packages" PR is reviewed and merged, the workflow runs again
5. This time there are no pending changesets, so `changesets/action` runs the `publish` command
6. The package is built and published to GitHub Packages

### Notes

- The `GITHUB_TOKEN` is automatically provided by GitHub Actions and has `write:packages` scope when configured in `permissions`
- No additional secrets are needed for publishing to GitHub Packages within the same organization
- The `changesets/action` handles the logic of deciding whether to open a PR or publish
