import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { playMenuSound } from '../utils/menuAudio'
import PhoneScrollStage from './PhoneScrollStage'
import EarthieShowcase from '../components/EarthieShowcase'
import FunTitleReveal from '../components/FunTitleReveal'
import HeroParticles from '../components/HeroParticles'
import CommunityFloatingPosts from '../components/CommunityFloatingPosts'
import RecyclePortalSection from '../components/RecyclePortalSection'
import DressingGameSection from '../components/DressingGameSection'
import Match3Showcase from '../components/Match3Showcase'
import useChallengePointerParallax from './home/useChallengePointerParallax'
import useExactSectionScroll from './home/useExactSectionScroll'
import useHomeScrollAnimations from './home/useHomeScrollAnimations'
import {
  challengeCopy,
  challengePlanes,
  coinUrl,
  googlePlayUrl,
  heroCharacters,
  preparedSections,
} from './home/homePageData'
import './HomePage.css'

export default function HomePage() {
  const { lang, isAr } = useLang()
  const heroTitle = isAr ? 'إيكوبالز' : 'EcoPals'
  const aboutStickyRef = useRef(null)
  const aboutBandRef = useRef(null)
  const communitySectionRef = useRef(null)
  const challengesSectionRef = useRef(null)
  const challengePhoneAnchorRef = useRef(null)
  const challengePlaneRefs = useRef([])
  const photoCardRefs = useRef([])
  const coinRefs = useRef([])
  const scorePopContainerRef = useRef(null)
  const [earthieEnergy, setEarthieEnergy] = useState(0)

  useExactSectionScroll(communitySectionRef, 'community', '#game')
  useExactSectionScroll(challengesSectionRef, 'challenges', '#community')

  useHomeScrollAnimations({
    aboutBandRef,
    aboutStickyRef,
    challengesSectionRef,
    coinRefs,
    communitySectionRef,
    photoCardRefs,
    scorePopContainerRef,
    setEarthieEnergy,
  })
  useChallengePointerParallax({
    challengePhoneAnchorRef,
    challengePlaneRefs,
    challengesSectionRef,
  })
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
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >{isAr ? 'مجتمع إيكوبالز' : 'EcoPals community'}</motion.p>
            <h2 className="community-heading" id="community-title">
              {(isAr
                ? ['شارك', 'أنجز', 'ألهم']
                : ['Post.', 'Report.', 'Inspire.']
              ).map((word, i) => (
                <span
                  key={word}
                >
                  <FunTitleReveal text={word} delay={0.08 + i * 0.12} />
                </span>
              ))}
            </h2>
            <motion.p
              className="community-body"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1], delay: 0.34 }}
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
            <h2>
              <FunTitleReveal text={challengeCopy[isAr ? 'ar' : 'en'].title} delay={0.08} />
            </h2>
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
                {plane.map((image, imageIndex) => {
                  const flatIndex = challengePlanes.slice(0, planeIndex).reduce((sum, p) => sum + p.length, 0) + imageIndex
                  return (
                    <div
                      className={`challenge-photo ${image.className}`}
                      key={image.key}
                    >
                      <div
                        aria-hidden="true"
                        className="challenge-coin"
                        ref={(node) => { coinRefs.current[flatIndex] = node }}
                      >
                        <img alt="" draggable="false" src={coinUrl} />
                      </div>
                      <div
                        className="challenge-photo__card"
                        ref={(node) => { photoCardRefs.current[flatIndex] = node }}
                      >
                        <img
                          alt={image.alt}
                          className="challenge-photo__img"
                          draggable="false"
                          loading="lazy"
                          src={image.src}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}

            <div
              aria-hidden="true"
              className="challenges-score-pops"
              ref={scorePopContainerRef}
            />

            <div
              aria-hidden="true"
              className="challenges-phone-anchor phone-scene-anchor"
              data-phone-content={isAr ? 'challenges-ar' : 'challenges-en'}
              data-phone-depth-auto-motion="0"
              data-phone-depth-motion="1"
              data-phone-float-amount="0"
              data-phone-orientation="portrait"
              data-phone-rotate="0"
              data-phone-scale="1.16"
              ref={challengePhoneAnchorRef}
            />
          </div>
        </div>
      </section>

      {preparedSections.flatMap((section, sectionIndex) => {
        if (sectionIndex === 0) {
          // The shared PhoneScrollStage phone continues directly into Recycle & Earn.
          // A phone-scene-anchor inside RecyclePortalSection guides its position.
          return [
            <RecyclePortalSection key="recycle-portal" isAr={isAr} />,
          ]
        }

        if (section.key === 'match-3-game') {
          return [
            <EcoSectionDivider key="match-3-divider" variant="match3" />,
            (
              <section
                aria-label={isAr ? 'لعبة مطابقة 3' : 'Match 3 game'}
                className="home-match3-divider home-band-prep--match-3-game"
                id="match-3-game"
                key="match-3-game"
              >
                <Match3Showcase />
              </section>
            ),
          ]
        }

        if (section.key === 'clothing-game') {
          return [
            <DressingGameSection key="clothing-game" isAr={isAr} />,
          ]
        }

        return [(
          <section
            aria-labelledby={`${section.key}-title`}
            className={`home-band-prep home-band-prep--${section.key}`}
            id={section.key}
            key={section.key}
          >
            <motion.div
              className="prep-section-shell"
              dir={isAr ? 'rtl' : 'ltr'}
              initial={{ opacity: 0, y: 28 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              viewport={{ once: true, amount: 0.45 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <p className="prep-section-label">{section.label}</p>
              <p className="prep-section-kicker">{section.kicker[isAr ? 'ar' : 'en']}</p>
              <h2 id={`${section.key}-title`}>
                <FunTitleReveal text={section.title[isAr ? 'ar' : 'en']} delay={0.08} />
              </h2>
            </motion.div>
          </section>
        )]
      })}
    </>
  )
}

function EcoSectionDivider({ variant }) {
  return (
    <div className={`eco-section-divider eco-section-divider--${variant}`} aria-hidden="true" />
  )
}
