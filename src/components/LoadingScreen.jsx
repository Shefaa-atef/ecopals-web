import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import logoUrl from '../assets/logo@4x.png'
import './LoadingScreen.css'

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
        <span className="loading-leaf loading-leaf--1" />
        <span className="loading-leaf loading-leaf--2" />
        <span className="loading-leaf loading-leaf--3" />
        <span className="loading-leaf loading-leaf--4" />
        <span className="loading-leaf loading-leaf--5" />
        <span className="loading-leaf loading-leaf--6" />
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
