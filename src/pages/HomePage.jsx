import { useEffect, useRef, useState } from 'react'
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
import ch1Url from '../assets/ch1.png'
import ch2Url from '../assets/ch2.png'
import ch3Url from '../assets/ch3.png'
import ch4Url from '../assets/ch4.png'
import ch5Url from '../assets/ch5.png'
import ch6Url from '../assets/ch6.png'
import ch7Url from '../assets/ch7.png'
import ch9Url from '../assets/ch9.png'
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

const challengePlanes = [
  [
    { key: 'plant-care', src: ch1Url, className: 'challenge-photo--one', alt: 'EcoPals plant care challenge artwork' },
    { key: 'watering', src: ch2Url, className: 'challenge-photo--two', alt: 'EcoPals watering challenge artwork' },
    { key: 'recycling', src: ch9Url, className: 'challenge-photo--three', alt: 'EcoPals recycling challenge artwork' },
  ],
  [
    { key: 'cleanup', src: ch3Url, className: 'challenge-photo--four', alt: 'EcoPals clean up challenge artwork' },
    { key: 'energy', src: ch4Url, className: 'challenge-photo--five', alt: 'EcoPals eco action challenge artwork' },
    { key: 'garden', src: ch5Url, className: 'challenge-photo--six', alt: 'EcoPals garden challenge artwork' },
  ],
  [
    { key: 'water-save', src: ch6Url, className: 'challenge-photo--seven', alt: 'EcoPals water saving challenge artwork' },
    { key: 'daily-streak', src: ch7Url, className: 'challenge-photo--eight', alt: 'EcoPals daily challenge artwork' },
  ],
]

const challengeCopy = {
  en: {
    kicker: 'Eco challenges',
    title: 'Complete challenges. Earn coins.',
    body: 'Pick simple eco missions inside the app, finish real actions, and earn coins and points as your progress grows.',
  },
  ar: {
    kicker: 'التحديات البيئية',
    title: 'أنجز التحديات واجمع العملات',
    body: 'اختر تحديات بيئية بسيطة داخل التطبيق، أنجز أفعالاً حقيقية، واجمع العملات والنقاط مع تقدمك.',
  },
}

export default function HomePage() {
  const { lang, isAr } = useLang()
  const heroTitle = isAr ? 'إيكوبالز' : 'EcoPals'
  const aboutStickyRef = useRef(null)
  const aboutBandRef = useRef(null)
  const communitySectionRef = useRef(null)
  const challengesSectionRef = useRef(null)
  const challengePhoneAnchorRef = useRef(null)
  const challengePlaneRefs = useRef([])
  const [earthieEnergy, setEarthieEnergy] = useState(0)

  useGSAP(() => {
    const sticky = aboutStickyRef.current
    const community = communitySectionRef.current
    const challenges = challengesSectionRef.current
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
        element: challenges,
        from: readPastel('--pastel-community-bg'),
        to: readPastel('--light-cream'),
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

  useEffect(() => {
    const community = communitySectionRef.current
    if (!community) return undefined

    let settleTimeoutId = 0
    let releaseTimeoutId = 0
    let isSnapping = false
    let hasSettled = Math.abs(community.getBoundingClientRect().top) <= 2

    const scrollToCommunity = (behavior = 'smooth') => {
      const top = Math.max(0, Math.round(community.getBoundingClientRect().top + window.scrollY))
      window.scrollTo({ top, behavior })
    }

    const settleCommunityScroll = () => {
      if (window.location.hash && window.location.hash !== '#community') return

      window.clearTimeout(settleTimeoutId)

      settleTimeoutId = window.setTimeout(() => {
        const rect = community.getBoundingClientRect()
        const viewportHeight = window.innerHeight || 1
        const distanceFromTop = Math.abs(rect.top)

        if (rect.top > viewportHeight * 0.82 || rect.top < -viewportHeight * 0.7) {
          hasSettled = false
          return
        }

        if (distanceFromTop <= 2) {
          hasSettled = true
          return
        }

        if (isSnapping || hasSettled) return

        const isNearCommunityStart = rect.top <= viewportHeight * 0.72 && rect.top >= -viewportHeight * 0.34
        const isMostlyOnScreen = rect.bottom >= viewportHeight * 0.66

        if (!isNearCommunityStart || !isMostlyOnScreen) return

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        isSnapping = true
        hasSettled = true
        scrollToCommunity(prefersReducedMotion ? 'auto' : 'smooth')

        window.clearTimeout(releaseTimeoutId)
        releaseTimeoutId = window.setTimeout(() => {
          isSnapping = false

          if (Math.abs(community.getBoundingClientRect().top) > 2) {
            scrollToCommunity('auto')
          }
        }, prefersReducedMotion ? 80 : 900)
      }, 140)
    }

    window.addEventListener('scroll', settleCommunityScroll, { passive: true })
    window.addEventListener('resize', settleCommunityScroll)
    settleCommunityScroll()

    return () => {
      window.removeEventListener('scroll', settleCommunityScroll)
      window.removeEventListener('resize', settleCommunityScroll)
      window.clearTimeout(settleTimeoutId)
      window.clearTimeout(releaseTimeoutId)
    }
  }, [])

  useEffect(() => {
    const section = challengesSectionRef.current
    if (!section) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined

    const planes = challengePlaneRefs.current
    const phoneAnchor = challengePhoneAnchorRef.current
    let requestAnimationFrameId = 0
    const easing = 0.12
    const strengths = [1, 0.72, 0.48]
    const currentOffset = { x: 0, y: 0 }
    const targetOffset = { x: 0, y: 0 }
    const basePhoneRotation = {
      x: Math.PI / 2,
      y: 0,
      z: 0,
    }
    const currentPhoneRotation = { ...basePhoneRotation }
    const targetPhoneRotation = { ...basePhoneRotation }
    const localLerp = (start, target, amount) => start * (1 - amount) + target * amount

    const applyPhoneRotation = () => {
      if (!phoneAnchor) return false

      currentPhoneRotation.x = localLerp(currentPhoneRotation.x, targetPhoneRotation.x, 0.14)
      currentPhoneRotation.y = localLerp(currentPhoneRotation.y, targetPhoneRotation.y, 0.14)
      currentPhoneRotation.z = localLerp(currentPhoneRotation.z, targetPhoneRotation.z, 0.14)

      phoneAnchor.dataset.phoneRotationX = currentPhoneRotation.x.toFixed(4)
      phoneAnchor.dataset.phoneRotationY = currentPhoneRotation.y.toFixed(4)
      phoneAnchor.dataset.phoneRotationZ = currentPhoneRotation.z.toFixed(4)

      return Math.abs(currentPhoneRotation.x - targetPhoneRotation.x) > 0.001
        || Math.abs(currentPhoneRotation.y - targetPhoneRotation.y) > 0.001
        || Math.abs(currentPhoneRotation.z - targetPhoneRotation.z) > 0.001
    }

    const animatePlanes = () => {
      currentOffset.x = localLerp(currentOffset.x, targetOffset.x, easing)
      currentOffset.y = localLerp(currentOffset.y, targetOffset.y, easing)

      const shouldKeepRotatingPhone = applyPhoneRotation()
      const shouldKeepMoving = Math.abs(currentOffset.x - targetOffset.x) > 0.001
        || Math.abs(currentOffset.y - targetOffset.y) > 0.001

      planes.forEach((plane, index) => {
        if (!plane) return

        const strength = strengths[index] ?? 0.24
        gsap.set(plane, {
          x: currentOffset.x * 42 * strength,
          y: currentOffset.y * 26 * strength,
        })
      })

      if (phoneAnchor) {
        gsap.set(phoneAnchor, {
          x: currentOffset.x * 16,
          y: currentOffset.y * 10,
        })
        window.dispatchEvent(new Event('phone-route-refresh'))
      }

      if (shouldKeepMoving || shouldKeepRotatingPhone) {
        requestAnimationFrameId = window.requestAnimationFrame(animatePlanes)
        return
      }

      requestAnimationFrameId = 0
    }

    const handleMouseMove = (event) => {
      const rect = section.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return

      const pointerX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1))
      const pointerY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1))

      targetOffset.x = pointerX
      targetOffset.y = pointerY
      targetPhoneRotation.x = basePhoneRotation.x + pointerY * 0.075
      targetPhoneRotation.y = basePhoneRotation.y + pointerX * 0.18
      targetPhoneRotation.z = basePhoneRotation.z - pointerX * 0.045

      if (!requestAnimationFrameId) {
        requestAnimationFrameId = window.requestAnimationFrame(animatePlanes)
      }
    }

    const resetPointer = () => {
      targetOffset.x = 0
      targetOffset.y = 0
      targetPhoneRotation.x = basePhoneRotation.x
      targetPhoneRotation.y = basePhoneRotation.y
      targetPhoneRotation.z = basePhoneRotation.z

      if (!requestAnimationFrameId) {
        requestAnimationFrameId = window.requestAnimationFrame(animatePlanes)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    section.addEventListener('mouseleave', resetPointer)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      section.removeEventListener('mouseleave', resetPointer)

      if (requestAnimationFrameId) {
        window.cancelAnimationFrame(requestAnimationFrameId)
      }

      gsap.set([...planes.filter(Boolean), phoneAnchor].filter(Boolean), { clearProps: 'transform' })

      if (phoneAnchor) {
        phoneAnchor.dataset.phoneRotationX = basePhoneRotation.x.toFixed(4)
        phoneAnchor.dataset.phoneRotationY = basePhoneRotation.y.toFixed(4)
        phoneAnchor.dataset.phoneRotationZ = basePhoneRotation.z.toFixed(4)
        window.dispatchEvent(new Event('phone-route-refresh'))
      }
    }
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
            data-phone-depth-motion="1"
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
              onClick={() => playMenuSound('cta')}
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
              onMouseEnter={() => playMenuSound('character')}
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
          <div className="about-stage">
            <div
              aria-hidden="true"
              className="about-phone-anchor phone-scene-anchor"
              data-phone-content="app-description"
              data-phone-float-amount="0"
              data-phone-orientation="landscape"
              data-phone-scale="2.12"
            />
            <motion.div
              initial={{ opacity: 0, y: 52, scale: 0.93 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.18 }}
            >
              <EarthieShowcase isAr={isAr} energy={earthieEnergy} />
            </motion.div>
          </div>
        </div>
      </section>

      <section className={`home-band-community ${isAr ? 'home-band-community--ar' : ''}`} id="community" aria-labelledby="community-title" ref={communitySectionRef}>
        <CommunityFloatingPosts isAr={isAr} />

        <div className="community-layout">
          <div className={`community-copy ${isAr ? 'community-copy--ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
            <motion.p
              className="community-kicker"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            >{isAr ? 'مجتمع إيكوبالز' : 'EcoPals community'}</motion.p>
            <h2 className="community-heading" id="community-title">
              {(isAr
                ? ['شارك', 'أنجز', 'ألهم']
                : ['Post.', 'Report.', 'Inspire.']
              ).map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.08 + i * 0.1 }}
                >{word}</motion.span>
              ))}
            </h2>
            <motion.p
              className="community-body"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.32 }}
            >
              {isAr
                ? 'شوف أفعال الأصدقاء وتحدياتهم وتعليقاتهم وهي تتحول إلى أثر واضح داخل إيكوبالز.'
                : 'A live feed of eco actions, local challenges, comments, and progress from people making the planet a little brighter.'}
            </motion.p>
          </div>

          <motion.div
            className="community-phone-zone"
            aria-hidden="true"
            initial={{ opacity: 0, x: 80, scale: 0.92 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.2 }}
          >
            <div
              className="community-phone-anchor phone-scene-anchor"
              data-phone-content={isAr ? 'community-ar' : 'community-en'}
              data-phone-depth-motion="1"
              data-phone-float-amount="0"
              data-phone-orientation="portrait"
              data-phone-rotate="-2"
              data-phone-scale="1.18"
            />
          </motion.div>
        </div>
      </section>

      <section
        className={`home-band-challenges ${isAr ? 'home-band-challenges--ar' : ''}`}
        id="challenges"
        ref={challengesSectionRef}
      >
        <div className="challenges-shell">
          <motion.div
            className="challenges-copy"
            dir={isAr ? 'rtl' : 'ltr'}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <p className="challenges-kicker">{challengeCopy[isAr ? 'ar' : 'en'].kicker}</p>
            <h2>{challengeCopy[isAr ? 'ar' : 'en'].title}</h2>
            <p className="challenges-body">{challengeCopy[isAr ? 'ar' : 'en'].body}</p>
          </motion.div>

          <div className="challenges-stage" aria-hidden="true">
            {challengePlanes.map((plane, planeIndex) => (
              <div
                aria-hidden="true"
                className={`challenge-plane challenge-plane--${planeIndex + 1}`}
                key={`challenge-plane-${planeIndex}`}
                ref={(node) => {
                  challengePlaneRefs.current[planeIndex] = node
                }}
              >
                {plane.map((image) => (
                  <img
                    alt={image.alt}
                    className={`challenge-photo ${image.className}`}
                    draggable="false"
                    key={image.key}
                    src={image.src}
                  />
                ))}
              </div>
            ))}

            <div
              aria-hidden="true"
              className="challenges-phone-anchor phone-scene-anchor"
              data-phone-content={isAr ? 'challenges-ar' : 'challenges-en'}
              data-phone-depth-motion="1"
              data-phone-float-amount="0"
              data-phone-orientation="portrait"
              data-phone-rotate="-1.5"
              data-phone-scale="1.08"
              ref={challengePhoneAnchorRef}
            />
          </div>
        </div>
      </section>
    </>
  )
}
