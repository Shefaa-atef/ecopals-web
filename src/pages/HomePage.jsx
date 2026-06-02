import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { heroState } from './heroState'
import { useLang } from '../context/LanguageContext'
import { playMenuSound } from '../utils/menuAudio'
import HeroPhoneScene from './HeroPhoneScene'
import raUrl from '../assets/ra.png'
import sh1Url from '../assets/sh1.png'
import sh2Url from '../assets/sh2.png'
import suUrl from '../assets/su.png'
import waUrl from '../assets/wa.png'
import catUrl from '../assets/cat.png'
import duckUrl from '../assets/duck.png'
import googlePlayUrl from '../assets/google-play-svgrepo-com.svg'
import HeroParticles from '../components/HeroParticles'
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
  const [isSoundMuted, setIsSoundMuted] = useState(heroState.soundMuted)
  const flashTimer = useRef(null)
  const { lang, isAr } = useLang()
  const soundCue = soundFlash ?? (isSoundMuted ? 'muted' : null)

  function showSoundFlash(nextFlash) {
    clearTimeout(flashTimer.current)
    setSoundFlash(nextFlash)
    flashTimer.current = setTimeout(() => setSoundFlash(null), 600)
  }

  useEffect(() => {
    const section = document.getElementById('home')
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!heroState.videoRef) return
        if (entry.isIntersecting) {
          heroState.videoRef.muted = heroState.soundMuted
          heroState.videoRef.play().catch(() => {
            heroState.videoRef.muted = true
            heroState.videoRef.defaultMuted = true
            heroState.videoRef.setAttribute('muted', '')
            heroState.soundMuted = true
            setIsSoundMuted(true)
          })
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
    const video = heroState.videoRef
    const nowMuted = !video.muted

    video.muted = nowMuted
    video.defaultMuted = nowMuted
    if (nowMuted) {
      video.setAttribute('muted', '')
    } else {
      video.removeAttribute('muted')
    }
    heroState.soundMuted = nowMuted
    setIsSoundMuted(nowMuted)

    if (!nowMuted) {
      video.play().then(() => {
        showSoundFlash('on')
      }).catch(() => {
        video.muted = true
        video.defaultMuted = true
        video.setAttribute('muted', '')
        heroState.soundMuted = true
        setIsSoundMuted(true)
        showSoundFlash('muted')
      })
      return
    }

    showSoundFlash('muted')
  }

  function handlePhoneKeyDown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    handlePhoneClick()
  }

  return (
    <>
      <section className="home-stage ecopals-hero" id="home" aria-label="EcoPals game hero">
        <HeroParticles />

        <motion.div
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          aria-hidden="true"
          className="ecopals-hero-word"
          initial={{ opacity: 0, scale: 1.22, filter: 'blur(18px)' }}
          transformTemplate={() => `translateX(-50%)`}
          transition={{ delay: 0, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={lang}
              className={isAr ? 'hero-word--ar' : undefined}
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: isAr ? -22 : 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              style={{ display: 'block' }}
            >
              {isAr ? 'إيكوبالز' : 'EcoPals'}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <div className="hero-poster">
          <div
            aria-label={isSoundMuted ? 'Turn video sound on' : 'Mute video sound'}
            aria-pressed={!isSoundMuted}
            className="hero-phone"
            onClick={handlePhoneClick}
            onKeyDown={handlePhoneKeyDown}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            {soundCue && (
              <div
                aria-hidden="true"
                className={`phone-sound-flash phone-sound-flash--${soundCue} ${soundFlash ? '' : 'phone-sound-prompt'}`}
                key={soundFlash ? soundFlash + Date.now() : 'sound-prompt'}
              >
                {soundCue === 'on' ? (
                  <svg viewBox="0 0 24 24" fill="#1e3a1e" width="36" height="36"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="#1e3a1e" width="36" height="36"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                )}
              </div>
            )}
            <motion.div
              animate={{
                opacity: 1,
                y: [0, -5, 0],
                rotate: [0, -0.15, 0.15, 0],
              }}
              className="hero-phone-motion"
              initial={{ opacity: 0 }}
              transition={{
                opacity: { delay: 0.55, duration: 0.6, ease: 'easeOut' },
                y: { delay: 1.2, duration: 7.2, ease: 'easeInOut', repeat: Infinity },
                rotate: { delay: 1.2, duration: 7.2, ease: 'easeInOut', repeat: Infinity },
              }}
            >
              <HeroPhoneScene />
            </motion.div>
          </div>

          {/* wrapper owns position so motion.a can animate freely */}
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            className="hero-google-play-wrap"
            initial={{ opacity: 0, scale: 0.5, y: 24, rotate: -4 }}
            transformTemplate={({ y }) => `translateX(-50%) translateY(${y ?? '0px'})`}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 2.4 }}
          >
            <motion.a
              aria-label={isAr ? 'افتح إيكوبالز على جوجل بلاي' : 'Open EcoPals on Google Play'}
              className={`hero-google-play ${isAr ? 'hero-google-play--ar' : ''}`}
              href="https://play.google.com/store/apps/details?id=com.ecopals"
              rel="noopener noreferrer"
              target="_blank"
              onMouseEnter={() => playMenuSound('hover')}
              onFocus={() => playMenuSound('hover')}
              whileHover={{
                y: -4,
                scale: 1.04,
                rotate: -0.8,
                transition: { type: 'spring', stiffness: 420, damping: 18 },
              }}
              whileTap={{ scale: 0.95, y: 1 }}
            >
              <img className="hero-google-play-icon" src={googlePlayUrl} alt={isAr ? 'جوجل بلاي' : 'Google Play'} />
              <span className={`hero-google-play-text ${isAr ? 'hero-google-play-text--ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
                <small>{isAr ? 'متوفر على' : 'GET IT ON'}</small>
                <strong>{isAr ? 'جوجل بلاي' : 'Google Play'}</strong>
              </span>
            </motion.a>
          </motion.div>

          {heroCharacters.map((character, i) => (
            <motion.img
              alt={character.alt}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              className={`hero-character ${character.className}`}
              draggable="false"
              initial={{ opacity: 0, y: 90, scale: 0.6, rotate: i % 2 === 0 ? -14 : 14 }}
              key={character.key}
              src={character.src}
              style={{ originX: 0.5, originY: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 18,
                mass: 0.7,
                delay: 1.1 + Math.floor(i / 2) * 0.38,
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
