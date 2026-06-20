import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { recyclePhoneRefs } from '../pages/recyclePortalRefs'
import FunTitleReveal from './FunTitleReveal'
import { playMenuSound } from '../utils/menuAudio'

import trash1 from '../assets/trash_1.png'
import trash2 from '../assets/trash_2.png'
import trash3 from '../assets/trash_3.png'
import trash4 from '../assets/trash_4.png'
import trash5 from '../assets/trash_5.png'
import money1 from '../assets/money_1.png'
import money2 from '../assets/money_2.png'
import money3 from '../assets/money_3.png'
import money4 from '../assets/money_4.png'
import money5 from '../assets/money_5.png'

import './RecyclePortalSection.css'

gsap.registerPlugin(ScrollTrigger)

const TRASH   = [trash1,   trash2,   trash3,   trash4,   trash5]
const MONEY   = [money1,   money2,   money3,   money4,   money5]

const copy = {
  en: {
    kicker: 'Recycle & Earn',
    title: 'Turn Waste Into Rewards.',
    subtitle: 'Send recyclable items through EcoPals, complete recycling challenges, and watch your coins grow.',
  },
  ar: {
    kicker: 'إعادة التدوير واكسب',
    title: 'حوّل النفايات إلى مكافآت.',
    subtitle: 'أرسل المواد القابلة لإعادة التدوير عبر إيكوبالز، أكمل تحديات إعادة التدوير، وشاهد عملاتك تتزايد.',
  },
}

export default function RecyclePortalSection({ isAr = false }) {
  const t = copy[isAr ? 'ar' : 'en']
  const sectionRef  = useRef(null)
  const trashRefs   = useRef([])
  const moneyRefs   = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let st = null
    let flyTl = null
    let flyRetry = null
    let prepTweens = []
    let scrollDir = 1
    const portalRef = recyclePhoneRefs.portal
    const sparklesRef = recyclePhoneRefs.sparkles

    // Defer ScrollTrigger creation to the next animation frame so all parent
    // React effects (useHomeScrollAnimations pin spacers) are in the DOM first.
    const raf = requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      /* ── helpers ─────────────────────────────────────────────── */

      const pulsePortal = (strong = false) => {
        const portal = portalRef.current
        if (!portal) return
        playMenuSound(strong ? 'rp-portal-big' : 'rp-portal')
        gsap.fromTo(
          portal,
          { scale: 1, filter: 'brightness(1)' },
          {
            scale:    strong ? 1.18 : 1.1,
            filter:   `brightness(${strong ? 1.4 : 1.24})`,
            duration: 0.2,
            yoyo:     true,
            repeat:   strong ? 3 : 1,
            ease:     'power2.out',
            overwrite: true,
          },
        )
        if (strong && sparklesRef.current) {
          gsap.fromTo(
            sparklesRef.current,
            { opacity: 0, scale: 0.7 },
            { opacity: 1, scale: 1, duration: 0.35, yoyo: true, repeat: 3, ease: 'power2.out', overwrite: true },
          )
        }
      }

      let currentStage = -1

      const resetFlyItems = (activeIndex = -1) => {
        recyclePhoneRefs.flyItems.forEach((el, i) => {
          if (!el || i === activeIndex) return
          gsap.set(el, {
            autoAlpha: 0,
            rotation: -14,
            scale: 0.72,
            x: -260,
            y: 34,
          })
        })
      }

      const animatePhoneItem = (idx) => {
        const item = recyclePhoneRefs.flyItems[idx]
        const portal = portalRef.current

        if (!item || !portal) {
          if (flyRetry) window.clearTimeout(flyRetry)
          flyRetry = window.setTimeout(() => {
            flyRetry = null
            showStage(idx, false, true)
          }, 90)
          return
        }

        if (flyRetry) {
          window.clearTimeout(flyRetry)
          flyRetry = null
        }

        if (flyTl) flyTl.kill()
        resetFlyItems(idx)
        playMenuSound('rp-throw')

        flyTl = gsap.timeline()
          .fromTo(
            item,
            {
              autoAlpha: 0,
              rotation: -14,
              scale: 0.72,
              x: -260,
              y: 34,
            },
            {
              autoAlpha: 1,
              duration: 0.42,
              ease: 'power2.out',
              rotation: -5,
              scale: 1.06,
              x: -56,
              y: 12,
            },
          )
          .to(item, {
            autoAlpha: 1,
            duration: 0.22,
            ease: 'power1.inOut',
            rotation: 2,
            scale: 0.78,
            x: 0,
            y: 0,
          })
          .to(item, {
            autoAlpha: 0,
            duration: 0.28,
            ease: 'power2.in',
            rotation: 12,
            scale: 0.16,
            x: 36,
            y: -14,
          })
          .add(() => pulsePortal(idx === 4), 0.5)
      }

      const reversePhoneItem = (idx) => {
        const item = recyclePhoneRefs.flyItems[idx]
        if (!item) return

        if (flyTl) flyTl.kill()
        resetFlyItems(idx)
        playMenuSound('rp-reverse')

        // Item exits portal (small/right) and flies back to the left
        flyTl = gsap.timeline()
          .fromTo(
            item,
            { autoAlpha: 0, rotation: 12,  scale: 0.16, x: 36,   y: -14 },
            { autoAlpha: 1, rotation: 2,   scale: 0.78, x: 0,    y: 0,   duration: 0.22, ease: 'power1.inOut' },
          )
          .to(item, { autoAlpha: 1, rotation: -5,  scale: 1.06, x: -56,  y: 12,  duration: 0.32, ease: 'power2.out' })
          .to(item, { autoAlpha: 0, rotation: -14, scale: 0.72, x: -260, y: 34,  duration: 0.22, ease: 'power2.in' })
      }

      const showStage = (idx, instant = false, forceFly = false) => {
        const nextStage = Math.min(Math.max(idx, 0), 4)
        const isNewStage = nextStage !== currentStage
        if (!instant && !forceFly && !isNewStage) return

        const dur = instant ? 0 : 0.52

        if (isNewStage || instant) {
          trashRefs.current.forEach((el, i) => {
            if (!el) return
            gsap.to(el, { opacity: i === nextStage ? 1 : 0, scale: i === nextStage ? 1.06 : 0.78, duration: dur, ease: 'power2.inOut', overwrite: true })
          })

          moneyRefs.current.forEach((el, i) => {
            if (!el) return
            gsap.to(el, { opacity: i === nextStage ? 1 : 0, scale: i === nextStage ? 1.08 : 0.78, duration: dur, ease: 'power2.inOut', overwrite: true })
          })
        }

        if (instant) {
          currentStage = nextStage
          resetFlyItems()
          return
        }

        const prevStage = currentStage
        currentStage = nextStage

        if (scrollDir === -1 && isNewStage) {
          reversePhoneItem(prevStage)
        } else {
          animatePhoneItem(nextStage)
        }
      }

      if (reducedMotion) {
        showStage(4, true)
        if (sparklesRef.current) gsap.set(sparklesRef.current, { opacity: 0.5 })
        return
      }

      st = ScrollTrigger.create({
        trigger:    section,
        start:      'top top',
        end:        '+=320%',
        pin:        true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: ({ progress, direction }) => {
          scrollDir = direction
          showStage(Math.min(Math.floor(progress * 5), 4))
        },
      })

      // The pin spacer added above shifts every subsequent section's
      // document position by ~4500px. Refresh FIRST so element positions
      // reflect the spacer, then create prep body-bg tweens with correct
      // positions. Creating them in useHomeScrollAnimations (before this
      // spacer exists) gives positions ~4500px too early — inside the pin
      // range — causing constant color cycling during the pin.
      ScrollTrigger.refresh()

      const rootStyle = getComputedStyle(document.documentElement)
      const readPastel = (name) => rootStyle.getPropertyValue(name).trim()

      ;[
        { key: 'recycle-challenges',  from: '--soft-peach', to: '--light-leaf'  },
        { key: 'clothing-game',       from: '--light-leaf', to: '--soft-peach'  },
        { key: 'match-3-game',        from: '--soft-peach', to: '--light-leaf'  },
        { key: 'do-you-like-me-game', from: '--light-leaf', to: '--light-cream' },
      ].forEach(({ key, from, to }) => {
        const triggerEl = document.querySelector(`.home-band-prep--${key}`)
        if (!triggerEl) return
        prepTweens.push(
          gsap.fromTo(
            document.body,
            { backgroundColor: readPastel(from) },
            {
              backgroundColor: readPastel(to),
              ease: 'none',
              immediateRender: false,
              scrollTrigger: {
                trigger: triggerEl,
                start: 'top top',
                end: 'bottom top',
                invalidateOnRefresh: true,
                scrub: 0.6,
              },
            },
          ),
        )
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      if (flyRetry) window.clearTimeout(flyRetry)
      if (flyTl) flyTl.kill()
      if (st) st.kill()
      prepTweens.forEach((t) => t.kill())
    }
  }, [])

  return (
    <section
      className={`rp-section${isAr ? ' rp-section--ar' : ''}`}
      id="recycle-portal"
      aria-labelledby="rp-title"
      ref={sectionRef}
    >
      <div className="rp-inner">

        {/* ── Copy ─────────────────────────────────────────────── */}
        <div className={`rp-copy${isAr ? ' rp-copy--ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
          <span className="rp-kicker">{t.kicker}</span>
          <h2 className="rp-title" id="rp-title">
            <FunTitleReveal text={t.title} delay={0.08} />
          </h2>
          <p className="rp-subtitle">{t.subtitle}</p>
        </div>

        {/* ── Scene ────────────────────────────────────────────── */}
        <div className="rp-scene" aria-hidden="true">

          {/* Left — trash pile */}
          <div className="rp-side rp-side--trash">
            {TRASH.map((src, i) => (
              <img
                key={i}
                className="rp-pile-img"
                src={src}
                alt={`Trash pile, stage ${i + 1} of 5`}
                draggable="false"
                loading="lazy"
                ref={(el) => { trashRefs.current[i] = el }}
                style={{ opacity: i === 0 ? 1 : 0 }}
              />
            ))}
          </div>

          {/* Center — phone zone: the shared PhoneScrollStage phone navigates here */}
          <div className="rp-phone-zone">
            {/* Anchor guides the PhoneScrollStage phone to this position.
                Portal / sparkles overlay is rendered inside PhoneScrollStage
                via RecyclePortalOverlay when content === 'recycle-portal'. */}
            <div
              className="phone-scene-anchor"
              data-phone-content="recycle-portal"
              data-phone-depth-motion="0.45"
              data-phone-float-amount="0"
              data-phone-orientation="portrait"
              data-phone-rotate="0"
              data-phone-scale="1.34"
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>

          {/* Right — money pile */}
          <div className="rp-side rp-side--money">
            {MONEY.map((src, i) => (
              <img
                key={i}
                className="rp-pile-img"
                src={src}
                alt={`Rewards pile, stage ${i + 1} of 5`}
                draggable="false"
                loading="lazy"
                ref={(el) => { moneyRefs.current[i] = el }}
                style={{ opacity: i === 0 ? 1 : 0 }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
