import { useEffect } from 'react'

export default function useExactSectionScroll(sectionRef, sectionHash, previousHash = '') {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    let settleTimeoutId = 0
    let releaseTimeoutId = 0
    let isSnapping = false
    let hasSettled = Math.abs(section.getBoundingClientRect().top) <= 2

    const scrollToSection = (behavior = 'smooth') => {
      const top = Math.max(0, Math.round(section.getBoundingClientRect().top + window.scrollY))
      window.scrollTo({ top, behavior })
    }

    const settleSectionScroll = () => {
      const targetHash = `#${sectionHash}`
      if (window.location.hash && window.location.hash !== targetHash && window.location.hash !== previousHash) return

      window.clearTimeout(settleTimeoutId)

      settleTimeoutId = window.setTimeout(() => {
        const rect = section.getBoundingClientRect()
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

        const isNearSectionStart = rect.top <= viewportHeight * 0.72 && rect.top >= -viewportHeight * 0.34
        const isMostlyOnScreen = rect.bottom >= viewportHeight * 0.66

        if (!isNearSectionStart || !isMostlyOnScreen) return

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        isSnapping = true
        hasSettled = true
        scrollToSection(prefersReducedMotion ? 'auto' : 'smooth')

        window.clearTimeout(releaseTimeoutId)
        releaseTimeoutId = window.setTimeout(() => {
          isSnapping = false

          if (Math.abs(section.getBoundingClientRect().top) > 2) {
            scrollToSection('auto')
          }
        }, prefersReducedMotion ? 80 : 900)
      }, 140)
    }

    window.addEventListener('scroll', settleSectionScroll, { passive: true })
    window.addEventListener('resize', settleSectionScroll)
    settleSectionScroll()

    return () => {
      window.removeEventListener('scroll', settleSectionScroll)
      window.removeEventListener('resize', settleSectionScroll)
      window.clearTimeout(settleTimeoutId)
      window.clearTimeout(releaseTimeoutId)
    }
  }, [sectionRef, sectionHash, previousHash])
}
