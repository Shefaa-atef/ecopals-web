import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import logoUrl from '../assets/logo@4x.png'
import './LoadingScreen.css'

export default function LoadingScreen({ onDone }) {
  const { isAr } = useLang()

  useEffect(() => {
    const t = setTimeout(onDone, 2200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      className="loading-screen"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="loading-center">
        <div className="loading-logo-wrap">
          <span className="loading-ring loading-ring--1" />
          <span className="loading-ring loading-ring--2" />
          <span className="loading-ring loading-ring--3" />

          <motion.img
            src={logoUrl}
            alt=""
            className="loading-logo"
            initial={{ scale: 0.4, y: -50, opacity: 0, rotate: -18 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.08 }}
          />
        </div>


        <motion.p
          className={`loading-name${isAr ? ' loading-name--ar' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {isAr ? 'إيكوبالز' : 'Ecopals'}
        </motion.p>
      </div>
    </motion.div>
  )
}
