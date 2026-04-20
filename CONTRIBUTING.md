# Contributing

Thanks for looking at the code. Keep it tight.

## Development loop

```bash
npm install
npm run watch
```

- Webview changes (anything in `media/`) require only closing and reopening
  the Snake tab.
- Extension-process changes (`src/extension.ts`) require
  **Developer: Reload Window** after `npm run compile`.

## Conventions

- **Monochrome, no exceptions.** Every color except `--fg` / `--bg` / `--grid`
  (and the muted greys derived from them) should have a very specific reason
  to exist. Particles use `--fg`. Status elements use greys.
- **No new dependencies** without a strong reason. The whole game runs on a
  single `<canvas>` with no frameworks.
- **Inputs must feel immediate.** Anything that adds input latency is
  a regression — we already have a 2-deep direction queue; don't replace it
  with a 1-deep one.
- **Determinism for the daily challenge.** Anything that spawns (walls,
  portals, apples) must go through `game.rng` so the same seed reproduces the
  same layout.

## Submitting changes

1. Open an issue first for anything non-trivial.
2. Keep PRs focused — one feature or fix per PR.
3. Update `CHANGELOG.md` under `[Unreleased]`.
4. Tests aren't wired up yet; manual test steps in the PR body are fine.

## Release process (maintainer)

```bash
# bump version
npm version patch            # or minor / major
git push --follow-tags

# publish happens automatically via GitHub Actions on the tag,
# or manually:
npm run publish:vsce
npm run publish:ovsx
```
