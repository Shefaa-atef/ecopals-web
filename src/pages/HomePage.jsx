import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { playMenuSound } from '../utils/menuAudio'
import PhoneScrollStage from './PhoneScrollStage'
import raUrl from '../assets/ra.png'
import sh1Url from '../assets/sh1.png'
import sh2Url from '../assets/sh2.png'
import suUrl from '../assets/su.png'
import waUrl from '../assets/wa.png'
import catUrl from '../assets/cat.png'
import duckUrl from '../assets/duck.png'
import googlePlayUrl from '../assets/google-play-svgrepo-com.svg'
import EarthieShowcase from '../components/EarthieShowcase'
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
  const { lang, isAr } = useLang()
  const heroTitle = isAr ? '\u0625\u064a\u0643\u0648\u0628\u0627\u0644\u0632' : 'EcoPals'

  return (
    <>
      <PhoneScrollStage />

      <section className="home-stage ecopals-hero" id="home" aria-label="EcoPals game hero">
        <HeroParticles />

        <motion.div
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          aria-hidden="true"
          className="ecopals-hero-word"
          initial={{ opacity: 0, scale: 1.22, filter: 'blur(18px)' }}
          transformTemplate={() => 'translateX(-50%)'}
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
              {heroTitle}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <div className="hero-poster">
          <div
            aria-hidden="true"
            className="hero-phone-slot phone-scene-anchor"
            data-phone-content="earthie-video"
            data-phone-orientation="landscape"
          />

          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            className="hero-google-play-wrap"
            initial={{ opacity: 0, scale: 0.5, y: 24, rotate: -4 }}
            transformTemplate={({ y }) => `translateX(-50%) translateY(${y ?? '0px'})`}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 2.4 }}
          >
            <motion.a
              aria-label={isAr ? '\u0627\u0641\u062a\u062d \u0625\u064a\u0643\u0648\u0628\u0627\u0644\u0632 \u0639\u0644\u0649 \u062c\u0648\u062c\u0644 \u0628\u0644\u0627\u064a' : 'Open EcoPals on Google Play'}
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
              <img className="hero-google-play-icon" src={googlePlayUrl} alt={isAr ? '\u062c\u0648\u062c\u0644 \u0628\u0644\u0627\u064a' : 'Google Play'} />
              <span className={`hero-google-play-text ${isAr ? 'hero-google-play-text--ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
                <small>{isAr ? '\u0645\u062a\u0648\u0641\u0631 \u0639\u0644\u0649' : 'GET IT ON'}</small>
                <strong>{isAr ? '\u062c\u0648\u062c\u0644 \u0628\u0644\u0627\u064a' : 'Google Play'}</strong>
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

      <section className="home-band home-band-about" id="game" aria-label="EcoPals app description">
        <div className="about-background-word" aria-hidden="true">EcoPals</div>
        <div className="about-stage">
          <div
            aria-hidden="true"
            className="about-phone-anchor phone-scene-anchor"
            data-phone-content="app-description"
            data-phone-float-amount="0"
            data-phone-orientation="landscape"
            data-phone-scale="2.12"
          />
          <EarthieShowcase isAr={isAr} sectionId="game" />
        </div>
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
