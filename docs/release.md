# Release Process

How to release a new version of `@nciocpl/react-components` to GitHub Packages.

Releases are automated by [Changesets](https://github.com/changesets/changesets)
and `.github/workflows/release.yml`. Nobody runs `npm publish` by hand; for the
underlying commands and registry setup, see [publishing.md](publishing.md).

## Branches

- `develop` — integration branch. Every feature/fix PR targets `develop`.
- `main` — release branch. Only release PRs and the Changesets
  "version packages" PR are merged into `main`.

The repository only allows **rebase merges**, so `main` gets rewritten copies of
the commits from `develop`. That is why step 5 (syncing `develop`) is required.

## 1. Merge feature work into `develop`

Every PR that changes the published package includes a changeset:

```bash
pnpm changeset
```

Pick the bump type (`patch` for fixes, `minor` for new components or props,
`major` for breaking changes) and commit the generated `.changeset/*.md` file
with the PR.

Commit messages are checked by commitlint. Each commit needs:

```
(#123) Imperative summary of the change

- Bullet points describing what changed

Closes #123
```

Use `Touches #123` instead of `Closes` when the ticket stays open.

## 2. Open the release PR (`develop` → `main`)

1. Make sure `develop` is in sync with `main` (see step 5). `main..develop`
   should list only the commits you intend to release:

   ```bash
   git fetch origin
   git log --oneline origin/main..origin/develop
   ```

2. Open a PR from `develop` into `main`, titled for the release, e.g.
   `Release 0.4.0`. In the description, list the changeset files included
   (`ls .changeset`) and what each adds.
3. Wait for CI to pass, get a review, and **rebase-merge** it.

## 3. Merge the "version packages" PR

The push to `main` runs the Release workflow. Because there are unconsumed
changesets, it opens (or updates) a PR titled **`chore: version packages`**
from `changeset-release/main`. That PR:

- bumps `version` in `package.json`
- adds the release notes to `CHANGELOG.md`
- deletes the consumed `.changeset/*.md` files

Review the version number and the `CHANGELOG.md` diff, then merge it.

## 4. Confirm the publish

Merging the version PR runs the Release workflow again. With no changesets left,
it runs `pnpm changeset publish`, which publishes to GitHub Packages and pushes a
`@nciocpl/react-components@x.y.z` tag.

Check the workflow run in the **Actions** tab, then confirm:

```bash
npm view @nciocpl/react-components version --registry=https://npm.pkg.github.com
```

## 5. Sync `develop` with `main` (do not skip)

After publishing, `main` has the version commit and rewritten copies of the
released commits, and `develop` does not. Bring `develop` up to date:

```bash
git fetch origin
git checkout develop
git reset --hard origin/develop
git rebase origin/main
```

`git rebase` drops the commits `main` already has and keeps any newer work on
`develop` on top. Check the result before pushing:

```bash
git log --oneline origin/main..develop   # only unreleased work, or nothing
grep '"version"' package.json            # matches the version just released
ls .changeset                            # only unreleased changesets
```

Then push and tell the team, since this rewrites `develop`:

```bash
git push --force-with-lease origin develop
```

Anyone with a local `develop` should run
`git fetch origin && git reset --hard origin/develop` (or rebase their feature
branches onto the new `develop`).

### Why this matters

If `develop` is not synced, the next release re-adds changesets that were
already consumed (duplicating entries in `CHANGELOG.md`), `package.json` on
`develop` shows an old version, and the release PR can conflict when GitHub
rebases it onto `main`. If that has happened, the fix is this same step 5:
rebase `develop` onto `origin/main`, verify, and force-push with lease.

## Checklist

- [ ] Every PR in the release has a changeset (where it changes the package)
- [ ] `develop` is in sync with `main` before the release PR
- [ ] Release PR `develop` → `main` reviewed and rebase-merged
- [ ] `chore: version packages` PR reviewed (version + CHANGELOG) and merged
- [ ] Release workflow succeeded; new version visible in GitHub Packages
- [ ] `develop` synced with `main` and force-pushed; team notified
- [ ] Consuming apps updated to the new version
