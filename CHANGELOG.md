# Changelog

All notable changes to this project are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.2.0] - 2026-04-19

This release rebrands the extension from **Monochrome Snake** into **Cursor Arcade** — a multi-game arcade collection with the same minimalist aesthetic.

### Added
- **2048** — slide/merge puzzle with smooth DOM tile animations, 4×4 / 5×5 / 6×6 board sizes, win-and-continue.
- **Blocks** — tetromino stacker with 7-bag randomizer, hold piece, ghost piece, wall kicks, standard line-clear scoring, and speed curves per level.
- **Minesweeper** — 9×9 / 16×16 / 24×16 difficulties, first-click-safe mine planting, flood reveal, flagging, and chord (middle-click or right-click on revealed number).
- Unified main menu with keyboard hotkeys (`1`–`4`) for each game.
- Per-game persistent high scores, keyed by mode/difficulty.
- Global dark/light theme toggle shared across every game.

### Changed
- Extension identifier renamed from `flancast90.cursor-snake` to `flancast90.cursor-arcade-games` (new listing on both marketplaces).
- Commands re-namespaced to `Arcade: …`.
- Single-panel webview now routes between the main menu and individual games with zero-latency teardown/mount.
- Design language tightened to pure monochrome across all games (previously Snake-only).

### Removed
- Standalone `snake.js` / `snake.css` bundled as top-level assets. Snake now lives as a module in `media/games/`.

## [0.1.2] - 2026-04-19 (legacy: `cursor-snake`)
- Last release under the original `cursor-snake` identifier. Marketplace link preserved for historical reference.

## [0.1.0] - 2026-04-19 (legacy: `cursor-snake`)
- Initial public release of the Snake extension.
- Nine modes, daily challenge, persistent high scores, buffered input queue.
