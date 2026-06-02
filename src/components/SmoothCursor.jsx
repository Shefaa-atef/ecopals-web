import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import './SmoothCursor.css'

const SPRING     = { damping: 45, stiffness: 400, mass: 1,   restDelta: 0.001 }
const ROT_SPRING = { damping: 22, stiffness: 220, mass: 0.7 }

const ICONS = [
  {
    id: 'leaf',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path
          d="M9 35 C9 35 11 21 23 13 C35 5 39 7 39 7 C39 7 37 21 25 29 C13 37 9 35 9 35Z"
          fill="#7fb366"
          stroke="#3b2f27"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M9 35 L23 21" stroke="#3b2f27" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'drop',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path
          d="M22 5 C22 5 8 22 8 29 C8 37 14.4 41 22 41 C29.6 41 36 37 36 29 C36 22 22 5 22 5Z"
          fill="#5bbbe8"
          stroke="#3b2f27"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M16 30 C16 25.5 18.5 23 22 23" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
  },
  {
    id: 'star',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path
          d="M22 5 L26.5 16.5 L39 16.5 L29 24 L32.5 36 L22 28.5 L11.5 36 L15 24 L5 16.5 L17.5 16.5 Z"
          fill="#f4c542"
          stroke="#3b2f27"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'flower',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <ellipse cx="22" cy="13" rx="6"  ry="9"   fill="#a88fe8" stroke="#3b2f27" strokeWidth="1.5"/>
        <ellipse cx="22" cy="31" rx="6"  ry="9"   fill="#a88fe8" stroke="#3b2f27" strokeWidth="1.5"/>
        <ellipse cx="13" cy="22" rx="9"  ry="6"   fill="#a88fe8" stroke="#3b2f27" strokeWidth="1.5"/>
        <ellipse cx="31" cy="22" rx="9"  ry="6"   fill="#a88fe8" stroke="#3b2f27" strokeWidth="1.5"/>
        <circle  cx="22" cy="22" r="7.5"          fill="#f4c542" stroke="#3b2f27" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: 'sun',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="9" fill="#f4c542" stroke="#3b2f27" strokeWidth="2"/>
        {[0,45,90,135,180,225,270,315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180
          const x1 = 22 + 13 * Math.cos(rad)
          const y1 = 22 + 13 * Math.sin(rad)
          const x2 = 22 + 18 * Math.cos(rad)
          const y2 = 22 + 18 * Math.sin(rad)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3b2f27" strokeWidth="2.2" strokeLinecap="round"/>
        })}
      </svg>
    ),
  },
  {
    id: 'butterfly',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M22 22 C18 14 6 10 7 18 C8 26 18 26 22 22Z" fill="#f4a0c8" stroke="#3b2f27" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M22 22 C26 14 38 10 37 18 C36 26 26 26 22 22Z" fill="#f4a0c8" stroke="#3b2f27" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M22 22 C19 28 10 30 11 36 C12 40 20 36 22 22Z" fill="#c87ee0" stroke="#3b2f27" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M22 22 C25 28 34 30 33 36 C32 40 24 36 22 22Z" fill="#c87ee0" stroke="#3b2f27" strokeWidth="1.5" strokeLinejoin="round"/>
        <line x1="22" y1="10" x2="18" y2="6" stroke="#3b2f27" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="22" y1="10" x2="26" y2="6" stroke="#3b2f27" strokeWidth="1.5" strokeLinecap="round"/>
        <ellipse cx="22" cy="21" rx="2" ry="11" fill="#3b2f27"/>
      </svg>
    ),
  },
  {
    id: 'cloud',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M10 30 C6 30 4 27 4 24 C4 21 6.5 18.5 10 18.5 C10 14 13.5 11 18 11 C21 11 23.5 12.5 25 15 C26 14.5 27.2 14.2 28.5 14.2 C32.6 14.2 36 17.4 36 21.3 C38 22 40 24 40 26.5 C40 29 37.5 31 34.5 31 Z" fill="#d0eeff" stroke="#3b2f27" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'heart',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M22 37 C22 37 5 26 5 15.5 C5 10.5 9 7 13.5 7 C17 7 20 9 22 12 C24 9 27 7 30.5 7 C35 7 39 10.5 39 15.5 C39 26 22 37 22 37Z" fill="#f4607a" stroke="#3b2f27" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M14 15 C14 13 16 11.5 18 12" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
  },
  {
    id: 'sprout',
    element: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <line x1="22" y1="38" x2="22" y2="18" stroke="#3b2f27" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M22 26 C22 26 14 24 12 16 C12 16 20 13 26 18 C28 20 27 24 22 26Z" fill="#7fb366" stroke="#3b2f27" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M22 20 C22 20 28 16 36 18 C36 18 35 26 28 27 C24 27.5 22 24 22 20Z" fill="#a0cc7a" stroke="#3b2f27" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function SmoothCursor() {
  const [active, setActive]   = useState(false)
  const [entered, setEntered] = useState(false)
  const [iconIdx, setIconIdx] = useState(0)

  const mouseX   = useMotionValue(0)
  const mouseY   = useMotionValue(0)
  const rotation = useMotionValue(0)

  const x = useSpring(mouseX,   SPRING)
  const y = useSpring(mouseY,   SPRING)
  const r = useSpring(rotation, ROT_SPRING)

  const prev = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setActive(true)

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
    return () => window.removeEventListener('pointermove', onMove)
  }, []) // eslint-disable-line

  useEffect(() => {
    const t = setInterval(() => setIconIdx(i => (i + 1) % ICONS.length), 3000)
    return () => clearInterval(t)
  }, [])

  if (!active) return null

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
          key={ICONS[iconIdx].id}
          style={{ position: 'absolute', top: 0, left: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 18 }}
        >
          {ICONS[iconIdx].element}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
