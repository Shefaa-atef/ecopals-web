import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playMenuSound } from '../../utils/menuAudio'
import { challengePlanes } from './homePageData'

gsap.registerPlugin(ScrollTrigger)

export default function useHomeScrollAnimations({
  aboutBandRef,
  aboutStickyRef,
  challengesSectionRef,
  coinRefs,
  communitySectionRef,
  photoCardRefs,
  scorePopContainerRef,
  setEarthieEnergy,
}) {
  useGSAP(() => {
    const sticky = aboutStickyRef.current
    const about = aboutBandRef.current
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

    const rootStyle = getComputedStyle(document.documentElement)
    const readPastel = (name) => rootStyle.getPropertyValue(name).trim()

    gsap.set(document.body, { backgroundColor: readPastel('--forest-green') })

    const chips = gsap.utils.toArray('[data-earthie-chip]')
    if (chips.length && sticky) {
      const rotations = [-14, 0, 14]
      gsap.set(chips, { y: 280, scale: 0, rotate: (i) => rotations[i] ?? 0 })
      const chipTl = gsap.timeline()
      chips.forEach((chip, i) => {
        chipTl.fromTo(
          chip,
          { y: 280, scale: 0, rotate: rotations[i] ?? 0 },
          { y: 0, scale: 1, rotate: 0, ease: 'back.out(1.8)', duration: 0.7 },
          i * 0.28,
        )
      })
      ScrollTrigger.create({
        trigger: sticky,
        start: 'top top',
        end: '+=130%',
        scrub: 0.9,
        animation: chipTl,
        invalidateOnRefresh: true,
      })
    }

    const bgTransitions = [
      { trigger: about, from: '--forest-green', to: '--light-aqua' },
      { trigger: community, from: '--light-aqua', to: '--light-lavender' },
      { trigger: challenges, from: '--light-lavender', to: '--light-cream' },
    ]

    const prepTransitions = [
      { key: 'recycle-challenges', from: '--light-cream', to: '--light-leaf' },
      { key: 'clothing-game', from: '--light-leaf', to: '--soft-peach' },
      { key: 'match-3-game', from: '--soft-peach', to: '--light-lavender' },
      { key: 'do-you-like-me-game', from: '--light-lavender', to: '--light-cream' },
    ]

    const allTransitions = [
      ...bgTransitions,
      ...prepTransitions.map(({ key, from, to }) => ({
        trigger: document.querySelector(`.home-band-prep--${key}`),
        from,
        to,
      })),
    ]

    allTransitions.forEach(({ trigger: triggerEl, from, to }) => {
      if (!triggerEl) return
      gsap.fromTo(
        document.body,
        { backgroundColor: readPastel(from) },
        {
          backgroundColor: readPastel(to),
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: triggerEl,
            start: 'top bottom',
            end: 'top top',
            invalidateOnRefresh: true,
            scrub: 0.6,
          },
        },
      )
    })

    if (challenges) {
      const photoCards = photoCardRefs.current
      const coins = coinRefs.current
      const totalPhotos = challengePlanes.reduce((sum, p) => sum + p.length, 0)

      const shuffled = Array.from({ length: totalPhotos }, (_, i) => i)
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }

      const pairs = []
      for (let i = 0; i < shuffled.length; i += 2) {
        pairs.push([shuffled[i], shuffled[i + 1] ?? shuffled[i]])
      }

      const exitTl = gsap.timeline()
      const batchDur = 0.65

      pairs.forEach(([a, b], pairIndex) => {
        const t = pairIndex * batchDur
        exitTl.to(photoCards[a], { opacity: 0, scale: 0.72, duration: 0.32, ease: 'power2.in' }, t)
        exitTl.to(photoCards[b], { opacity: 0, scale: 0.72, duration: 0.32, ease: 'power2.in' }, t + 0.14)
        exitTl.fromTo(coins[a], { opacity: 0, scale: 0 }, {
          opacity: 1, scale: 1, duration: 0.38, ease: 'back.out(1.7)',
          onStart: () => playMenuSound('coin'),
        }, t + 0.1)
        exitTl.fromTo(coins[b], { opacity: 0, scale: 0 }, {
          opacity: 1, scale: 1, duration: 0.38, ease: 'back.out(1.7)',
          onStart: () => playMenuSound('coin'),
        }, t + 0.24)
      })

      exitTl.to({}, { duration: 0.4 })

      const totalDur = exitTl.totalDuration()
      const pairThresholds = pairs.map((_, i) => ((i * batchDur) + batchDur * 0.35) / totalDur)
      const scoreValues = [1, 4, 5, 6, 8, 10, 25]
      const firedPairs = new Set()

      const spawnScorePop = (container, value) => {
        const el = document.createElement('div')
        el.className = 'challenge-score-pop'
        el.textContent = `+${value}`
        el.style.left = `${12 + Math.random() * 76}%`
        el.style.top = `${20 + Math.random() * 55}%`
        container.appendChild(el)
        playMenuSound('score-pop')
        gsap.fromTo(
          el,
          { opacity: 0, y: 0, scale: 0.6 },
          {
            opacity: 1, y: -54, scale: 1.15, duration: 0.38, ease: 'back.out(1.6)',
            onComplete: () => gsap.to(el, {
              opacity: 0, y: -96, scale: 0.8, duration: 0.52, ease: 'power2.in',
              onComplete: () => el.remove(),
            }),
          },
        )
      }

      ScrollTrigger.create({
        trigger: challenges,
        start: 'top top',
        end: `+=${pairs.length * 340 + 280}`,
        pin: true,
        scrub: 0.8,
        animation: exitTl,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const container = scorePopContainerRef.current
          if (!container) return
          pairThresholds.forEach((threshold, i) => {
            if (progress >= threshold && !firedPairs.has(i)) {
              firedPairs.add(i)
              const val = scoreValues[Math.floor(Math.random() * scoreValues.length)]
              spawnScorePop(container, val)
              setTimeout(() => {
                const val2 = scoreValues[Math.floor(Math.random() * scoreValues.length)]
                spawnScorePop(container, val2)
              }, 160)
            }
            if (progress < threshold - 0.04) firedPairs.delete(i)
          })
        },
      })
    }
  }, [])
}
