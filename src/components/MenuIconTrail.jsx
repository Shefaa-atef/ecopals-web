import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ICON_SETS } from './smoothCursorIcons'
import './MenuIconTrail.css'

const TRAIL_SPACING = 28
const MAX_DROPS = 36
const DROP_DURATION = 1.05

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

export default function MenuIconTrail() {
  const icons = useMemo(() => ICON_SETS.flat(), [])
  const [drops, setDrops] = useState([])
  const lastPointRef = useRef(null)
  const lastIconIndexRef = useRef(-1)
  const idRef = useRef(0)

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: fine)')
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!pointerQuery.matches || reduceMotionQuery.matches || icons.length === 0) return undefined

    function getNextIcon() {
      let nextIndex = Math.floor(Math.random() * icons.length)
      if (icons.length > 1 && nextIndex === lastIconIndexRef.current) {
        nextIndex = (nextIndex + 1 + Math.floor(Math.random() * (icons.length - 1))) % icons.length
      }

      lastIconIndexRef.current = nextIndex
      const icon = icons[nextIndex]
      return icon
    }

    function createDrop(x, y) {
      return {
        id: idRef.current++,
        icon: getNextIcon(),
        x,
        y,
        driftX: randomBetween(-22, 22),
        dropY: randomBetween(112, 190),
        rotateStart: randomBetween(-14, 14),
        rotateEnd: randomBetween(-86, 86),
        size: randomBetween(24, 34),
      }
    }

    function handlePointerMove(event) {
      if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return

      const lastPoint = lastPointRef.current
      const dx = lastPoint ? event.clientX - lastPoint.x : 0
      const dy = lastPoint ? event.clientY - lastPoint.y : 0
      const distance = Math.hypot(dx, dy)

      if (lastPoint && distance < TRAIL_SPACING) return

      const originX = lastPoint && distance > 0 ? event.clientX - (dx / distance) * 10 : event.clientX
      const originY = lastPoint && distance > 0 ? event.clientY - (dy / distance) * 10 : event.clientY
      lastPointRef.current = { x: event.clientX, y: event.clientY }

      setDrops((currentDrops) => [...currentDrops, createDrop(originX, originY)].slice(-MAX_DROPS))
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [icons])

  function removeDrop(dropId) {
    setDrops((currentDrops) => currentDrops.filter((drop) => drop.id !== dropId))
  }

  return (
    <div className="menu-icon-trail" aria-hidden="true">
      <AnimatePresence initial={false}>
        {drops.map((drop) => (
          <motion.span
            animate={{
              opacity: [0.18, 1, 0.92, 0.18],
              rotate: [drop.rotateStart, drop.rotateStart * 0.45, drop.rotateEnd],
              scale: [0.62, 1, 0.82],
              x: [0, drop.driftX * 0.24, drop.driftX],
              y: [0, 28, drop.dropY],
            }}
            className="menu-icon-trail__drop"
            exit={{ opacity: 0, scale: 0.2, transition: { duration: 0.14 } }}
            initial={{
              opacity: 0,
              rotate: drop.rotateStart,
              scale: 0.45,
              x: 0,
              y: 0,
            }}
            key={drop.id}
            onAnimationComplete={() => removeDrop(drop.id)}
            style={{
              height: drop.size,
              left: drop.x,
              marginLeft: drop.size / -2,
              marginTop: drop.size / -2,
              top: drop.y,
              width: drop.size,
            }}
            transition={{
              duration: DROP_DURATION,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.16, 0.78, 1],
            }}
          >
            {drop.icon.element}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
