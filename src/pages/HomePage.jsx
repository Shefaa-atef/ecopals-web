import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { heroState } from './heroState'
import HeroPhoneScene from './HeroPhoneScene'
import raUrl from '../assets/ra.png'
import sh1Url from '../assets/sh1.png'
import sh2Url from '../assets/sh2.png'
import suUrl from '../assets/su.png'
import waUrl from '../assets/wa.png'
import catUrl from '../assets/cat.png'
import duckUrl from '../assets/duck.png'
import googlePlayUrl from '../assets/google-play-svgrepo-com.svg'
import './HomePage.css'

const heroCharacters = [
  { key: 'sh2', src: sh2Url, alt: 'EcoPals character holding a plant', className: 'hero-character-sh2' },
  { key: 'ra', src: raUrl, alt: 'EcoPals character in a beige dress', className: 'hero-character-ra' },
  { key: 'sh1', src: sh1Url, alt: 'EcoPals character in a lavender outfit', className: 'hero-character-sh1' },
  { key: 'su', src: suUrl, alt: 'EcoPals character holding flowers', className: 'hero-character-su' },
  { key: 'wa', src: waUrl, alt: 'EcoPals character making a heart gesture', className: 'hero-character-wa' },
  { key: 'cat', src: catUrl, alt: 'Cat companion', className: 'hero-character-cat' },
  { key: 'duck', src: duckUrl, alt: 'Duck companion', className: 'hero-character-duck' },
]

export default function HomePage() {
  const [soundFlash, setSoundFlash] = useState(null)
  const flashTimer = useRef(null)

  useEffect(() => {
    const section = document.getElementById('home')
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!heroState.videoRef) return
        if (entry.isIntersecting) {
          heroState.videoRef.muted = heroState.soundMuted
          heroState.videoRef.play().catch(() => {})
        } else {
          heroState.videoRef.muted = true
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  function handlePhoneClick() {
    if (!heroState.videoRef) return
    const nowMuted = !heroState.videoRef.muted
    heroState.videoRef.muted = nowMuted
    heroState.soundMuted = nowMuted
    if (!nowMuted) {
      heroState.videoRef.play().catch(() => {
        heroState.videoRef.muted = true
        heroState.soundMuted = true
      })
    }
    clearTimeout(flashTimer.current)
    setSoundFlash(nowMuted ? 'muted' : 'on')
    flashTimer.current = setTimeout(() => setSoundFlash(null), 600)
  }

  return (
    <>
      <section className="home-stage ecopals-hero" id="home" aria-label="EcoPals game hero">

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          aria-hidden="true"
          className="ecopals-hero-word"
          initial={{ opacity: 0, y: 22 }}
          transformTemplate={({ y }) => `translateX(-50%) translateY(${y})`}
          transition={{ delay: 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          EcoPals
        </motion.div>

        <div className="hero-poster">
          <div
            aria-hidden="true"
            className="hero-phone"
            onClick={handlePhoneClick}
            style={{ cursor: 'pointer' }}
          >
            {soundFlash && (
              <div className={`phone-sound-flash phone-sound-flash--${soundFlash}`} key={soundFlash + Date.now()}>
                {soundFlash === 'on' ? (
                  <svg viewBox="0 0 24 24" fill="#1e3a1e" width="36" height="36"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="#1e3a1e" width="36" height="36"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                )}
              </div>
            )}
            {/* opacity-only entrance so the Canvas always has correct dimensions */}
            <motion.div
              animate={{
                opacity: 1,
                y: [0, -5, 0],
                rotate: [0, -0.15, 0.15, 0],
              }}
              className="hero-phone-motion"
              initial={{ opacity: 0 }}
              transition={{
                opacity: { delay: 0.35, duration: 0.6, ease: 'easeOut' },
                y: { delay: 0.35, duration: 7.2, ease: 'easeInOut', repeat: Infinity },
                rotate: { delay: 0.35, duration: 7.2, ease: 'easeInOut', repeat: Infinity },
              }}
            >
              <HeroPhoneScene />
            </motion.div>
          </div>

          {/* wrapper owns position so motion.a can animate freely */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="hero-google-play-wrap"
            initial={{ opacity: 0, y: 10 }}
            transformTemplate={({ y }) => `translateX(-50%) translateY(${y ?? '0px'})`}
            transition={{ delay: 0.5, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.a
              className="hero-google-play"
              href="https://play.google.com/store/apps/details?id=com.ecopals"
              rel="noopener noreferrer"
              target="_blank"
              whileHover={{
                y: -4,
                scale: 1.04,
                rotate: -0.8,
                transition: { type: 'spring', stiffness: 420, damping: 18 },
              }}
              whileTap={{ scale: 0.95, y: 1 }}
            >
              <img className="hero-google-play-icon" src={googlePlayUrl} alt="Google Play" />
              <span className="hero-google-play-text">
                <small>GET IT ON</small>
                <strong>Google Play</strong>
              </span>
            </motion.a>
          </motion.div>

          {heroCharacters.map((character, i) => (
            <motion.img
              alt={character.alt}
              animate={{ opacity: 1, y: 0 }}
              className={`hero-character ${character.className}`}
              draggable="false"
              initial={{ opacity: 0, y: 18 }}
              key={character.key}
              src={character.src}
              style={{ originX: 0.5, originY: 1 }}
              transition={{
                delay: 0.62 + i * 0.1,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -14,
                scale: 1.07,
                rotate: i % 2 === 0 ? -2.5 : 2.5,
                transition: { type: 'spring', stiffness: 380, damping: 16 },
              }}
              whileTap={{ scale: 0.95, y: -4 }}
            />
          ))}
        </div>
      </section>

      <section className="home-band home-band-game" id="game">
        <p className="eyebrow">Game loop</p>
        <h2>Grow the world.</h2>
      </section>

      <section className="home-band home-band-challenges" id="challenges">
        <p className="eyebrow">Challenges</p>
        <h2>Plants, water, animals, energy, air, and community.</h2>
      </section>

      <section className="home-band home-band-earthie" id="earthie">
        <p className="eyebrow">Earthie</p>
        <h2>Your cheerful eco companion.</h2>
      </section>
    </>
  )
}
