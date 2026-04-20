(function () {
  'use strict';

  const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null;

  // ---------- Constants ----------
  const BOARD_SIZES = {
    small:  { cols: 15, rows: 11 },
    medium: { cols: 19, rows: 13 },
    large:  { cols: 25, rows: 15 },
  };
  const SPEEDS = { slow: 170, normal: 115, fast: 75, turbo: 50 };
  const APPLE_COUNTS = { '1': 1, '3': 3, '5': 5, '9': 9 };

  const MODE_HINTS = {
    classic:    'Collide with walls or yourself to die. The original.',
    wall:       'Dodge random internal walls that spawn at game start.',
    portal:     'A pair of portals teleports the snake to the other side.',
    borderless: 'Edges wrap around — you never hit a wall.',
    cheese:     'The snake passes through itself. Apples grow you by two.',
    twin:       'Control two snakes in mirror. Both must survive.',
    poison:     'Eat gray apples and lose control for a bit. Watch out.',
    peaceful:   'No death. Just vibes, fruit, and a growing trail.',
    blender:    'Combine any number of mods below. Make your own monster.',
  };

  function modeToRules(mode) {
    switch (mode) {
      case 'classic':    return { borderless: false, walls: false, portal: false, cheese: false, poison: false, twin: false, peaceful: false };
      case 'wall':       return { borderless: false, walls: true,  portal: false, cheese: false, poison: false, twin: false, peaceful: false };
      case 'portal':     return { borderless: false, walls: false, portal: true,  cheese: false, poison: false, twin: false, peaceful: false };
      case 'borderless': return { borderless: true,  walls: false, portal: false, cheese: false, poison: false, twin: false, peaceful: false };
      case 'cheese':     return { borderless: false, walls: false, portal: false, cheese: true,  poison: false, twin: false, peaceful: false };
      case 'twin':       return { borderless: false, walls: false, portal: false, cheese: false, poison: false, twin: true,  peaceful: false };
      case 'poison':     return { borderless: false, walls: false, portal: false, cheese: false, poison: true,  twin: false, peaceful: false };
      case 'peaceful':   return { borderless: true,  walls: false, portal: false, cheese: false, poison: false, twin: false, peaceful: true  };
      case 'blender':    return readBlenderToggles();
      default:           return { borderless: false, walls: false, portal: false, cheese: false, poison: false, twin: false, peaceful: false };
    }
  }

  function readBlenderToggles() {
    return {
      borderless: $('bBorderless').checked,
      walls:      $('bWalls').checked,
      portal:     $('bPortal').checked,
      cheese:     $('bCheese').checked,
      poison:     $('bPoison').checked,
      twin:       $('bTwin').checked,
      peaceful:   $('bPeaceful').checked,
    };
  }

  // ---------- DOM ----------
  const $ = (id) => document.getElementById(id);
  const canvas = $('board');
  const ctx = canvas.getContext('2d');
  const overlay = $('overlay');
  const overlayTitle = $('overlayTitle');
  const overlayBody = $('overlayBody');
  const overlayBtn = $('overlayBtn');
  const drawer = $('settingsDrawer');

  // ---------- State ----------
  const settings = {
    mode: 'classic',
    speed: 'normal',
    apples: '3',
    board: 'medium',
    theme: 'light',
    grid: true,
    sound: false,
    glow: false,
    scanlines: false,
  };

  let highScores = {};
  let daily = false;
  let dailySeed = 0;

  const game = {
    cols: 19, rows: 13, cell: 32,
    snakes: [],
    apples: [],
    walls: new Set(),
    portals: null,
    rules: modeToRules('classic'),
    running: false,
    paused: false,
    gameOver: false,
    started: false,
    score: 0,
    tickMs: 115,
    lastTick: 0,
    rng: Math.random,
    particles: [],
    flashes: [],
    tickCount: 0,
    lastAppleAt: 0,
  };

  // ---------- Utilities ----------
  function key(x, y) { return x + ',' + y; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  // Mulberry32 seeded RNG
  function seededRng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function todaySeed() {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }

  function randInt(rng, min, max) { return Math.floor(rng() * (max - min + 1)) + min; }

  // ---------- Audio (tiny Web Audio blips) ----------
  let audioCtx = null;
  function beep(freq, dur = 0.06, type = 'square', vol = 0.05) {
    if (!settings.sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.value = vol;
      osc.connect(g).connect(audioCtx.destination);
      osc.start();
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      osc.stop(audioCtx.currentTime + dur);
    } catch (_) { /* noop */ }
  }

  // ---------- Theme colors ----------
  function themeColors() {
    const cs = getComputedStyle(document.body);
    const v = (n, fb) => (cs.getPropertyValue(n).trim() || fb);
    return {
      bg:            v('--bg', '#ffffff'),
      fg:            v('--fg', '#0a0a0a'),
      fgMuted:       v('--fg-muted', '#737373'),
      fgDim:         v('--fg-dim', '#a3a3a3'),
      grid:          v('--grid', '#ededed'),
      border:        v('--border', '#ececec'),
      borderStrong:  v('--border-strong', '#d4d4d4'),
    };
  }

  // ---------- Canvas sizing ----------
  function resizeCanvas() {
    const stage = canvas.parentElement;
    const pad = 16;
    const availW = stage.clientWidth - pad;
    const availH = stage.clientHeight - pad;
    const cell = Math.floor(Math.min(availW / game.cols, availH / game.rows));
    game.cell = Math.max(12, cell);
    canvas.width = game.cell * game.cols;
    canvas.height = game.cell * game.rows;
  }

  window.addEventListener('resize', () => { resizeCanvas(); draw(); });

  // ---------- Game setup ----------
  function newGame(opts = {}) {
    const rules = modeToRules(settings.mode);
    game.rules = rules;

    const size = BOARD_SIZES[settings.board];
    game.cols = size.cols;
    game.rows = size.rows;
    resizeCanvas();

    game.tickMs = SPEEDS[settings.speed];
    game.rng = daily ? seededRng(dailySeed + hashStr(settings.mode + settings.board)) : Math.random;

    game.snakes = [];
    const cx = Math.floor(game.cols / 2);
    const cy = Math.floor(game.rows / 2);

    const mk = (startX, startY, dir, color) => ({
      body: [
        { x: startX,     y: startY },
        { x: startX - dir.x, y: startY - dir.y },
        { x: startX - 2 * dir.x, y: startY - 2 * dir.y },
      ],
      dir: { ...dir },
      dirQueue: [],
      alive: true,
      grow: 0,
      poisonTicks: 0,
      color,
    });

    if (rules.twin) {
      game.snakes.push(mk(Math.max(3, cx - 4), cy, { x: 1, y: 0 }, 'accent'));
      game.snakes.push(mk(Math.min(game.cols - 4, cx + 4), cy, { x: -1, y: 0 }, 'accent2'));
    } else {
      game.snakes.push(mk(Math.max(3, cx - 2), cy, { x: 1, y: 0 }, 'accent'));
    }

    game.walls = new Set();
    if (rules.walls) {
      const n = Math.floor(game.cols * game.rows * 0.04);
      for (let i = 0; i < n; i++) {
        for (let tries = 0; tries < 20; tries++) {
          const x = randInt(game.rng, 2, game.cols - 3);
          const y = randInt(game.rng, 2, game.rows - 3);
          if (!isBlocked(x, y) && !nearAnySnakeStart(x, y, 3)) {
            game.walls.add(key(x, y));
            break;
          }
        }
      }
    }

    game.portals = null;
    if (rules.portal) {
      const a = findEmptyCell(5);
      const b = findEmptyCell(5, a);
      if (a && b) game.portals = [a, b];
    }

    game.apples = [];
    const target = APPLE_COUNTS[settings.apples];
    for (let i = 0; i < target; i++) spawnApple(false);
    if (rules.poison) spawnApple(true);

    game.score = 0;
    game.running = true;
    game.paused = false;
    game.gameOver = false;
    game.started = false;
    game.particles = [];
    game.flashes = [];
    game.tickCount = 0;
    game.lastTick = performance.now();

    updateStats();
    showOverlay('READY', readyBody(), daily ? '▶ Start Daily' : '▶ Start');
  }

  function readyBody() {
    if (daily) {
      return 'Daily Challenge — a shared seed based on today.<br>' +
             '<kbd>Arrows</kbd>/<kbd>WASD</kbd> move · <kbd>Space</kbd> pause · <kbd>R</kbd> restart';
    }
    return 'Use <kbd>Arrows</kbd> / <kbd>WASD</kbd> to move.<br>' +
           '<kbd>Space</kbd> pause · <kbd>R</kbd> restart · <kbd>Esc</kbd> settings';
  }

  function nearAnySnakeStart(x, y, r) {
    for (const s of game.snakes) {
      for (const seg of s.body) {
        if (Math.abs(seg.x - x) + Math.abs(seg.y - y) <= r) return true;
      }
    }
    return false;
  }

  function isBlocked(x, y) {
    if (game.walls.has(key(x, y))) return true;
    for (const s of game.snakes) {
      for (const seg of s.body) if (seg.x === x && seg.y === y) return true;
    }
    return false;
  }

  function findEmptyCell(pad = 1, notEqual = null) {
    for (let tries = 0; tries < 200; tries++) {
      const x = randInt(game.rng, pad, game.cols - 1 - pad);
      const y = randInt(game.rng, pad, game.rows - 1 - pad);
      if (isBlocked(x, y)) continue;
      if (hasApple(x, y)) continue;
      if (notEqual && x === notEqual.x && y === notEqual.y) continue;
      if (game.portals && game.portals.some((p) => p.x === x && p.y === y)) continue;
      return { x, y };
    }
    return null;
  }

  function hasApple(x, y) { return game.apples.some((a) => a.x === x && a.y === y); }

  function spawnApple(poison = false) {
    const c = findEmptyCell(1);
    if (c) game.apples.push({ x: c.x, y: c.y, poison });
  }

  function hashStr(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  // ---------- Input ----------
  const DIRS = {
    up:    { x: 0, y: -1 },
    down:  { x: 0, y: 1 },
    left:  { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };
  function queueDir(s, d) {
    if (!s || !s.alive) return;
    const last = s.dirQueue.length ? s.dirQueue[s.dirQueue.length - 1] : s.dir;
    // Reject 180° reversals against the most recent intent
    if (last.x === -d.x && last.y === -d.y && s.body.length > 1) return;
    // Don't pile up duplicates of the same direction
    if (last.x === d.x && last.y === d.y) return;
    if (s.dirQueue.length < 2) s.dirQueue.push({ ...d });
  }

  function setDir(name) {
    const d = DIRS[name];
    if (!d) return;
    queueDir(game.snakes[0], d);
    if (game.rules.twin && game.snakes[1]) {
      queueDir(game.snakes[1], { x: -d.x, y: d.y });
    }
    if (!game.started && game.running && !game.paused && !game.gameOver) {
      game.started = true;
      hideOverlay();
    }
  }

  window.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === 'SELECT' || tag === 'INPUT') return;

    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W':    setDir('up'); e.preventDefault(); break;
      case 'ArrowDown': case 's': case 'S':  setDir('down'); e.preventDefault(); break;
      case 'ArrowLeft': case 'a': case 'A':  setDir('left'); e.preventDefault(); break;
      case 'ArrowRight': case 'd': case 'D': setDir('right'); e.preventDefault(); break;
      case ' ':        togglePause(); e.preventDefault(); break;
      case 'p': case 'P': togglePause(); break;
      case 'r': case 'R': daily = false; newGame(); break;
      case 'Enter':    onOverlayAction(); break;
      case 'Escape':   toggleDrawer(); break;
    }
  });

  function togglePause() {
    if (game.gameOver || !game.running || !game.started) return;
    game.paused = !game.paused;
    if (game.paused) showOverlay('PAUSED', 'Press <kbd>Space</kbd> to resume.', '▶ Resume');
    else hideOverlay();
  }

  // ---------- Tick ----------
  function tick() {
    game.tickCount++;

    // Decide movement directions
    for (const s of game.snakes) {
      if (!s.alive) continue;
      if (s.poisonTicks > 0) {
        s.dir = pickPoisonDir(s);
        s.dirQueue.length = 0;
        s.poisonTicks--;
      } else if (s.dirQueue.length > 0) {
        s.dir = s.dirQueue.shift();
      }
    }

    // Move heads
    const newHeads = [];
    for (let i = 0; i < game.snakes.length; i++) {
      const s = game.snakes[i];
      if (!s.alive) { newHeads.push(null); continue; }
      let nx = s.body[0].x + s.dir.x;
      let ny = s.body[0].y + s.dir.y;

      if (game.rules.borderless) {
        nx = (nx + game.cols) % game.cols;
        ny = (ny + game.rows) % game.rows;
      }
      newHeads.push({ x: nx, y: ny });
    }

    // Portals
    if (game.portals) {
      for (let i = 0; i < newHeads.length; i++) {
        const h = newHeads[i];
        if (!h) continue;
        if (h.x === game.portals[0].x && h.y === game.portals[0].y) {
          newHeads[i] = { x: game.portals[1].x + game.snakes[i].dir.x, y: game.portals[1].y + game.snakes[i].dir.y };
        } else if (h.x === game.portals[1].x && h.y === game.portals[1].y) {
          newHeads[i] = { x: game.portals[0].x + game.snakes[i].dir.x, y: game.portals[0].y + game.snakes[i].dir.y };
        }
      }
    }

    // Collision detection
    const deaths = new Array(game.snakes.length).fill(false);
    for (let i = 0; i < game.snakes.length; i++) {
      const s = game.snakes[i];
      const h = newHeads[i];
      if (!s.alive || !h) continue;

      if (!game.rules.borderless) {
        if (h.x < 0 || h.y < 0 || h.x >= game.cols || h.y >= game.rows) { deaths[i] = true; continue; }
      }
      if (game.walls.has(key(h.x, h.y))) { deaths[i] = true; continue; }

      // Self/other-snake collision (skip if cheese)
      if (!game.rules.cheese) {
        for (let j = 0; j < game.snakes.length; j++) {
          const other = game.snakes[j];
          if (!other.alive) continue;
          const limit = (j === i) ? other.body.length - 1 : other.body.length; // tail moves out for self
          for (let k = 0; k < limit; k++) {
            const seg = other.body[k];
            if (seg.x === h.x && seg.y === h.y) { deaths[i] = true; break; }
          }
          if (deaths[i]) break;
        }
      }
    }

    // Head-to-head collision
    for (let i = 0; i < newHeads.length; i++) {
      for (let j = i + 1; j < newHeads.length; j++) {
        if (!newHeads[i] || !newHeads[j]) continue;
        if (newHeads[i].x === newHeads[j].x && newHeads[i].y === newHeads[j].y) {
          deaths[i] = true; deaths[j] = true;
        }
      }
    }

    // Peaceful: don't die; block the bad move instead
    if (game.rules.peaceful) {
      for (let i = 0; i < deaths.length; i++) {
        if (deaths[i]) {
          deaths[i] = false;
          newHeads[i] = { ...game.snakes[i].body[0] };
        }
      }
    }

    // Apply death -> game over
    let someoneDied = false;
    for (let i = 0; i < deaths.length; i++) {
      if (deaths[i]) { game.snakes[i].alive = false; someoneDied = true; }
    }
    if (someoneDied) {
      beep(110, 0.25, 'sawtooth', 0.08);
      return endGame();
    }

    // Apply movement + eating
    for (let i = 0; i < game.snakes.length; i++) {
      const s = game.snakes[i];
      if (!s.alive) continue;
      const h = newHeads[i];
      s.body.unshift(h);

      const appleIdx = game.apples.findIndex((a) => a.x === h.x && a.y === h.y);
      if (appleIdx >= 0) {
        const apple = game.apples[appleIdx];
        game.apples.splice(appleIdx, 1);

        if (apple.poison) {
          s.poisonTicks = Math.max(8, Math.floor(s.body.length * 2 / 3));
          burst(h.x, h.y);
          beep(180, 0.12, 'sawtooth', 0.06);
        } else {
          const grow = game.rules.cheese ? 2 : 1;
          s.grow += grow;
          game.score += 1;
          game.lastAppleAt = performance.now();
          burst(h.x, h.y);
          beep(520 + Math.min(game.score * 8, 600), 0.08, 'square', 0.06);
          spawnApple(false);
          if (game.rules.poison && !game.apples.some((a) => a.poison)) spawnApple(true);
        }
      }

      if (s.grow > 0) s.grow--;
      else s.body.pop();
    }

    updateStats();
  }

  function pickPoisonDir(s) {
    // Choose a direction that doesn't immediately kill (best-effort)
    const opts = [DIRS.up, DIRS.down, DIRS.left, DIRS.right].filter(
      (d) => !(d.x === -s.dir.x && d.y === -s.dir.y),
    );
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(game.rng() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    for (const d of opts) {
      const nx = s.body[0].x + d.x;
      const ny = s.body[0].y + d.y;
      if (!game.rules.borderless && (nx < 0 || ny < 0 || nx >= game.cols || ny >= game.rows)) continue;
      if (game.walls.has(key(nx, ny))) continue;
      return d;
    }
    return s.dir;
  }

  // ---------- Particles ----------
  function burst(cx, cy) {
    const c = themeColors();
    const color = c.fg;
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 1.8;
      game.particles.push({
        x: cx + 0.5, y: cy + 0.5,
        vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
        life: 1, color,
      });
    }
    game.flashes.push({ x: cx, y: cy, life: 1, color });
  }

  function stepParticles(dt) {
    const g = 0.08;
    for (const p of game.particles) {
      p.x += p.vx * dt * 0.06;
      p.y += p.vy * dt * 0.06;
      p.vy += g * dt * 0.02;
      p.life -= dt * 0.0025;
    }
    game.particles = game.particles.filter((p) => p.life > 0);

    for (const f of game.flashes) f.life -= dt * 0.003;
    game.flashes = game.flashes.filter((f) => f.life > 0);
  }

  // ---------- Render ----------
  function draw() {
    const c = themeColors();
    const cs = game.cell;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, w, h);

    if (settings.grid) {
      ctx.save();
      ctx.strokeStyle = c.grid;
      ctx.lineWidth = 1;
      for (let x = 1; x < game.cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cs + 0.5, 0);
        ctx.lineTo(x * cs + 0.5, h);
        ctx.stroke();
      }
      for (let y = 1; y < game.rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cs + 0.5);
        ctx.lineTo(w, y * cs + 0.5);
        ctx.stroke();
      }
      ctx.restore();
    }

    if (game.rules.borderless) {
      ctx.save();
      ctx.strokeStyle = c.fgDim;
      ctx.setLineDash([3, 5]);
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
      ctx.restore();
    }

    // walls
    for (const k of game.walls) {
      const [x, y] = k.split(',').map(Number);
      drawWall(x, y, cs, c);
    }

    if (game.portals) {
      drawPortal(game.portals[0], cs, c);
      drawPortal(game.portals[1], cs, c);
    }

    // apples
    for (const a of game.apples) drawApple(a, cs, c);

    // snakes
    for (const s of game.snakes) drawSnake(s, cs, c);

    for (const f of game.flashes) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, f.life) * 0.4;
      ctx.strokeStyle = f.color;
      ctx.lineWidth = 1;
      const r = cs * (0.4 + (1 - f.life) * 0.6);
      ctx.beginPath();
      ctx.arc(f.x * cs + cs / 2, f.y * cs + cs / 2, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    for (const p of game.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life) * 0.7;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x * cs - 1.5, p.y * cs - 1.5, 3, 3);
      ctx.restore();
    }
  }

  function drawWall(x, y, cs, c) {
    ctx.save();
    ctx.fillStyle = c.borderStrong;
    const cx = x * cs + cs / 2;
    const cy = y * cs + cs / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, cs * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawPortal(p, cs, c) {
    ctx.save();
    ctx.translate(p.x * cs + cs / 2, p.y * cs + cs / 2);
    ctx.strokeStyle = c.fgMuted;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, cs * 0.34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, cs * 0.18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawApple(a, cs, c) {
    const cx = a.x * cs + cs / 2;
    const cy = a.y * cs + cs / 2;
    const r = cs * 0.32;

    // Subtle in/out pulse — the one "moving" visual allowed in the monochrome scheme.
    const pulse = 1 + Math.sin(performance.now() / 320) * 0.06;

    ctx.save();
    ctx.strokeStyle = a.poison ? c.fgMuted : c.fg;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r * pulse, 0, Math.PI * 2);
    ctx.stroke();

    if (a.poison) {
      const o = r * 0.45;
      ctx.beginPath();
      ctx.moveTo(cx - o, cy - o); ctx.lineTo(cx + o, cy + o);
      ctx.moveTo(cx + o, cy - o); ctx.lineTo(cx - o, cy + o);
      ctx.stroke();
    } else {
      ctx.fillStyle = c.fg;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawSnake(s, cs, c) {
    const color = s.alive ? c.fg : c.fgMuted;
    const pad = Math.max(1, cs * 0.08);
    const headR = (cs - pad * 2) / 2;
    const bodyR = (cs - pad * 2) / 2 * 0.94;

    for (let i = s.body.length - 1; i >= 0; i--) {
      const seg = s.body[i];
      const isHead = i === 0;
      if (game.rules.cheese && !isHead && i % 2 === 1) continue;

      const cx = seg.x * cs + cs / 2;
      const cy = seg.y * cs + cs / 2;
      const r = isHead ? headR : bodyR;

      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (s.poisonTicks > 0) {
      const head = s.body[0];
      ctx.save();
      ctx.strokeStyle = c.fgMuted;
      ctx.setLineDash([2, 3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(head.x * cs + cs / 2, head.y * cs + cs / 2, headR + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // ---------- Loop ----------
  let lastFrame = performance.now();
  let fpsAcc = 0, fpsFrames = 0, fpsLastUpdate = 0;

  function loop(now) {
    const dt = Math.min(100, now - lastFrame);
    lastFrame = now;

    if (game.running && !game.paused && !game.gameOver && game.started) {
      if (now - game.lastTick >= game.tickMs) {
        game.lastTick = now;
        tick();
      }
    }
    stepParticles(dt);
    draw();

    fpsFrames++;
    fpsAcc += dt;
    if (now - fpsLastUpdate > 500) {
      const fps = Math.round(1000 / (fpsAcc / fpsFrames));
      $('fpsLabel').textContent = fps + ' fps';
      fpsLastUpdate = now;
      fpsAcc = 0; fpsFrames = 0;
    }

    requestAnimationFrame(loop);
  }

  // ---------- UI wiring ----------
  function updateStats() {
    $('score').textContent = String(game.score);
    const len = game.snakes.reduce((acc, s) => acc + s.body.length, 0);
    $('length').textContent = String(len);
    $('modeLabel').textContent = labelForMode(settings.mode);
    const hs = highScores[scoreKey()] || 0;
    $('highScore').textContent = String(hs);
  }

  function labelForMode(m) {
    return ({
      classic: 'Classic', wall: 'Wall', portal: 'Portal', borderless: 'Borderless',
      cheese: 'Cheese', twin: 'Twin', poison: 'Poison', peaceful: 'Peaceful',
      blender: 'Blender',
    })[m] || m;
  }

  function scoreKey() {
    const parts = [settings.mode, settings.board, settings.speed, settings.apples];
    if (settings.mode === 'blender') {
      const r = readBlenderToggles();
      parts.push(Object.keys(r).filter((k) => r[k]).sort().join('+') || 'none');
    }
    if (daily) parts.push('daily:' + dailySeed);
    return parts.join('|');
  }

  function endGame() {
    game.gameOver = true;
    game.running = false;
    const key = scoreKey();
    const prev = highScores[key] || 0;
    const isNew = game.score > prev;
    if (isNew) {
      highScores[key] = game.score;
      vscode?.postMessage({ type: 'submitScore', key, score: game.score });
    }
    const title = isNew ? 'NEW HIGH SCORE' : 'GAME OVER';
    const body = `You scored <b>${game.score}</b>.<br>` +
      (isNew ? 'A new record. Nice.<br>' : `Best: <b>${prev}</b>.<br>`) +
      'Press <kbd>R</kbd> or click below to play again.';
    showOverlay(title, body, '↻ Play Again');
    updateStats();
  }

  function showOverlay(title, body, btn) {
    overlay.hidden = false;
    overlayTitle.textContent = title;
    overlayBody.innerHTML = body;
    overlayBtn.textContent = btn;
  }
  function hideOverlay() { overlay.hidden = true; }

  function onOverlayAction() {
    if (game.gameOver || !game.running) { newGame(); }
    else if (game.paused) { togglePause(); }
    else if (!game.started) {
      game.started = true; hideOverlay();
    }
  }
  overlayBtn.addEventListener('click', onOverlayAction);
  $('btnStart').addEventListener('click', () => { daily = false; newGame(); });

  // Drawer
  function toggleDrawer(force) {
    const isOpen = drawer.getAttribute('data-open') === 'true';
    const next = typeof force === 'boolean' ? force : !isOpen;
    drawer.setAttribute('data-open', String(next));
    drawer.setAttribute('aria-hidden', String(!next));
  }
  $('btnSettings').addEventListener('click', () => toggleDrawer());
  $('closeSettings').addEventListener('click', () => toggleDrawer(false));

  // Settings bindings
  function bindSelect(id, key, onChange) {
    const el = $(id);
    el.value = settings[key];
    el.addEventListener('change', () => {
      settings[key] = el.value;
      persistSettings();
      onChange?.();
    });
  }
  function bindToggle(id, key, onChange) {
    const el = $(id);
    el.checked = !!settings[key];
    el.addEventListener('change', () => {
      settings[key] = el.checked;
      persistSettings();
      onChange?.();
    });
  }

  function applyTheme() {
    document.body.dataset.theme = settings.theme;
    document.body.dataset.glow = settings.glow ? 'on' : 'off';
    document.body.dataset.scanlines = settings.scanlines ? 'on' : 'off';
  }

  function showModeHint() {
    $('modeHint').innerHTML = MODE_HINTS[settings.mode] || '';
    $('blenderSection').hidden = settings.mode !== 'blender';
  }

  bindSelect('selMode', 'mode', () => { showModeHint(); });
  bindSelect('selSpeed', 'speed', () => { game.tickMs = SPEEDS[settings.speed]; });
  bindSelect('selApples', 'apples');
  bindSelect('selBoard', 'board');
  bindSelect('selTheme', 'theme', applyTheme);
  bindToggle('chkGrid', 'grid');
  bindToggle('chkSound', 'sound');
  bindToggle('chkGlow', 'glow', applyTheme);
  bindToggle('chkScanlines', 'scanlines', applyTheme);

  // Blender toggles persist on click (no settings object entry, but trigger re-score-key)
  ['bBorderless','bWalls','bPortal','bCheese','bPoison','bTwin','bPeaceful'].forEach((id) => {
    $(id).addEventListener('change', () => { if (settings.mode === 'blender') updateStats(); });
  });

  $('btnDaily').addEventListener('click', () => {
    daily = true;
    dailySeed = todaySeed();
    newGame();
    toggleDrawer(false);
  });
  $('btnResetHS').addEventListener('click', () => {
    highScores = {};
    vscode?.postMessage({ type: 'resetHighScores' });
    vscode?.postMessage({ type: 'toast', message: 'Snake high scores cleared.' });
    updateStats();
  });

  function persistSettings() {
    vscode?.postMessage({ type: 'saveSettings', settings });
  }

  // ---------- Messages from extension ----------
  window.addEventListener('message', (ev) => {
    const msg = ev.data;
    if (!msg || typeof msg !== 'object') return;
    switch (msg.type) {
      case 'hydrate':
        if (msg.settings && typeof msg.settings === 'object') {
          Object.assign(settings, msg.settings);
          // Migrate old theme values that no longer exist.
          if (!['light', 'dark'].includes(settings.theme)) settings.theme = 'light';
          // Glow & scanlines were previously on; force off in the minimalist build.
          settings.glow = false;
          settings.scanlines = false;
          applyAllUI();
        }
        highScores = msg.highScores || {};
        updateStats();
        break;
      case 'highScores':
        highScores = msg.scores || {};
        updateStats();
        break;
      case 'startDailyChallenge':
        daily = true;
        dailySeed = todaySeed();
        newGame();
        toggleDrawer(false);
        break;
    }
  });

  function applyAllUI() {
    $('selMode').value = settings.mode;
    $('selSpeed').value = settings.speed;
    $('selApples').value = settings.apples;
    $('selBoard').value = settings.board;
    $('selTheme').value = settings.theme;
    $('chkGrid').checked = settings.grid;
    $('chkSound').checked = settings.sound;
    $('chkGlow').checked = settings.glow;
    $('chkScanlines').checked = settings.scanlines;
    applyTheme();
    showModeHint();
  }

  // ---------- Boot ----------
  applyAllUI();
  showModeHint();
  resizeCanvas();
  newGame();
  requestAnimationFrame(loop);
})();
