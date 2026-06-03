import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
import CommunityFloatingPosts from '../components/CommunityFloatingPosts'
import './HomePage.css'

gsap.registerPlugin(ScrollTrigger)
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
  const heroTitle = isAr ? 'إيكوبالز' : 'EcoPals'
  const aboutStickyRef = useRef(null)
  const aboutBandRef = useRef(null)
  const communitySectionRef = useRef(null)
  const earthieSectionRef = useRef(null)
  const [earthieEnergy, setEarthieEnergy] = useState(0)

  useGSAP(() => {
    const sticky = aboutStickyRef.current
    const community = communitySectionRef.current
    const earthie = earthieSectionRef.current
    if (!sticky) return

    ScrollTrigger.create({
      trigger: sticky,
      start: 'top top',
      end: '+=260%',
      pin: true,
      pinSpacing: true,
      onUpdate: ({ progress }) => {
        setEarthieEnergy(Math.min(progress * 100, 100))
      },
    })

    if (community) {
      gsap.fromTo(
        community,
        { '--community-merge-scale': 1 },
        {
          '--community-merge-scale': 0,
          ease: 'none',
          immediateRender: true,
          scrollTrigger: {
            trigger: community,
            start: 'top bottom',
            end: 'top top',
            invalidateOnRefresh: true,
            scrub: true,
          },
        },
      )
    }

    const rootStyle = getComputedStyle(document.documentElement)
    const readPastel = (name) => rootStyle.getPropertyValue(name).trim()
    const pastelMerges = [
      {
        element: earthie,
        from: readPastel('--pastel-community-bg'),
        to: readPastel('--pastel-earthie-bg'),
      },
    ]

    pastelMerges.forEach(({ element, from, to }) => {
      if (!element || !from || !to) return

      gsap.fromTo(
        element,
        { backgroundColor: from },
        {
          backgroundColor: to,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'top top',
            invalidateOnRefresh: true,
            scrub: 0.45,
          },
        },
      )
    })
  }, [])

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

      {/* ── Wave divider: hero → about ── */}
      <div className="hero-about-divider" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 88" preserveAspectRatio="none">
          <path
            d="M0,0 L0,38 C240,78 480,84 720,50 C960,16 1200,74 1440,42 L1440,0 Z"
            fill="#5a913e"
          />
          <path
            d="M0,38 C240,78 480,84 720,50 C960,16 1200,74 1440,42"
            fill="none"
            stroke="#3b2f27"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <section className="home-band home-band-about" id="game" aria-label="EcoPals app description" ref={aboutBandRef}>
        <div className="about-sticky" ref={aboutStickyRef}>
          <div className="about-background-word" aria-hidden="true">EcoPals</div>
          <div className="about-deco-ring" aria-hidden="true" />
          <div className="about-stage">
            <div
              aria-hidden="true"
              className="about-phone-anchor phone-scene-anchor"
              data-phone-content="app-description"
              data-phone-float-amount="0"
              data-phone-orientation="landscape"
              data-phone-scale="2.12"
            />
            <EarthieShowcase isAr={isAr} energy={earthieEnergy} />
          </div>
        </div>
      </section>

      <section className={`home-band-community ${isAr ? 'home-band-community--ar' : ''}`} id="community" aria-labelledby="community-title" ref={communitySectionRef}>
        <CommunityFloatingPosts isAr={isAr} />

        <div className="community-layout">
          <div className={`community-copy ${isAr ? 'community-copy--ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
            <p className="community-kicker">{isAr ? 'مجتمع إيكوبالز' : 'EcoPals community'}</p>
            <h2 className="community-heading" id="community-title">
              {isAr ? (
                <><span>شارك</span><span>أنجز</span><span>ألهم</span></>
              ) : (
                <><span>Post.</span><span>Report.</span><span>Inspire.</span></>
              )}
            </h2>
            <p className="community-body">
              {isAr
                ? 'شوف أفعال الأصدقاء وتحدياتهم وتعليقاتهم وهي تتحول إلى أثر واضح داخل إيكوبالز.'
                : 'A live feed of eco actions, local challenges, comments, and progress from people making the planet a little brighter.'}
            </p>
          </div>

          <div className="community-phone-zone" aria-hidden="true">
            <div
              className="community-phone-anchor phone-scene-anchor"
              data-phone-content={isAr ? 'community-ar' : 'community-en'}
              data-phone-float-amount="0"
              data-phone-orientation="portrait"
              data-phone-rotate="-2"
              data-phone-scale="1.18"
            />
          </div>
        </div>
      </section>

      <section className="home-band home-band-earthie" id="earthie" ref={earthieSectionRef}>
        <p className="eyebrow">Earthie</p>
        <h2>Your cheerful eco companion.</h2>
      </section>
    </>
  )
}
