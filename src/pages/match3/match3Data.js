import tileCatUrl     from '../../assets/match3/tile_cat.png'
import tileDuckUrl    from '../../assets/match3/tile_duck.png'
import tileEcopalsUrl from '../../assets/match3/tile_ecopals.png'
import tileSunUrl     from '../../assets/match3/tile_sun.png'
import tileTrashUrl   from '../../assets/match3/tile_trash.png'
import tileTreeUrl    from '../../assets/match3/tile_tree.png'
import tileWaterUrl   from '../../assets/match3/tile_water.png'

// ── Grid ──────────────────────────────────────────────────────────────────────
export const COLS      = 8
export const ROWS      = 8
export const TILE_SIZE = 68   // px per cell

// ── Canvas layout ─────────────────────────────────────────────────────────────
export const UI_HEIGHT    = 64             // top HUD panel
export const BOARD_WIDTH  = COLS * TILE_SIZE          // 544
export const BOARD_HEIGHT = ROWS * TILE_SIZE + UI_HEIGHT // 608

// ── Input ─────────────────────────────────────────────────────────────────────
export const SWAP_THRESHOLD = 28  // px drag distance to trigger a swipe swap

// ── Scoring ───────────────────────────────────────────────────────────────────
export const SCORE_PER_TILE  = 10
export const COMBO_MULTIPLIER = 1.5   // each cascade level multiplies score
export const TARGET_SCORE    = 1000
export const MAX_MOVES       = 30

// ── Tile types ────────────────────────────────────────────────────────────────
export const TILE_TYPES = [
  { key: 'cat',     url: tileCatUrl,     labelEn: 'Cat',    labelAr: 'قطة'    },
  { key: 'duck',    url: tileDuckUrl,    labelEn: 'Duck',   labelAr: 'بطة'    },
  { key: 'ecopals', url: tileEcopalsUrl, labelEn: 'EcoPal', labelAr: 'إيكو'   },
  { key: 'sun',     url: tileSunUrl,     labelEn: 'Sun',    labelAr: 'شمس'    },
  { key: 'trash',   url: tileTrashUrl,   labelEn: 'Trash',  labelAr: 'نفايات' },
  { key: 'tree',    url: tileTreeUrl,    labelEn: 'Tree',   labelAr: 'شجرة'   },
  { key: 'water',   url: tileWaterUrl,   labelEn: 'Water',  labelAr: 'ماء'    },
]
