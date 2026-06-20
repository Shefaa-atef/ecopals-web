import Phaser from 'phaser'
import {
  COLS, ROWS, TILE_SIZE, UI_HEIGHT,
  SWAP_THRESHOLD, TILE_TYPES,
  SCORE_PER_TILE, COMBO_MULTIPLIER,
  TARGET_SCORE, MAX_MOVES,
} from '../match3Data'
import { playMenuSound } from '../../../utils/menuAudio'

// ── Tween durations (ms) ──────────────────────────────────────────────────────
const T_SWAP    = 220
const T_MATCH   = 180
const T_FALL    = 260
const T_SETTLE  = 80

// ── Pure board helpers (operate on 2-D type arrays, no sprites) ───────────────

function emptyBoard() {
  return Array.from({ length: COLS }, () => Array(ROWS).fill(null))
}

/**
 * Return a list of { col, row } cells that form matches of 3+ in the board.
 * Works on a 2-D array of type-key strings (or null).
 */
function findMatchCells(board) {
  const matched = new Set()
  const key = (c, r) => `${c},${r}`

  // Horizontal runs
  for (let r = 0; r < ROWS; r++) {
    let run = 1
    for (let c = 1; c <= COLS; c++) {
      const same = c < COLS && board[c][r] !== null && board[c][r] === board[c - 1][r]
      if (same) {
        run++
      } else {
        if (run >= 3) {
          for (let k = c - run; k < c; k++) matched.add(key(k, r))
        }
        run = 1
      }
    }
  }

  // Vertical runs
  for (let c = 0; c < COLS; c++) {
    let run = 1
    for (let r = 1; r <= ROWS; r++) {
      const same = r < ROWS && board[c][r] !== null && board[c][r] === board[c][r - 1]
      if (same) {
        run++
      } else {
        if (run >= 3) {
          for (let k = r - run; k < r; k++) matched.add(key(c, k))
        }
        run = 1
      }
    }
  }

  return [...matched].map(s => {
    const [c, r] = s.split(',').map(Number)
    return { col: c, row: r }
  })
}

/** True if swapping (c1,r1)↔(c2,r2) on `board` produces at least one match. */
function swapCreatesMatch(board, c1, r1, c2, r2) {
  const copy = board.map(col => [...col])
  ;[copy[c1][r1], copy[c2][r2]] = [copy[c2][r2], copy[c1][r1]]
  return findMatchCells(copy).length > 0
}

/** True if the board has at least one valid move anywhere. */
function hasValidMove(board) {
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (c + 1 < COLS && swapCreatesMatch(board, c, r, c + 1, r)) return true
      if (r + 1 < ROWS && swapCreatesMatch(board, c, r, c, r + 1)) return true
    }
  }
  return false
}

// ── Scene ─────────────────────────────────────────────────────────────────────

export default class Game extends Phaser.Scene {
  constructor() { super('Game') }

  // ── Lifecycle ───────────────────────────────────────────────────────────────

  create() {
    // board[col][row] = { type: key string, sprite: Phaser.GameObjects.Image }
    this.board   = emptyBoard()
    this.sprites = emptyBoard()  // parallel sprite grid

    this.score     = 0
    this.movesLeft = MAX_MOVES
    this.busy      = false   // locked while animations run

    this.selected  = null    // { col, row } of selected tile, or null
    this.dragStart = null    // { x, y, col, row } for swipe detection

    // Board origin: top-left corner of the grid in canvas coords
    this.originX = (this.scale.width  - COLS * TILE_SIZE) / 2
    this.originY = UI_HEIGHT

    this.drawBackground()
    this.buildMatchFreeBoard()
    this.setupInput()

    // Launch the HUD scene in parallel — always done here so the UI scene
    // gets a fresh reference to this Game scene's event emitter whether
    // this is the first start or a restart from GameOver.
    if (!this.scene.isActive('UI')) {
      this.scene.launch('UI')
    }
  }

  // ── Background ──────────────────────────────────────────────────────────────

  drawBackground() {
    // Off-white board area
    this.add.rectangle(
      this.scale.width / 2,
      UI_HEIGHT + (ROWS * TILE_SIZE) / 2,
      COLS * TILE_SIZE + 16,
      ROWS * TILE_SIZE + 16,
      0xeef7ec,
    ).setOrigin(0.5)

    // Subtle cell grid
    const g = this.add.graphics()
    g.lineStyle(1, 0xc8e6c0, 0.5)
    for (let c = 0; c <= COLS; c++) {
      const x = this.originX + c * TILE_SIZE
      g.lineBetween(x, UI_HEIGHT, x, UI_HEIGHT + ROWS * TILE_SIZE)
    }
    for (let r = 0; r <= ROWS; r++) {
      const y = this.originY + r * TILE_SIZE
      g.lineBetween(this.originX, y, this.originX + COLS * TILE_SIZE, y)
    }
  }

  // ── Board construction ──────────────────────────────────────────────────────

  /**
   * Fill the board with random tiles, re-rolling any cell that would
   * immediately form a 3-in-a-row either horizontally or vertically.
   */
  buildMatchFreeBoard() {
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        // Collect which types would create a match at (c, r)
        const forbidden = new Set()
        if (c >= 2
          && this.board[c - 1][r] === this.board[c - 2][r]
          && this.board[c - 1][r] !== null) {
          forbidden.add(this.board[c - 1][r])
        }
        if (r >= 2
          && this.board[c][r - 1] === this.board[c][r - 2]
          && this.board[c][r - 1] !== null) {
          forbidden.add(this.board[c][r - 1])
        }

        const pool = TILE_TYPES.filter(t => !forbidden.has(t.key))
        const type = Phaser.Utils.Array.GetRandom(pool.length ? pool : TILE_TYPES)
        this.board[c][r] = type.key
        this.sprites[c][r] = this.createSprite(c, r, type.key)
      }
    }
  }

  // ── Sprite helpers ──────────────────────────────────────────────────────────

  createSprite(col, row, typeKey, fromAbove = false) {
    const { x, y } = this.cellToWorld(col, row)
    const spawnY = fromAbove ? this.originY - TILE_SIZE * 1.5 : y
    const img = this.add.image(x, spawnY, typeKey)
      .setDisplaySize(TILE_SIZE - 8, TILE_SIZE - 8)
      .setInteractive()
    return img
  }

  cellToWorld(col, row) {
    return {
      x: this.originX + col * TILE_SIZE + TILE_SIZE / 2,
      y: this.originY + row * TILE_SIZE + TILE_SIZE / 2,
    }
  }

  worldToCell(wx, wy) {
    const col = Math.floor((wx - this.originX) / TILE_SIZE)
    const row = Math.floor((wy - this.originY) / TILE_SIZE)
    return { col, row }
  }

  inBounds(col, row) {
    return col >= 0 && col < COLS && row >= 0 && row < ROWS
  }

  // ── Input ───────────────────────────────────────────────────────────────────

  setupInput() {
    this.input.on('pointerdown', this.onDown, this)
    this.input.on('pointerup',   this.onUp,   this)
  }

  onDown(ptr) {
    if (this.busy) return
    const { col, row } = this.worldToCell(ptr.x, ptr.y)
    if (!this.inBounds(col, row)) return
    this.dragStart = { x: ptr.x, y: ptr.y, col, row }
  }

  onUp(ptr) {
    if (!this.dragStart || this.busy) { this.dragStart = null; return }

    const dx = ptr.x - this.dragStart.x
    const dy = ptr.y - this.dragStart.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const { col, row } = this.dragStart
    this.dragStart = null

    if (dist >= SWAP_THRESHOLD) {
      // ── Swipe gesture ──
      const tc = col + (Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 1 : -1) : 0)
      const tr = row + (Math.abs(dy) >  Math.abs(dx) ? (dy > 0 ? 1 : -1) : 0)
      if (this.inBounds(tc, tr)) this.attemptSwap(col, row, tc, tr)
    } else {
      // ── Tap to select / swap ──
      if (!this.selected) {
        this.selectTile(col, row)
      } else if (this.selected.col === col && this.selected.row === row) {
        this.deselectTile()
      } else {
        const sc = this.selected.col, sr = this.selected.row
        const adjacent =
          (sc === col && Math.abs(sr - row) === 1) ||
          (sr === row && Math.abs(sc - col) === 1)
        if (adjacent) {
          this.deselectTile()
          this.attemptSwap(sc, sr, col, row)
        } else {
          // Move selection to new tile
          this.deselectTile()
          this.selectTile(col, row)
        }
      }
    }
  }

  selectTile(col, row) {
    this.selected = { col, row }
    const spr = this.sprites[col][row]
    if (!spr) return
    playMenuSound('hover')
    // Pulse scale to signal selection
    this.tweens.add({
      targets: spr,
      scaleX: (TILE_SIZE - 8) / spr.width  * 1.15,
      scaleY: (TILE_SIZE - 8) / spr.height * 1.15,
      alpha: 0.75,
      duration: 120,
      ease: 'Power2',
      yoyo: true,
      repeat: -1,
    })
    spr.setTint(0xffffff)
    spr.preFX?.addGlow(0x69b95f, 6, 0)
  }

  deselectTile() {
    if (!this.selected) return
    const spr = this.sprites[this.selected.col]?.[this.selected.row]
    if (spr) {
      this.tweens.killTweensOf(spr)
      spr.setDisplaySize(TILE_SIZE - 8, TILE_SIZE - 8)
      spr.setAlpha(1)
      spr.clearTint()
      spr.preFX?.clear()
    }
    this.selected = null
  }

  // ── Swap ────────────────────────────────────────────────────────────────────

  async attemptSwap(c1, r1, c2, r2) {
    this.busy = true
    playMenuSound('match3-swap')

    // Capture pixel positions BEFORE the forward tween so the reverse tween
    // can return sprites to exactly where they started (the array hasn't been
    // swapped yet, so reading cellToWorld here gives the original positions).
    const p1 = this.cellToWorld(c1, r1)
    const p2 = this.cellToWorld(c2, r2)

    await this.tweenSwapToXY(
      this.sprites[c1][r1], p2.x, p2.y,
      this.sprites[c2][r2], p1.x, p1.y,
    )

    // Check if the swap creates any match
    const tempBoard = this.board.map(col => [...col])
    ;[tempBoard[c1][r1], tempBoard[c2][r2]] = [tempBoard[c2][r2], tempBoard[c1][r1]]

    if (findMatchCells(tempBoard).length > 0) {
      // Commit swap to data
      ;[this.board[c1][r1], this.board[c2][r2]] = [this.board[c2][r2], this.board[c1][r1]]
      ;[this.sprites[c1][r1], this.sprites[c2][r2]] = [this.sprites[c2][r2], this.sprites[c1][r1]]

      this.movesLeft--
      this.events.emit('state-update', this.score, this.movesLeft)

      await this.resolveCascade()
    } else {
      // Invalid swap — animate sprites back to their original positions
      await this.tweenSwapToXY(
        this.sprites[c1][r1], p1.x, p1.y,
        this.sprites[c2][r2], p2.x, p2.y,
      )
    }

    this.busy = false
    this.checkEndConditions()
  }

  // Move two sprites simultaneously to explicit pixel coordinates.
  tweenSwapToXY(s1, x1, y1, s2, x2, y2) {
    return Promise.all([
      this.moveSpriteToXY(s1, x1, y1, T_SWAP),
      this.moveSpriteToXY(s2, x2, y2, T_SWAP),
    ])
  }

  // ── Cascade resolution ──────────────────────────────────────────────────────

  async resolveCascade() {
    let combo = 0

    while (true) {
      const matches = findMatchCells(this.board)
      if (matches.length === 0) break

      combo++
      const points = Math.round(matches.length * SCORE_PER_TILE * Math.pow(COMBO_MULTIPLIER, combo - 1))
      this.score += points
      playMenuSound('match3-match')
      this.events.emit('state-update', this.score, this.movesLeft, combo > 1 ? combo : 0)

      // Remove matched tiles
      await Promise.all(matches.map(({ col, row }) => this.removeTile(col, row)))
      await this.delay(T_SETTLE)

      // Gravity: drop existing tiles down
      await this.applyGravity()
      await this.delay(T_SETTLE)

      // Refill from top
      await this.refill()
      await this.delay(T_SETTLE)
    }

    // Deadlock check: if no valid moves remain, reshuffle
    if (!hasValidMove(this.board)) {
      await this.reshuffle()
    }
  }

  async removeTile(col, row) {
    const spr = this.sprites[col][row]
    this.board[col][row]   = null
    this.sprites[col][row] = null
    if (!spr) return
    return new Promise(resolve => {
      this.tweens.add({
        targets: spr,
        scaleX: 0, scaleY: 0, alpha: 0,
        duration: T_MATCH,
        ease: 'Back.easeIn',
        onComplete: () => { spr.destroy(); resolve() },
      })
    })
  }

  async applyGravity() {
    const promises = []
    for (let c = 0; c < COLS; c++) {
      // Walk from bottom up; pull each non-null tile down into empty slots
      let writeRow = ROWS - 1
      for (let r = ROWS - 1; r >= 0; r--) {
        if (this.board[c][r] !== null) {
          if (r !== writeRow) {
            this.board[c][writeRow]   = this.board[c][r]
            this.sprites[c][writeRow] = this.sprites[c][r]
            this.board[c][r]   = null
            this.sprites[c][r] = null

            const { x, y } = this.cellToWorld(c, writeRow)
            promises.push(this.moveSpriteToXY(this.sprites[c][writeRow], x, y, T_FALL))
          }
          writeRow--
        }
      }
    }
    if (promises.length) await Promise.all(promises)
  }

  async refill() {
    const promises = []
    for (let c = 0; c < COLS; c++) {
      // Count empty slots so the topmost-landing tile (row 0) gets the
      // highest spawn point and the shortest fall distance is assigned to
      // the tile landing at the deepest empty row.
      const emptyCells = []
      for (let r = 0; r < ROWS; r++) {
        if (this.board[c][r] === null) emptyCells.push(r)
      }
      const total = emptyCells.length
      if (total === 0) continue

      for (let i = 0; i < total; i++) {
        const r = emptyCells[i]
        // Tiles landing at smaller rows (higher on screen) need to spawn
        // further above the board; assign descending offsets top-to-bottom.
        const spawnOffset = total - i

        const type = Phaser.Utils.Array.GetRandom(TILE_TYPES)
        this.board[c][r] = type.key

        const { x, y } = this.cellToWorld(c, r)
        const spr = this.add.image(
          x,
          this.originY - TILE_SIZE * spawnOffset,
          type.key,
        ).setDisplaySize(TILE_SIZE - 8, TILE_SIZE - 8)

        this.sprites[c][r] = spr

        promises.push(this.moveSpriteToXY(spr, x, y, T_FALL, 'Back.easeOut', () => {
          playMenuSound('match3-land')
        }))
      }
    }
    if (promises.length) await Promise.all(promises)
  }

  // ── Reshuffle (deadlock) ─────────────────────────────────────────────────────

  async reshuffle() {
    // Flash all tiles to signal reshuffle
    this.tweens.add({
      targets: Object.values(this.sprites).flat().filter(Boolean),
      alpha: 0.3,
      duration: 180,
      yoyo: true,
      repeat: 1,
    })
    await this.delay(600)

    // Keep reshuffling until there's a valid move and no initial matches
    do {
      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS; r++) {
          const type = Phaser.Utils.Array.GetRandom(TILE_TYPES)
          this.board[c][r] = type.key
          if (this.sprites[c][r]) {
            this.sprites[c][r].setTexture(type.key)
          }
        }
      }
    } while (findMatchCells(this.board).length > 0 || !hasValidMove(this.board))
  }

  // ── Win / Lose ───────────────────────────────────────────────────────────────

  checkEndConditions() {
    if (this.score >= TARGET_SCORE) {
      this.time.delayedCall(300, () => this.scene.start('GameOver', { won: true,  score: this.score }))
    } else if (this.movesLeft <= 0) {
      this.time.delayedCall(300, () => this.scene.start('GameOver', { won: false, score: this.score }))
    }
  }

  // ── Tween helpers ────────────────────────────────────────────────────────────

  moveSpriteToXY(spr, x, y, duration = T_SWAP, ease = 'Power2.easeOut', onComplete) {
    if (!spr) return Promise.resolve()
    return new Promise(resolve => {
      this.tweens.add({
        targets: spr,
        x, y,
        duration,
        ease,
        onComplete: () => { onComplete?.(); resolve() },
      })
    })
  }

  delay(ms) {
    return new Promise(resolve => this.time.delayedCall(ms, resolve))
  }
}
