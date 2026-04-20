# Contributing

Thanks for looking at the code. Keep it tight.

## Development loop

```bash
npm install
npm run watch
```

- Webview changes (anything in `media/`) take effect after closing and re-opening the arcade panel — no rebuild needed.
- Extension-process changes (`src/extension.ts`) require **Developer: Reload Window** after `npm run compile`.

Open the project folder in VS Code or Cursor, press `F5` to launch an Extension Development Host, then run `Arcade: Open Arcade`.

## Conventions

- **Monochrome, no exceptions.** Every color except `--fg` / `--bg` / the `--line*` and `--fg-*` greys derived from them should have a very specific reason to exist. If you're thinking "but it would look nicer with a pop of color" — the answer is contrast, not color.
- **No drop shadows, no gradients.** The entire visual language is flat fills and 1-pixel borders.
- **No new runtime dependencies.** The entire webview is vanilla HTML/CSS/JS. The only build step is `tsc` for the extension host.
- **Inputs must feel immediate.** Anything that adds input latency is a regression. Snake uses a 2-deep direction queue; don't replace it with a 1-deep one. 2048 processes a move fully before accepting the next. Blocks has no input lag between keydown and piece movement.
- **Determinism for daily / seeded modes.** Anything that spawns randomly in a seeded mode must go through the game's RNG so the same seed reproduces the same layout.

## Adding a new game

Every game is a single file under `media/games/` that registers itself on the global `CursorArcade.games` registry. Minimal skeleton:

```js
(function () {
  const R = window.CursorArcade;
  R.games.mygame = {
    create(ctx) {
      return new MyGame(ctx);
    },
  };
  class MyGame {
    constructor({ host, api, meta, options }) {
      this.api = api;
      // create your DOM / canvas and attach to `host`
      api.setTopbarControls({ pause: true, restart: true });
      api.setStats({ score: 0 });
    }
    onKey(e)      { /* keyboard input */ }
    destroy()     { /* cleanup timers, listeners, DOM */ }

    // Optional:
    togglePause() {}
    restart()     {}
    buildSettings(container) { /* append field elements */ }
    onContextMenu(e) {}
    onStorage(s)  {}
  }
})();
```

### Wiring checklist

1. Add game metadata to `GAME_META` and `GAME_ORDER` in `media/arcade.js`.
2. Add a glyph case in `glyphFor()` in `media/arcade.js`.
3. Add a `<script>` tag for your new file in `media/index.html`.
4. Pass its URI from `src/extension.ts` (both the webview URI and the template replace).
5. Add a direct-launch command in `package.json` if desired, plus a matching handler in `extension.ts`.
6. Use `api.submitScore(key, score)` to persist high scores. Namespace the key (e.g. `mygame:easy`).
7. Update the `README.md` Games table and the `CHANGELOG.md`.

## Submitting changes

1. Open an issue first for anything non-trivial.
2. Keep PRs focused — one feature or fix per PR.
3. Update `CHANGELOG.md` under a new `[Unreleased]` heading if you're adding or changing behavior.
4. Tests aren't wired up yet; a short manual test plan in the PR body is fine.

## Release process (maintainer)

Every push to `main` auto-bumps the patch version, publishes to the VS Code Marketplace and Open VSX, and cuts a GitHub release with the VSIX attached. No manual tagging required.

For a manual publish:

```bash
npm run package              # build a local VSIX
npm run publish:vsce         # requires VSCE_PAT env var
npm run publish:ovsx         # requires OVSX_PAT env var
```
