import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ICON_SETS, SECTION_TO_SET } from './smoothCursorIcons'
import './SmoothCursor.css'

const SPRING     = { damping: 45, stiffness: 400, mass: 1,   restDelta: 0.001 }
const ROT_SPRING = { damping: 22, stiffness: 220, mass: 0.7 }
const MENU_ICONS = ICON_SETS.flat()
const MENU_ICON_CHANGE_DISTANCE = 76
const MENU_ICON_CHANGE_DELAY = 260

function pickRandomIndex(length, current = -1) {
  if (length <= 1) return 0

  const next = Math.floor(Math.random() * length)
  if (next !== current) return next

  return (next + 1 + Math.floor(Math.random() * (length - 1))) % length
}

export default function SmoothCursor() {
  const [active, setActive]   = useState(false)
  const [entered, setEntered] = useState(false)
  const [iconIdx, setIconIdx] = useState(0)
  const [iconSet, setIconSet] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const mouseX   = useMotionValue(0)
  const mouseY   = useMotionValue(0)
  const rotation = useMotionValue(0)

  const x = useSpring(mouseX,   SPRING)
  const y = useSpring(mouseY,   SPRING)
  const r = useSpring(rotation, ROT_SPRING)

  const prev = useRef({ x: 0, y: 0 })
  const menuOpenRef = useRef(false)
  const menuTravelRef = useRef(0)
  const lastMenuIconChangeRef = useRef(0)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const activeFrame = window.requestAnimationFrame(() => setActive(true))

    const onMove = (e) => {
      const dx = e.clientX - prev.current.x
      const dy = e.clientY - prev.current.y
      prev.current = { x: e.clientX, y: e.clientY }

      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!entered) setEntered(true)

      const speed = Math.sqrt(dx * dx + dy * dy)
      if (menuOpenRef.current && speed > 0.5) {
        menuTravelRef.current += speed

        if (
          menuTravelRef.current >= MENU_ICON_CHANGE_DISTANCE &&
          performance.now() - lastMenuIconChangeRef.current >= MENU_ICON_CHANGE_DELAY
        ) {
          setIconIdx((current) => pickRandomIndex(MENU_ICONS.length, current))
          menuTravelRef.current = 0
          lastMenuIconChangeRef.current = performance.now()
        }
      }

      if (speed > 0.5) {
        const rotationAmount = menuOpenRef.current ? dx * 1.05 : dx * 1.8
        const rotationLimit = menuOpenRef.current ? 11 : 18
        rotation.set(Math.max(-rotationLimit, Math.min(rotationLimit, rotationAmount)))
      } else {
        rotation.set(0)
      }
    }

    window.addEventListener('pointermove', onMove)
    return () => {
      window.cancelAnimationFrame(activeFrame)
      window.removeEventListener('pointermove', onMove)
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    if (menuOpen) return undefined

    const icons = ICON_SETS[iconSet]
    const t = setInterval(() => setIconIdx(i => (i + 1) % icons.length), 3000)
    return () => clearInterval(t)
  }, [iconSet, menuOpen])

  useEffect(() => {
    menuOpenRef.current = menuOpen
    menuTravelRef.current = 0
    lastMenuIconChangeRef.current = performance.now()
    setIconIdx((current) => (menuOpen ? pickRandomIndex(MENU_ICONS.length, current) : 0))
  }, [menuOpen])

  useEffect(() => {
    function syncMenuState() {
      setMenuOpen(Boolean(document.getElementById('game-menu')))
    }

    syncMenuState()

    const observer = new MutationObserver(syncMenuState)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const SECTION_ORDER = ['home', 'game', 'community', 'challenges', 'recycle-portal']
    let currentSet = -1

    function getActiveSet() {
      const scrollMid = window.scrollY + window.innerHeight * 0.5
      let activeId = SECTION_ORDER[0]
      for (const id of SECTION_ORDER) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (scrollMid >= top) activeId = id
      }
      return SECTION_TO_SET[activeId] ?? 0
    }

    function onScroll() {
      const next = getActiveSet()
      if (next !== currentSet) {
        currentSet = next
        setIconSet(next)
        setIconIdx(0)
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!active) return null

  const icons = menuOpen ? MENU_ICONS : ICON_SETS[iconSet]
  const safeIdx = iconIdx % icons.length
  const icon = icons[safeIdx]

  return (
    <motion.div
      className={`smooth-cursor${menuOpen ? ' smooth-cursor--menu' : ''}`}
      style={{ x, y, rotate: r, opacity: entered ? 1 : 0 }}
    >
      {menuOpen ? (
        <motion.div
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          className="smooth-cursor-menu-icon"
          initial={{ scale: 0.72, opacity: 0, rotate: -8 }}
          key={`menu-${icon.id}`}
          style={{ position: 'absolute', top: 0, left: 0 }}
          transition={{ type: 'spring', stiffness: 700, damping: 24 }}
        >
          {icon.element}
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }}
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            key={icon.id}
            style={{ position: 'absolute', top: 0, left: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
          >
            {icon.element}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  )
}
