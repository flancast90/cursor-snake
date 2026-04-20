# Changelog

All notable changes to this extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-04-19

### Added
- Initial release.
- Eight preset game modes: Classic, Wall, Portal, Borderless, Cheese, Twin,
  Poison, Peaceful — plus a Blender mode that mixes any of the seven mods.
- Daily challenge with a deterministic seed per day.
- Four speeds, three board sizes, four apple counts.
- Light and Dark monochrome themes.
- Pause / resume, restart, game-over screen, per-configuration high scores
  persisted in VS Code `globalState`.
- Direction queue (up to two buffered inputs per tick) so tight corner turns
  register cleanly.
- Minimalist monochrome canvas renderer: circular snake segments, ring apples,
  hairline grid, no chrome around the playfield.

[Unreleased]: https://github.com/flancast90/cursor-snake/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/flancast90/cursor-snake/releases/tag/v0.1.0
