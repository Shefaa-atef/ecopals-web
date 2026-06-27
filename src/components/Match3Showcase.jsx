import { Fragment, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { TILE_TYPES } from '../pages/match3/match3Data'
import { playMenuSound } from '../utils/menuAudio'
import './Match3Showcase.css'

const MIN_COLS = 6
const MAX_COLS = 24
const DEFAULT_COLS = 16
const TARGET_TILE_SIZE = 76
const ROWS = 5
const SCORE_ROW = 2
const DRAG_THRESHOLD = 14
const HINT_DELAY = 4800
const HINT_DURATION = 2600

const TILT    = [3, -2, 4, -3, 2, -4, 2.5, -2.5]
const TILE_MAP = new Map(TILE_TYPES.map(t => [t.key, t]))

// ── Responsive column count ───────────────────────────────────────────────────

function colsForWidth(w) {
  const gap = w <= 480 ? 7 : 10
  const calculated = Math.floor((w + gap) / (TARGET_TILE_SIZE + gap))
  return Math.max(MIN_COLS, Math.min(MAX_COLS, calculated))
}

function scoreRangeForCols(cols) {
  const span = cols >= 10 ? 3 : 2
  return {
    span,
    start: Math.floor((cols - span) / 2),
  }
}

function isScoreCell(row, col, cols) {
  const { start, span } = scoreRangeForCols(cols)
  return row === SCORE_ROW && col >= start && col < start + span
}

// ── Pure board helpers ────────────────────────────────────────────────────────

function randomType() {
  return TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)].key
}

function createBoard(cols) {
  const board = Array.from({ length: ROWS }, () => Array(cols).fill(null))
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < cols; c++) {
      if (isScoreCell(r, c, cols)) continue
      const forbidden = new Set()
      if (c >= 2 && board[r][c - 1] === board[r][c - 2]) forbidden.add(board[r][c - 1])
      if (r >= 2 && board[r - 1][c] === board[r - 2][c]) forbidden.add(board[r - 1][c])
      let type
      do { type = randomType() } while (forbidden.has(type))
      board[r][c] = type
    }
  }
  return board
}

function buildBoard(cols) {
  let board = createBoard(cols)
  let attempts = 0

  while (!hasValidMove(board, ROWS, cols) && attempts < 60) {
    board = createBoard(cols)
    attempts++
  }

  return board
}

function findMatches(board, rows, cols) {
  const matched = new Set()
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 2; c++) {
      const t = board[r][c]
      if (t && t === board[r][c + 1] && t === board[r][c + 2]) {
        let end = c + 2
        while (end + 1 < cols && board[r][end + 1] === t) end++
        for (let k = c; k <= end; k++) matched.add(`${r},${k}`)
        c = end
      }
    }
  }
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows - 2; r++) {
      const t = board[r][c]
      if (t && t === board[r + 1][c] && t === board[r + 2][c]) {
        let end = r + 2
        while (end + 1 < rows && board[end + 1][c] === t) end++
        for (let k = r; k <= end; k++) matched.add(`${k},${c}`)
        r = end
      }
    }
  }
  return matched
}

function findValidMoves(board, rows, cols) {
  const moves = []
  const directions = [[0, 1], [1, 0]]

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c]) continue

      for (const [dr, dc] of directions) {
        const r2 = r + dr
        const c2 = c + dc
        if (r2 >= rows || c2 >= cols || !board[r2][c2]) continue

        const copy = board.map(row => [...row])
        ;[copy[r][c], copy[r2][c2]] = [copy[r2][c2], copy[r][c]]
        const hits = findMatches(copy, rows, cols)

        if (hits.size > 0) {
          moves.push({
            cells: new Set([...hits, `${r},${c}`, `${r2},${c2}`]),
            swap: new Set([`${r},${c}`, `${r2},${c2}`]),
          })
        }
      }
    }
  }

  return moves
}

function hasValidMove(board, rows, cols) {
  return findValidMoves(board, rows, cols).length > 0
}

function collapseAndRefill(board, rows, cols, matched) {
  const next = board.map(row => [...row])
  for (const key of matched) {
    const [r, c] = key.split(',').map(Number)
    next[r][c] = null
  }
  for (let c = 0; c < cols; c++) {
    const segments = isScoreCell(SCORE_ROW, c, cols)
      ? [[0, SCORE_ROW - 1], [SCORE_ROW + 1, rows - 1]]
      : [[0, rows - 1]]

    for (const [start, end] of segments) {
      let writeRow = end
      for (let r = end; r >= start; r--) {
        if (next[r][c] !== null) {
          next[writeRow][c] = next[r][c]
          if (writeRow !== r) next[r][c] = null
          writeRow--
        }
      }
      for (let r = writeRow; r >= start; r--) next[r][c] = randomType()
    }
  }
  return next
}

// ── UID system ────────────────────────────────────────────────────────────────

let uidCounter = 0
function makeUidGrid(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ++uidCounter),
  )
}

function refreshUids(uids, matched) {
  const next = uids.map(row => [...row])
  for (const key of matched) {
    const [r, c] = key.split(',').map(Number)
    next[r][c] = ++uidCounter
  }
  return next
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Match3Showcase() {
  const { isAr } = useLang()
  // cols is derived from the board element width via ResizeObserver.
  // Start near a common desktop width; ResizeObserver corrects it on mount.
  const [cols, setCols]           = useState(DEFAULT_COLS)
  const [board, setBoard]         = useState(() => buildBoard(DEFAULT_COLS))
  const [uids, setUids]           = useState(() => makeUidGrid(ROWS, DEFAULT_COLS))
  const [matched, setMatched]     = useState(new Set())
  const [drag, setDrag]           = useState(null)
  const [resetting, setResetting] = useState(false)
  const [score, setScore]         = useState(0)
  const [lastGain, setLastGain]   = useState(0)
  const [hint, setHint]           = useState(null)

  const busy          = useRef(false)
  const boardEl       = useRef(null)
  const pointerOrigin = useRef(null)
  const boardRef      = useRef(board)
  const colsRef       = useRef(cols)
  const matchedRef    = useRef(matched)
  const resettingRef  = useRef(resetting)
  const mountedRef    = useRef(true)
  const pendingTimers = useRef([])
  const hintClearTimer = useRef(0)

  useEffect(() => {
    boardRef.current = board
  }, [board])

  useEffect(() => {
    colsRef.current = cols
  }, [cols])

  useEffect(() => {
    matchedRef.current = matched
  }, [matched])

  useEffect(() => {
    resettingRef.current = resetting
  }, [resetting])

  function registerMatches(nextMatches) {
    const earned = nextMatches.size * 10
    setScore(current => current + earned)
    setLastGain(earned)
    setMatched(nextMatches)
    setHint(null)
  }

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      for (const id of pendingTimers.current) clearTimeout(id)
      window.clearTimeout(hintClearTimer.current)
    }
  }, [])

  // ── ResizeObserver: sync cols to actual rendered grid width ───────────────
  useEffect(() => {
    const el = boardEl.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width
      const next = colsForWidth(w)
      if (next === colsRef.current) return
      // Column count changed — rebuild board to match new dimensions.
      // Cancel any in-flight timers so stale callbacks don't corrupt the new board.
      for (const id of pendingTimers.current) clearTimeout(id)
      pendingTimers.current = []
      busy.current = false
      const fresh = buildBoard(next)
      setCols(next)
      colsRef.current = next
      setBoard(fresh)
      boardRef.current = fresh
      setUids(makeUidGrid(ROWS, next))
      setMatched(new Set())
      setDrag(null)
      setResetting(false)
      setHint(null)
    })
    ro.observe(el)
    // Run once immediately with the current width
    const w = el.getBoundingClientRect().width
    const initial = colsForWidth(w)
    if (initial !== colsRef.current) {
      const fresh = buildBoard(initial)
      setCols(initial)
      colsRef.current = initial
      setBoard(fresh)
      boardRef.current = fresh
      setUids(makeUidGrid(ROWS, initial))
    }
    return () => ro.disconnect()
  }, [])

  // ── Cascade: pop → collapse → refill → re-check ───────────────────────────
  useEffect(() => {
    if (matched.size === 0) return
    const currentCols = colsRef.current

    const t1 = setTimeout(() => {
      if (!mountedRef.current) return
      const currentBoard = boardRef.current
      const nextBoard = collapseAndRefill(currentBoard, ROWS, currentCols, matched)
      setBoard(nextBoard)
      boardRef.current = nextBoard
      setUids(u => refreshUids(u, matched))
      setMatched(new Set())

      const t2 = setTimeout(() => {
        if (!mountedRef.current) return
        const c = colsRef.current
        const cascade = findMatches(nextBoard, ROWS, c)
        if (cascade.size > 0) {
          playMenuSound('match3-match')
          registerMatches(cascade)
          setUids(u => refreshUids(u, cascade))
        } else if (!hasValidMove(nextBoard, ROWS, c)) {
          setResetting(true)
          const t3 = setTimeout(() => {
            if (!mountedRef.current) return
            const fresh = buildBoard(c)
            setBoard(fresh)
            boardRef.current = fresh
            setUids(makeUidGrid(ROWS, c))
            setResetting(false)
            busy.current = false
          }, 700)
          pendingTimers.current.push(t3)
        } else {
          busy.current = false
        }
      }, 350)
      pendingTimers.current.push(t2)
    }, 300)

    return () => { clearTimeout(t1) }
  }, [matched])

  // ── Idle hint: pulse a real valid move every few seconds ─────────────────
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (
        busy.current ||
        pointerOrigin.current ||
        resettingRef.current ||
        matchedRef.current.size > 0
      ) return

      const moves = findValidMoves(boardRef.current, ROWS, colsRef.current)
      if (moves.length === 0) return

      setHint(moves[Math.floor(Math.random() * moves.length)])
      window.clearTimeout(hintClearTimer.current)
      hintClearTimer.current = window.setTimeout(() => setHint(null), HINT_DURATION)
    }, HINT_DELAY)

    return () => window.clearInterval(interval)
  }, [])

  // ── Swap ──────────────────────────────────────────────────────────────────
  function attemptSwap(r1, c1, r2, c2) {
    if (busy.current) return
    setHint(null)
    const currentCols = colsRef.current
    // Bounds check against the CURRENT visible column count, not the constant
    if (r2 < 0 || r2 >= ROWS || c2 < 0 || c2 >= currentCols) return

    const current = boardRef.current
    const next = current.map(row => [...row])
    ;[next[r1][c1], next[r2][c2]] = [next[r2][c2], next[r1][c1]]

    const hits = findMatches(next, ROWS, currentCols)
    if (hits.size === 0) return

    busy.current = true
    playMenuSound('match3-swap')

    setBoard(next)
    boardRef.current = next
    setUids(u => {
      const nu = u.map(row => [...row])
      ;[nu[r1][c1], nu[r2][c2]] = [nu[r2][c2], nu[r1][c1]]
      return nu
    })

    const t = setTimeout(() => {
      if (!mountedRef.current) return
      playMenuSound('match3-match')
      registerMatches(hits)
      setUids(u => refreshUids(u, hits))
    }, 160)
    pendingTimers.current.push(t)
  }

  // ── Pointer / hit-test ────────────────────────────────────────────────────
  //
  // Resolve the tile directly under the pointer. This stays exact even with the
  // score lane inserted between board rows.
  //
  function hitTestCell(clientX, clientY) {
    const el = boardEl.current
    if (!el) return null
    const tile = document.elementFromPoint(clientX, clientY)?.closest?.('.m3s-tile')
    if (!tile || !el.contains(tile)) return null

    const row = Number(tile.dataset.row)
    const col = Number(tile.dataset.col)
    if (!Number.isInteger(row) || !Number.isInteger(col)) return null
    return { row, col }
  }

  function onPointerDown(e) {
    if (busy.current) return
    setHint(null)
    const cell = hitTestCell(e.clientX, e.clientY)
    if (!cell) return

    e.currentTarget.setPointerCapture(e.pointerId)
    pointerOrigin.current = { x: e.clientX, y: e.clientY, r: cell.row, c: cell.col }
    setDrag({ r: cell.row, c: cell.col, dx: 0, dy: 0 })
    playMenuSound('hover')
  }

  function onPointerMove(e) {
    if (!pointerOrigin.current || busy.current) return
    const { x, y } = pointerOrigin.current
    setDrag(prev => prev ? { ...prev, dx: e.clientX - x, dy: e.clientY - y } : null)
  }

  function onPointerUp(e) {
    if (!pointerOrigin.current) return
    const { r, c, x, y } = pointerOrigin.current
    const dx = e.clientX - x
    const dy = e.clientY - y
    pointerOrigin.current = null
    setDrag(null)

    if (Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD) return

    if (Math.abs(dx) >= Math.abs(dy)) {
      attemptSwap(r, c, r, c + (dx > 0 ? 1 : -1))
    } else {
      attemptSwap(r, c, r + (dy > 0 ? 1 : -1), c)
    }
  }

  function onPointerCancel() {
    pointerOrigin.current = null
    setDrag(null)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const scoreRange = scoreRangeForCols(cols)

  return (
    <div className="m3s-wrap" aria-label="Match 3 game preview">
      <div className="m3s-board-wrap">
        <div
          className="m3s-board"
          ref={boardEl}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          style={{
            touchAction: 'none',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          }}
          data-resetting={resetting || undefined}
        >
        {Array.from({ length: ROWS }, (_, r) => (
          <Fragment key={`row-${r}`}>
            {r === SCORE_ROW && (
              <div
                className="m3s-score-island"
                role="status"
                aria-live="polite"
                style={{
                  gridColumn: `${scoreRange.start + 1} / span ${scoreRange.span}`,
                  gridRow: SCORE_ROW + 1,
                }}
              >
                <div className="m3s-score-copy">
                  <span className="m3s-score-label" dir={isAr ? 'rtl' : 'ltr'}>
                    {hint
                      ? (isAr ? 'جرّب هذه' : 'Try these')
                      : (isAr ? 'النقاط' : 'Score')}
                  </span>
                  <motion.strong
                    animate={{ scale: [1, 1.12, 1] }}
                    className="m3s-score-value"
                    key={score}
                    transition={{ duration: 0.32, ease: 'easeOut' }}
                  >
                    {score.toLocaleString()}
                  </motion.strong>
                  {lastGain > 0 && (
                    <span className="m3s-score-gain" key={`${score}-${lastGain}`}>
                      +{lastGain}
                    </span>
                  )}
                </div>
              </div>
            )}
            {Array.from({ length: cols }, (_, c) => {
            if (isScoreCell(r, c, cols)) return null

            const isMatched = matched.has(`${r},${c}`)
            const isDragged = drag?.r === r && drag?.c === c
            const isHinted   = hint?.cells.has(`${r},${c}`)
            const isHintSwap = hint?.swap.has(`${r},${c}`)
            const tileData  = TILE_MAP.get(board[r]?.[c])
            const tilt      = TILT[(r * cols + c) % TILT.length]
            const maxOffset = 56
            const dragX = isDragged ? Math.max(-maxOffset, Math.min(maxOffset, drag.dx)) : 0
            const dragY = isDragged ? Math.max(-maxOffset, Math.min(maxOffset, drag.dy)) : 0

            return (
              <motion.div
                key={uids[r]?.[c] ?? `${r}-${c}`}
                className={[
                  'm3s-tile',
                  isDragged ? 'm3s-tile--dragging' : '',
                  isMatched ? 'm3s-tile--popping'  : '',
                  isHinted ? 'm3s-tile--hint' : '',
                  isHintSwap ? 'm3s-tile--hint-swap' : '',
                ].filter(Boolean).join(' ')}
                data-col={c}
                data-row={r}
                style={{ gridColumn: c + 1, gridRow: r + 1 }}
                animate={isDragged
                  ? { scale: 1.22, x: dragX, y: dragY, rotate: tilt * 0.6, zIndex: 20 }
                  : { scale: 1, x: 0, y: 0, rotate: 0 }
                }
                transition={isDragged
                  ? { type: 'tween', duration: 0 }
                  : { type: 'spring', stiffness: 420, damping: 26 }
                }
                whileHover={!isMatched && !isDragged ? {
                  scale: 1.14,
                  rotate: tilt,
                  zIndex: 12,
                  transition: { type: 'spring', stiffness: 500, damping: 18 },
                } : {}}
              >
                <div className="m3s-card">
                  <img
                    className={`m3s-tile-img m3s-tile-img--${tileData?.key ?? 'unknown'}`}
                    src={tileData?.url}
                    alt={tileData?.labelEn ?? ''}
                    draggable="false"
                  />
                  <span className="m3s-shine" aria-hidden="true" />
                  {isMatched && <span className="m3s-burst" aria-hidden="true" />}
                </div>
              </motion.div>
            )
            })}
          </Fragment>
        ))}
        </div>
      </div>
    </div>
  )
}
