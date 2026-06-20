import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TILE_TYPES } from '../pages/match3/match3Data'
import { playMenuSound } from '../utils/menuAudio'
import './Match3Showcase.css'

// Maximum column counts — must match the CSS grid breakpoints exactly.
const COLS_LG = 11   // > 700px
const COLS_MD = 8    // 481–700px
const COLS_SM = 6    // ≤ 480px
const ROWS    = 5
const DRAG_THRESHOLD = 14

const TILT    = [3, -2, 4, -3, 2, -4, 2.5, -2.5]
const TILE_MAP = new Map(TILE_TYPES.map(t => [t.key, t]))

// ── Responsive column count ───────────────────────────────────────────────────

function colsForWidth(w) {
  if (w <= 480) return COLS_SM
  if (w <= 700) return COLS_MD
  return COLS_LG
}

// ── Pure board helpers ────────────────────────────────────────────────────────

function randomType() {
  return TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)].key
}

function buildBoard(cols) {
  const board = Array.from({ length: ROWS }, () => Array(cols).fill(null))
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < cols; c++) {
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

function swapCreatesMatch(board, rows, cols, r1, c1, r2, c2) {
  const copy = board.map(row => [...row])
  ;[copy[r1][c1], copy[r2][c2]] = [copy[r2][c2], copy[r1][c1]]
  return findMatches(copy, rows, cols).size > 0
}

function hasValidMove(board, rows, cols) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c + 1 < cols && swapCreatesMatch(board, rows, cols, r, c, r, c + 1)) return true
      if (r + 1 < rows && swapCreatesMatch(board, rows, cols, r, c, r + 1, c)) return true
    }
  }
  return false
}

function collapseAndRefill(board, rows, cols, matched) {
  const next = board.map(row => [...row])
  for (const key of matched) {
    const [r, c] = key.split(',').map(Number)
    next[r][c] = null
  }
  for (let c = 0; c < cols; c++) {
    let writeRow = rows - 1
    for (let r = rows - 1; r >= 0; r--) {
      if (next[r][c] !== null) {
        next[writeRow][c] = next[r][c]
        if (writeRow !== r) next[r][c] = null
        writeRow--
      }
    }
    for (let r = writeRow; r >= 0; r--) next[r][c] = randomType()
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
  // cols is derived from the board element width via ResizeObserver.
  // Start with the large-screen default; ResizeObserver corrects it on mount.
  const [cols, setCols]           = useState(COLS_LG)
  const [board, setBoard]         = useState(() => buildBoard(COLS_LG))
  const [uids, setUids]           = useState(() => makeUidGrid(ROWS, COLS_LG))
  const [matched, setMatched]     = useState(new Set())
  const [drag, setDrag]           = useState(null)
  const [resetting, setResetting] = useState(false)

  const busy          = useRef(false)
  const boardEl       = useRef(null)
  const pointerOrigin = useRef(null)
  const boardRef      = useRef(board)
  const colsRef       = useRef(cols)
  const mountedRef    = useRef(true)
  const pendingTimers = useRef([])

  useEffect(() => {
    boardRef.current = board
  }, [board])

  useEffect(() => {
    colsRef.current = cols
  }, [cols])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      for (const id of pendingTimers.current) clearTimeout(id)
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
          setMatched(cascade)
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
  }, [matched]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Swap ──────────────────────────────────────────────────────────────────
  function attemptSwap(r1, c1, r2, c2) {
    if (busy.current) return
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
      setMatched(hits)
      setUids(u => refreshUids(u, hits))
    }, 160)
    pendingTimers.current.push(t)
  }

  // ── Pointer / hit-test ────────────────────────────────────────────────────
  //
  // We compute cell coordinates from the real rendered tile positions rather
  // than dividing the board rect by COLS. This is exact regardless of padding,
  // gap, or breakpoint — and uses colsRef.current so the column count is always
  // in sync with whatever the ResizeObserver last reported.
  //
  function hitTestCell(clientX, clientY) {
    const el = boardEl.current
    if (!el) return null
    const currentCols = colsRef.current

    // Read the first and second tile rects directly — they are always visible
    // because we now render exactly ROWS * currentCols tiles (no CSS hiding).
    const t0el = el.children[0]
    const t1el = el.children[1]
    if (!t0el || !t1el) return null

    const boardRect = el.getBoundingClientRect()
    const t0 = t0el.getBoundingClientRect()
    const t1 = t1el.getBoundingClientRect()

    // Horizontal stride (tile width + gap)
    const strideW = t1.left - t0.left
    if (strideW <= 0) return null

    // Vertical stride: first tile of second row
    const rowStartEl = el.children[currentCols]
    const strideH = rowStartEl
      ? rowStartEl.getBoundingClientRect().top - t0.top
      : t0.height

    if (strideH <= 0) return null

    // Map pointer to grid coordinates relative to the first tile's top-left
    const localX = clientX - t0.left
    const localY = clientY - t0.top

    const col = Math.floor(localX / strideW)
    const row = Math.floor(localY / strideH)

    if (col < 0 || col >= currentCols || row < 0 || row >= ROWS) return null
    return { row, col }
  }

  function onPointerDown(e) {
    if (busy.current) return
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
  return (
    <div className="m3s-wrap" aria-label="Match 3 game preview">

      {/* Floating leaves above the board */}
      {[1,2,3,4,5,6].map(n => (
        <svg key={n} className={`m3s-leaf m3s-leaf--${n}`} viewBox="0 0 24 36" aria-hidden="true">
          <path
            d="M12 2 C5 2 2 12 2 20 C2 28 7 34 12 34 C17 34 22 28 22 20 C22 12 19 2 12 2Z"
            fill={n % 3 === 0 ? '#f6c85f' : n % 3 === 1 ? '#69b95f' : '#74cbd5'}
            opacity="0.85"
          />
          <line x1="12" y1="34" x2="12" y2="6" stroke="#2f6f3e" strokeWidth="1" opacity="0.4" />
          <path d="M12 20 Q7 16 4 18" fill="none" stroke="#2f6f3e" strokeWidth="0.8" opacity="0.35" />
          <path d="M12 20 Q17 16 20 18" fill="none" stroke="#2f6f3e" strokeWidth="0.8" opacity="0.35" />
        </svg>
      ))}

      <div className="m3s-board-wrap">
        {/* Corner sprigs */}
        {['tl','tr','bl','br'].map(pos => (
          <svg key={pos} className={`m3s-sprig m3s-sprig--${pos}`} viewBox="0 0 64 64" aria-hidden="true">
            {/* stem */}
            <path d="M8 56 Q20 36 32 28 Q44 20 52 8" fill="none" stroke="#2f6f3e" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
            {/* three leaves along the stem */}
            <path d="M20 46 C14 38 24 30 28 36 C32 30 24 20 18 28 Z" fill="#69b95f" opacity="0.32"/>
            <path d="M32 28 C26 20 36 12 40 18 C44 12 36 4 30 12 Z"  fill="#69b95f" opacity="0.28"/>
            <path d="M44 18 C38 10 48 4 52 10 C55 4 46 -2 42 6 Z"    fill="#2f6f3e" opacity="0.22"/>
            {/* small round bud */}
            <circle cx="52" cy="8" r="4" fill="#f6c85f" opacity="0.45"/>
          </svg>
        ))}

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
          }}
          data-resetting={resetting || undefined}
        >
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const isMatched = matched.has(`${r},${c}`)
            const isDragged = drag?.r === r && drag?.c === c
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
                ].filter(Boolean).join(' ')}
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
                    className="m3s-tile-img"
                    src={tileData?.url}
                    alt={tileData?.labelEn ?? ''}
                    draggable="false"
                  />
                  <span className="m3s-shine" aria-hidden="true" />
                  {isMatched && <span className="m3s-burst" aria-hidden="true" />}
                </div>
              </motion.div>
            )
          })
        )}
        </div>

        {/* Vine running below the board */}
        <svg className="m3s-vine" viewBox="0 0 720 40" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 20 C60 8 120 32 180 20 C240 8 300 32 360 20 C420 8 480 32 540 20 C600 8 660 32 720 20"
            fill="none" stroke="#2f6f3e" strokeWidth="2" opacity="0.2" strokeLinecap="round"
          />
          {/* Small leaves along the vine */}
          {[90, 180, 270, 360, 450, 540, 630].map((cx, i) => (
            <g key={cx} transform={`translate(${cx}, ${i % 2 === 0 ? 12 : 28})`}>
              <ellipse rx="7" ry="4" fill="#69b95f" opacity="0.3" transform={`rotate(${i % 2 === 0 ? -30 : 30})`} />
            </g>
          ))}
          {/* Small circles (berries / seeds) */}
          {[135, 315, 495, 675].map(cx => (
            <circle key={cx} cx={cx} cy="20" r="3.5" fill="#f6c85f" opacity="0.35" />
          ))}
        </svg>
      </div>
    </div>
  )
}
