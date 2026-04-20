<div align="center">

# Cursor Arcade

**Minimalist arcade classics inside your editor.**
Snake. 2048. Blocks. Minesweeper.
Monochrome. Keyboard-first. Zero dependencies. One keystroke away.

<p>
  <a href="https://marketplace.visualstudio.com/items?itemName=flancast90.cursor-arcade-games"><img alt="Visual Studio Marketplace Version" src="https://img.shields.io/visual-studio-marketplace/v/flancast90.cursor-arcade-games?color=000&label=VS%20Code&style=flat-square"></a>
  <a href="https://open-vsx.org/extension/flancast90/cursor-arcade-games"><img alt="Open VSX Version" src="https://img.shields.io/open-vsx/v/flancast90/cursor-arcade-games?color=000&label=Open%20VSX&style=flat-square"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=flancast90.cursor-arcade-games"><img alt="Installs" src="https://img.shields.io/visual-studio-marketplace/i/flancast90.cursor-arcade-games?color=000&label=installs&style=flat-square"></a>
  <a href="./LICENSE"><img alt="MIT License" src="https://img.shields.io/github/license/flancast90/cursor-arcade-games?color=000&style=flat-square"></a>
  <a href="https://github.com/flancast90/cursor-arcade-games/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/flancast90/cursor-arcade-games?color=000&style=flat-square"></a>
</p>

<br />

<img src="media/icon.png" alt="Cursor Arcade" width="120" />

</div>

---

## Why

You spent three hours rebasing. Compile just failed. The linter is screaming. You don't want to alt-tab to a browser and burn the next twenty minutes on r/games — you want three minutes, something your hands already know, and a fresh brain when you come back.

**Cursor Arcade gives you four games at one keystroke**, all rendered in the same restrained black-and-white grammar as the rest of your IDE. No animations that distract. No accounts. No telemetry. No web requests. Close the panel and they disappear — your best scores don't.

## The Games

|   | Game | Why it's here | Controls |
|---|---|---|---|
|   | **Snake** | The reigning champion of "just five more minutes." 5 modes + a worldwide daily challenge. | Arrows / WASD · `Space` pause |
|   | **2048** | The math puzzle that has convinced more people they're bad at addition than any other. 4×4, 5×5, 6×6. | Arrows / WASD |
|   | **Blocks** | Tetrominoes stacking into lines. Hold, ghost-piece, standard scoring. Because of course. | Arrows · `Z`/`X` rotate · `Space` hard-drop · `C` hold |
|   | **Minesweeper** | Pure logic. Occasionally pure guessing. Easy / Medium / Hard. | Click reveal · Right-click / Shift+click flag · Middle-click chord |

Each game tracks a persistent high score. Every game is keyboard-native. Every game fits the same monochrome grid so nothing looks out of place next to your code.

## Install

### From the marketplace

- **VS Code / VSCodium** — [install from the Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=flancast90.cursor-arcade-games) or search *Cursor Arcade* in the Extensions pane.
- **Cursor / other OSS VS Code forks** — [install from Open VSX](https://open-vsx.org/extension/flancast90/cursor-arcade-games) or search *Cursor Arcade* in Cursor's Extensions pane.

### Manual (VSIX)

Download the latest `.vsix` from the [releases page](https://github.com/flancast90/cursor-arcade-games/releases/latest), then:

```
Cmd/Ctrl + Shift + P  →  Extensions: Install from VSIX…
```

## Quick start

Hit `Cmd/Ctrl + Shift + P` and run one of:

| Command | What it does |
|---|---|
| `Arcade: Open Arcade` | Open the menu. |
| `Arcade: Play Snake` | Jump straight into Snake. |
| `Arcade: Play 2048` | Jump straight into 2048. |
| `Arcade: Play Blocks` | Jump straight into Blocks. |
| `Arcade: Play Minesweeper` | Jump straight into Minesweeper. |
| `Arcade: Play Snake — Daily Challenge` | The same seeded board as everyone else today. |
| `Arcade: Reset All High Scores` | Start fresh. |

From the main menu, press `1`–`4` to pick a game. `Esc` always takes you back. `Space` pauses. `R` restarts. That's the whole shape of it.

## Controls

### Snake
| Key | Action |
|---|---|
| `↑ ↓ ← →` or `W A S D` | Turn |
| `Space` or `P` | Pause |
| `R` | Restart |

### 2048
| Key | Action |
|---|---|
| `↑ ↓ ← →` or `W A S D` | Slide |
| `R` | Restart |

### Blocks
| Key | Action |
|---|---|
| `← →` | Move left / right |
| `↓` | Soft drop |
| `↑` or `X` | Rotate clockwise |
| `Z` | Rotate counter-clockwise |
| `Space` | Hard drop |
| `C` or `Shift` | Hold piece |
| `P` | Pause |

### Minesweeper
| Action | Input |
|---|---|
| Reveal cell | Left click |
| Flag cell | Right click, or `Shift`+click |
| Chord (reveal around completed number) | Middle click, or right-click a revealed number |

## Features

- **Four polished games** in one extension — no tab-switching, no context-switching.
- **Monochrome throughout** — designed to live next to your code without yelling.
- **Persistent high scores** per game, per mode, per difficulty.
- **Worldwide daily Snake challenge** — a seeded board that changes every UTC day.
- **Hold + ghost + 7-bag randomizer** in Blocks, because that's the right way to do it.
- **No telemetry. No network. No dependencies.** The whole extension is one TypeScript file and a few hundred lines of vanilla JS in a webview.
- **Dark & light themes** that follow your vibe.
- **`Esc` always goes back**, `Space` always pauses. Muscle memory stays yours.

## Roadmap

Ideas welcome via [issues](https://github.com/flancast90/cursor-arcade-games/issues).

- [ ] Pong / Breakout
- [ ] Wordle-style 5-letter puzzle with local wordlist
- [ ] Solitaire
- [ ] Sokoban with a built-in level editor
- [ ] Per-game leaderboards (opt-in, local file only)
- [ ] Touch input

## Design notes

The entire design language is: **one font family, three greys, no drop shadows, no gradients, no easing that you can visibly see**. Every time you're tempted to add a color, add contrast instead. Every time you're tempted to animate, ask whether it would survive on a Kindle.

The webview is pure HTML/CSS/JS — no React, no bundler, no build step beyond `tsc` for the extension host. This is because every extra dependency is another thing to update, another attack surface, and another reason for the extension to be 20 MB.

## Development

```bash
git clone https://github.com/flancast90/cursor-arcade-games
cd cursor-arcade-games
npm install
npm run compile        # or: npm run watch
```

Open the folder in VS Code / Cursor and press `F5` to launch an Extension Development Host. Then `Cmd/Ctrl+Shift+P → Arcade: Open Arcade`.

### Adding a new game

Every game is a single file in `media/games/` that registers itself:

```js
(function () {
  const R = window.CursorArcade;
  R.games.mygame = {
    create(ctx) {
      return new MyGame(ctx);
    },
  };
  class MyGame {
    constructor({ host, api, meta, options }) { /* ... */ }
    onKey(e)       { /* keyboard input */ }
    destroy()      { /* cleanup */ }

    // Optional:
    togglePause()  {}
    restart()      {}
    buildSettings(container) {}
    onContextMenu(e) {}
  }
})();
```

Then:

1. Add a metadata entry to `GAME_META` in `media/arcade.js`.
2. Add a `<script>` tag for your new file in `media/index.html`.
3. Pass its URI from `src/extension.ts`.
4. Add commands in `package.json` if you want direct launchers.

See `CONTRIBUTING.md` for the full checklist.

## Contributing

Pull requests welcome. Bugs, ideas, and gloriously pedantic UX nitpicks are all equally welcome. See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

If you're shipping a new game, please keep the aesthetic monochrome — we'll merge anything reasonable that stays inside the design constraints.

## License

[MIT](./LICENSE). Do whatever you want. A link back is nice but not required.

## Credits

- **2048** — original concept by [Gabriele Cirulli](https://github.com/gabrielecirulli/2048), MIT-licensed.
- **Snake** — variants inspired by Google's search-engine easter egg and the [slither.io](https://slither.io) lineage.
- **Blocks** — tetromino stacking is the mechanic; this implementation is independent and not affiliated with Tetris Holding.
- **Minesweeper** — Microsoft's 1990 classic; the underlying game is in the public domain.

---

<div align="center">

If Cursor Arcade helped you survive a rebase, <a href="https://github.com/flancast90/cursor-arcade-games">star the repo</a>. Seriously. I notice.

</div>
