# Snake

A minimalist, monochrome Snake game that lives inside VS Code and Cursor.
Inspired by Google Snake — eight modes, daily challenge, persistent high
scores, no color except the dots on the page.

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](./LICENSE)
[![VS Marketplace](https://img.shields.io/visual-studio-marketplace/v/flancast90.cursor-snake?label=VS%20Marketplace&color=black)](https://marketplace.visualstudio.com/items?itemName=flancast90.cursor-snake)
[![Open VSX](https://img.shields.io/open-vsx/v/flancast90/cursor-snake?label=Open%20VSX&color=black)](https://open-vsx.org/extension/flancast90/cursor-snake)
[![GitHub stars](https://img.shields.io/github/stars/flancast90/cursor-snake?color=black&logo=github)](https://github.com/flancast90/cursor-snake/stargazers)

---

## Install

### Cursor

Open the Extensions panel (`Cmd+Shift+X`), search **Snake**, click Install.
Or from the command palette (`Cmd+Shift+P`):

```
Extensions: Install Extension → flancast90.cursor-snake
```

Cursor pulls from the [Open VSX Registry](https://open-vsx.org/extension/flancast90/cursor-snake).

### VS Code

Same flow — or grab it from the
[Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=flancast90.cursor-snake).

### From source

```bash
git clone https://github.com/flancast90/cursor-snake
cd cursor-snake
npm install
npm run compile
npm run package        # produces cursor-snake-<version>.vsix
```

Then **Extensions: Install from VSIX…** in Cursor / VS Code.

---

## Play

Open the command palette (`Cmd+Shift+P`) and run:

| Command | What it does |
| --- | --- |
| `Snake: Play` | Open the game panel |
| `Snake: Play Daily Challenge` | Same seed for everyone today |
| `Snake: Reset High Scores` | Wipe saved bests |

### Controls

| Key | Action |
| --- | --- |
| Arrow keys / `WASD` | Move |
| `Space` or `P` | Pause / resume |
| `R` | Restart |
| `Enter` | Start / play again |
| `Esc` | Open / close settings |

Corner turns work — the input layer buffers up to two keypresses per tick, so
`Right → Up` in rapid succession both register.

---

## Modes

| Mode | Behavior |
| --- | --- |
| **Classic** | The original: hit a wall or yourself and it's over. |
| **Wall** | Random internal walls spawn at game start. Deterministic in Daily. |
| **Portal** | A pair of portals teleports the snake to the other side. |
| **Borderless** | Edges wrap around; no walls to die on. |
| **Cheese** | Snake passes through itself; apples grow it by two. |
| **Twin** | Two mirrored snakes move in lockstep — both must survive. |
| **Poison** | Gray apples poison the snake; it auto-steers for several ticks. |
| **Peaceful** | No death, just vibes and a growing trail. |
| **Blender** | Mix any combination of the seven mods independently. |

## Settings

- **Speed** — Slow (170ms/tick), Normal (115ms), Fast (75ms), Turbo (50ms)
- **Apples on board** — 1, 3, 5, or 9
- **Board size** — Small (15×11), Medium (19×13), Large (25×15)
- **Theme** — Light (default) or Dark, both strictly black and white
- **Grid** — on/off
- **Sound** — tiny WebAudio blips, off by default

High scores are keyed by the full configuration (mode + mods + board + speed +
apples) and persisted in VS Code's `globalState`, so they survive restarts.
The daily challenge gets its own score bucket.

## Design

Purely monochrome. One weight of ink:

- Background: `#ffffff` (`#0a0a0a` in dark theme)
- Snake segments: filled black circles
- Apple: thin black ring with a small center dot
- Grid: very light grey hairlines (`#ededed`)
- No panel borders around the playfield — the map blends into the page

The only ambient motion during play is a ~6% breathing pulse on the apple.
Fruit pickup triggers a short monochrome particle burst and an expanding ring
flash — the one concession to feedback.

---

## Development

```bash
npm install
npm run watch          # or: npm run compile
```

- `src/extension.ts` — activation, command registration, webview panel,
  high-score persistence via `globalState`
- `media/index.html` — webview shell with CSP + nonce placeholders
- `media/snake.css` — monochrome stylesheet
- `media/snake.js` — game loop, rendering, input, modes

### Hot-reload tips

- Edits to anything in `media/` → close the Snake tab and reopen via
  **Snake: Play**. The webview re-reads assets each time a panel is created.
- Edits to `src/extension.ts` → `npm run compile`, then run
  **Developer: Reload Window** (no full restart needed).

### Build & publish

```bash
npm run package              # -> cursor-snake-<version>.vsix
npm run publish:vsce         # -> Visual Studio Marketplace
npm run publish:ovsx         # -> Open VSX (Cursor et al.)
```

---

## Contributing

Issues and PRs welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the short
version.

## License

[MIT](./LICENSE) © flancast90
