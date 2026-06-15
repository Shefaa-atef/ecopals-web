import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import logoUrl from '../assets/logo@4x.png'
import './LoadingScreen.css'

function LeafSvg({ fill }) {
  return (
    <svg viewBox="0 0 20 28" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 1 C18 6 19 18 10 27 C1 18 2 6 10 1 Z" fill={fill} />
      <path d="M10 27 Q10.6 17 10 3" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  )
}

export default function LoadingScreen({ onDone }) {
  const { isAr } = useLang()

  useEffect(() => {
    const t = setTimeout(onDone, 2400)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="loading-screen"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Floating eco particles */}
      <div className="loading-particles" aria-hidden="true">
        <span className="loading-leaf loading-leaf--1"><LeafSvg fill="rgb(105 185 95 / 0.9)" /></span>
        <span className="loading-leaf loading-leaf--2"><LeafSvg fill="rgb(105 185 95 / 0.9)" /></span>
        <span className="loading-leaf loading-leaf--3"><LeafSvg fill="rgb(47 111 62 / 0.88)" /></span>
        <span className="loading-leaf loading-leaf--4"><LeafSvg fill="rgb(105 185 95 / 0.9)" /></span>
        <span className="loading-leaf loading-leaf--5"><LeafSvg fill="rgb(105 185 95 / 0.9)" /></span>
        <span className="loading-leaf loading-leaf--6"><LeafSvg fill="rgb(90 158 90 / 0.85)" /></span>
        <span className="loading-star loading-star--1" />
        <span className="loading-star loading-star--2" />
        <span className="loading-star loading-star--3" />
        <span className="loading-star loading-star--4" />
        <span className="loading-drop loading-drop--1" />
        <span className="loading-drop loading-drop--2" />
      </div>

      <div className="loading-center">
        <div className="loading-logo-wrap">
          <span className="loading-ring loading-ring--1" />
          <span className="loading-ring loading-ring--2" />
          <span className="loading-ring loading-ring--3" />

          <motion.img
            src={logoUrl}
            alt=""
            className="loading-logo"
            initial={{ scale: 0.3, y: -40, opacity: 0, rotate: -22 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 0.06 }}
          />
        </div>

        <motion.p
          className={`loading-name${isAr ? ' loading-name--ar' : ''}`}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {isAr ? 'إيكوبالز' : 'Ecopals'}
        </motion.p>

        <motion.div
          className="loading-dots"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <span />
          <span />
          <span />
        </motion.div>
      </div>
    </motion.div>
  )
}
