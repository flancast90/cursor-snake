<div align="center">

# Cursor Arcade

**Minimalist arcade classics inside your editor.**
Snake. 2048. Blocks. Minesweeper. Pong. Tic-Tac-Toe. Head Soccer. Capitalist.
Monochrome. Keyboard-first. Zero dependencies. One keystroke away.

<p>
  <a href="https://marketplace.visualstudio.com/items?itemName=flancast90.cursor-snake"><img alt="Visual Studio Marketplace Version" src="https://img.shields.io/visual-studio-marketplace/v/flancast90.cursor-snake?color=000&label=VS%20Code&style=flat-square"></a>
  <a href="https://open-vsx.org/extension/flancast90/cursor-snake"><img alt="Open VSX Version" src="https://img.shields.io/open-vsx/v/flancast90/cursor-snake?color=000&label=Open%20VSX&style=flat-square"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=flancast90.cursor-snake"><img alt="Installs" src="https://img.shields.io/visual-studio-marketplace/i/flancast90.cursor-snake?color=000&label=installs&style=flat-square"></a>
  <a href="./LICENSE"><img alt="MIT License" src="https://img.shields.io/github/license/flancast90/cursor-arcade-games?color=000&style=flat-square"></a>
  <a href="https://github.com/flancast90/cursor-arcade-games/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/flancast90/cursor-arcade-games?color=000&style=flat-square"></a>
</p>

<br />

<img src="media/icon.png" alt="Cursor Arcade" width="120" />

</div>

---

## Why

You spent three hours rebasing. Compile just failed. The linter is screaming. You don't want to alt-tab to a browser and burn the next twenty minutes on r/games — you want three minutes, something your hands already know, and a fresh brain when you come back.

**Cursor Arcade gives you eight games at one keystroke**, all rendered in the same restrained black-and-white grammar as the rest of your IDE. No animations that distract. No accounts. No telemetry. No web requests. Close the panel and they disappear — your best scores don't.

## The Games

|   | Game | Why it's here | Controls |
|---|---|---|---|
|   | **Snake** | The reigning champion of "just five more minutes." 5 modes + a worldwide daily challenge. | Arrows / WASD · `Space` pause |
|   | **2048** | The math puzzle that has convinced more people they're bad at addition than any other. 4×4, 5×5, 6×6. | Arrows / WASD |
|   | **Blocks** | Tetrominoes stacking into lines. Hold, ghost-piece, standard scoring. Because of course. | Arrows · `Z`/`X` rotate · `Space` hard-drop · `C` hold |
|   | **Minesweeper** | Pure logic. Occasionally pure guessing. Easy / Medium / Hard. | Click reveal · Right-click / Shift+click flag · Middle-click chord |
|   | **Pong** | 1972's original. 1P vs CPU with four difficulty tiers, or hotseat 2P. First to 5/7/11/21. | `W`/`S` or `↑`/`↓` move paddle · `Space` pause · `R` restart |
|   | **Tic-Tac-Toe** | 3×3, 1P vs CPU (Easy / Normal / unbeatable Hard via minimax) or hotseat 2P. | Click cell, or numpad `1-9`, or arrows + `Enter` · `R` reset |
|   | **Head Soccer** | 1P vs CPU or hotseat 2P. Big heads, small ball, absurd physics. Power-ups for fire, ice, giant, and multiball. | P1: `A`/`D` move · `W` jump · `S` kick · `Q` power · P2: `←`/`→` move · `↑` jump · `↓` kick · `/` power |
|   | **Capitalist** | Idle tycoon inspired by AdVenture Capitalist. Ten businesses per planet across Earth, Moon, and Mars. Managers, cash upgrades, milestones, offline earnings, and angel-investor prestige. | Click / tap to earn · `1`/`2`/`3` switch planet · `B`/`U`/`A` switch tabs · `Space` pause |

Each game tracks a persistent high score. Every game is keyboard-native. Every game fits the same monochrome grid so nothing looks out of place next to your code.

## Install

### From the marketplace

- **VS Code / VSCodium** — [install from the Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=flancast90.cursor-snake) or search *Cursor Arcade* in the Extensions pane.
- **Cursor / other OSS VS Code forks** — [install from Open VSX](https://open-vsx.org/extension/flancast90/cursor-snake) or search *Cursor Arcade* in Cursor's Extensions pane.

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
| `Arcade: Play Pong (1P / 2P)` | Jump straight into Pong. |
| `Arcade: Play Tic-Tac-Toe (1P / 2P)` | Jump straight into Tic-Tac-Toe. |
| `Arcade: Play Head Soccer (1P / 2P)` | Jump straight into Head Soccer. |
| `Arcade: Play Capitalist (idle tycoon)` | Jump straight into Capitalist. |
| `Arcade: Play Snake — Daily Challenge` | The same seeded board as everyone else today. |
| `Arcade: Reset All High Scores` | Start fresh. |

From the main menu, press `1`–`8` to pick a game. `Esc` always takes you back. `Space` pauses. `R` restarts. That's the whole shape of it.

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

### Pong
| Key | Action |
|---|---|
| `W` / `S` or `↑` / `↓` | Move your paddle |
| `Space` / `P` | Pause |
| `R` | Restart match |

- **1P** mode pits you against a predictive CPU with four difficulty tiers (Easy / Normal / Hard / Insane).
- **2P** hotseat: `W`/`S` for left paddle (P1), `↑`/`↓` for right paddle (P2).
- First to 5 / 7 / 11 / 21 points (configurable). Deflection angle depends on where the ball hits your paddle; ball speed ramps up every rally.
- Consecutive 1P wins against each CPU tier are tracked as a streak.

### Tic-Tac-Toe
| Input | Action |
|---|---|
| Click a cell | Place your mark |
| Numpad `1`–`9` | Place via numpad layout (`7-8-9` top row, `1-2-3` bottom row) |
| Arrows + `Enter` / `Space` | Move keyboard cursor and commit |
| `R` | New game |

- **1P** vs CPU with three difficulty tiers: **Easy** (random), **Normal** (mostly smart, slightly fallible), **Hard** (full minimax — perfect play, you can only draw or lose).
- **2P** hotseat — pass the keyboard. Players alternate who moves first across rounds.
- Total wins per CPU tier are tracked as a high score.

### Head Soccer
| Player | Move | Jump | Kick | Power |
|---|---|---|---|---|
| **P1** | `A` / `D` | `W` | `S` | `Q` |
| **P2** (hotseat) | `←` / `→` | `↑` | `↓` | `/` |

- **Ground kick**: slam low, arcing shots.
- **Air kick**: jump + kick for volleys and scissor kicks.
- **Power shot**: press power once your meter is full, then your next kick is devastating.
- **Power-ups** drop mid-match: **Fire** (next kick burns), **Ice** (next kick freezes opponent), **Giant** (head grows), **Multiball** (extra balls, extra chaos).
- First to 3 goals, or most goals when the match timer runs out.

### Capitalist

An AdVenture Capitalist-style idle tycoon that plays nicely in the background while you code.

- **30 businesses across 3 planets** — Earth (Lemonade → Oil), Moon (Moon Shoes → Giant Laser), Mars (Red Dirt → Terrorformer).
- **Managers** automate each business once hired.
- **~100 cash upgrades** and **~25 angel upgrades** with per-business and all-business profit multipliers, plus angel-effectiveness boosts.
- **Business milestones** at 25 / 50 / 100 / 200 / 300 / 400 owned halve cycle time *and* multiply revenue (x3 × x3 × x3 × x2 × x2 × x2).
- **Angel investors** grant a permanent +2 % per-angel profit boost on reset. Reset pays out `floor(150 · √(lifetime / 1e15))` new angels minus those already owned.
- **Offline earnings** accumulate for up to 12 hours at 25 % efficiency — close the panel and come back richer.
- **Autosaves every 10 seconds** to your VS Code `globalState`. No cloud, no account.

| Key | Action |
|---|---|
| `1` / `2` / `3` | Switch to Earth / Moon / Mars |
| `B` | Businesses tab |
| `U` | Cash upgrades tab |
| `A` | Angel upgrades tab |
| `Space` | Pause |
| Click a business | Run a cycle (before you hire a manager) |
| Click `x1` / `x10` / `x100` / `xMax` | Bulk-buy selector |

## Features

- **Eight polished games** in one extension — no tab-switching, no context-switching.
- **Monochrome throughout** — designed to live next to your code without yelling.
- **Persistent high scores** per game, per mode, per difficulty.
- **Worldwide daily Snake challenge** — a seeded board that changes every UTC day.
- **Hold + ghost + 7-bag randomizer** in Blocks, because that's the right way to do it.
- **No telemetry. No network. No dependencies.** The whole extension is one TypeScript file and a few hundred lines of vanilla JS in a webview.
- **Dark & light themes** that follow your vibe.
- **`Esc` always goes back**, `Space` always pauses. Muscle memory stays yours.

## Roadmap

Ideas welcome via [issues](https://github.com/flancast90/cursor-arcade-games/issues).

- [x] Pong
- [ ] Breakout
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
- **Pong** — Atari's 1972 arcade classic; the underlying game is in the public domain.
- **Tic-Tac-Toe** — folk game predating recorded history; "Hard" mode is a textbook minimax solver. Public domain.
- **Head Soccer** — big-headed soccer is a long-running flash/mobile genre (D1, BGL, etc.); this implementation is independent, with custom physics and a monochrome coat of paint.
- **Capitalist** — inspired by Hyper Hippo's *AdVenture Capitalist* (2014). Business lists, coefficients, milestone halvings, and the angel formula are modelled after the official wiki; all art and code here are original.

---

<div align="center">

If Cursor Arcade helped you survive a rebase, <a href="https://github.com/flancast90/cursor-arcade-games">star the repo</a>. Seriously. I notice.

</div>
