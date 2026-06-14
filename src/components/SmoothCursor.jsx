import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ICON_SETS, SECTION_TO_SET } from './smoothCursorIcons'
import './SmoothCursor.css'

const SPRING     = { damping: 45, stiffness: 400, mass: 1,   restDelta: 0.001 }
const ROT_SPRING = { damping: 22, stiffness: 220, mass: 0.7 }

export default function SmoothCursor() {
  const [active, setActive]   = useState(false)
  const [entered, setEntered] = useState(false)
  const [iconIdx, setIconIdx] = useState(0)
  const [iconSet, setIconSet] = useState(0)

  const mouseX   = useMotionValue(0)
  const mouseY   = useMotionValue(0)
  const rotation = useMotionValue(0)

  const x = useSpring(mouseX,   SPRING)
  const y = useSpring(mouseY,   SPRING)
  const r = useSpring(rotation, ROT_SPRING)

  const prev = useRef({ x: 0, y: 0 })

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
      if (speed > 0.5) {
        rotation.set(Math.max(-18, Math.min(18, dx * 1.8)))
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
    const t = setInterval(() => setIconIdx(i => (i + 1) % ICON_SETS[iconSet].length), 3000)
    return () => clearInterval(t)
  }, [iconSet])

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

  const icons = ICON_SETS[iconSet]
  const safeIdx = iconIdx % icons.length

  return (
    <motion.div
      className="smooth-cursor"
      style={{ x, y, rotate: r, opacity: entered ? 1 : 0 }}
    >
      <AnimatePresence>
        <motion.div
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }}
          initial={{ scale: 0, opacity: 0, rotate: -20 }}
          key={icons[safeIdx].id}
          style={{ position: 'absolute', top: 0, left: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 18 }}
        >
          {icons[safeIdx].element}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
