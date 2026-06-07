import { useEffect, useRef, useState } from 'react'

export const MODEL_POSES = {
  landscape: {
    depthMotion: 0,
    depthAutoMotion: 1,
    depthPointerX: 0,
    depthPointerY: 0,
    rotationX: Math.PI / 2,
    rotationY: Math.PI / 2,
    rotationZ: 0,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    scale: 2.08,
    floatAmount: 1,
  },
  portrait: {
    depthMotion: 0,
    depthAutoMotion: 1,
    depthPointerX: 0,
    depthPointerY: 0,
    rotationX: Math.PI / 2,
    rotationY: 0,
    rotationZ: 0,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    scale: 2.08,
    floatAmount: 1,
  },
}

const MODEL_KEYS = [
  'depthMotion',
  'depthAutoMotion',
  'depthPointerX',
  'depthPointerY',
  'rotationX',
  'rotationY',
  'rotationZ',
  'positionX',
  'positionY',
  'positionZ',
  'scale',
  'floatAmount',
]

export const phoneDescription = {
  ar: {
    kicker: '\u0637\u0627\u0642\u0629 \u0623\u0631\u0636',
    title: '\u0627\u062c\u0639\u0644 \u0623\u0631\u0636 \u0633\u0639\u064a\u062f\u0629',
    body: '\u0623\u0631\u0636 \u062a\u0639\u0643\u0633 \u0639\u0646\u0627\u064a\u062a\u0643 \u0627\u0644\u064a\u0648\u0645\u064a\u0629 \u0628\u0627\u0644\u0643\u0648\u0643\u0628. \u0623\u0639\u062f \u0627\u0644\u062a\u062f\u0648\u064a\u0631\u060c \u0648\u0641\u0631 \u0627\u0644\u0645\u0627\u0621\u060c \u0648\u0623\u0646\u062c\u0632 \u0627\u0644\u062a\u062d\u062f\u064a\u0627\u062a \u0627\u0644\u0628\u064a\u0626\u064a\u0629 \u0644\u062a\u0631\u062a\u0641\u0639 \u0637\u0627\u0642\u062a\u0647\u0627 \u0645\u0646 \u0627\u0644\u062d\u0632\u0646 \u0625\u0644\u0649 \u0627\u0644\u0633\u0639\u0627\u062f\u0629.',
  },
  en: {
    kicker: 'Earthie energy',
    title: 'Make Earthie happy',
    body: 'Earthie reflects your daily care for the planet. Recycle, save water, and complete eco challenges so Earthie grows from sad to happy.',
  },
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function smoothStep(value) {
  const t = clamp(value, 0, 1)
  return t * t * (3 - 2 * t)
}

function lerp(from, to, progress) {
  return from + (to - from) * progress
}

function readNumber(value, fallback) {
  if (value == null || value === '') return fallback
  const nextValue = Number(value)
  return Number.isFinite(nextValue) ? nextValue : fallback
}

function readCssNumber(anchor, propertyName, fallback) {
  const nextValue = Number.parseFloat(window.getComputedStyle(anchor).getPropertyValue(propertyName))
  return Number.isFinite(nextValue) ? nextValue : fallback
}

function readScreenProgress(anchor) {
  const section = anchor.closest('section') ?? anchor
  const rect = section.getBoundingClientRect()
  const sectionTop = rect.top + window.scrollY
  const viewportCenter = window.scrollY + window.innerHeight * 0.5
  const start = sectionTop + rect.height * 0.18
  const end = sectionTop + rect.height * 0.82

  return smoothStep((viewportCenter - start) / Math.max(end - start, 1))
}

function readModelPose(anchor) {
  const orientation = anchor.dataset.phoneOrientation === 'portrait' ? 'portrait' : 'landscape'
  const basePose = MODEL_POSES[orientation]

  return MODEL_KEYS.reduce((pose, key) => {
    const dataKey = `phone${key.charAt(0).toUpperCase()}${key.slice(1)}`
    pose[key] = readNumber(anchor.dataset[dataKey], basePose[key])
    return pose
  }, {})
}

function readAnchorPose(anchor) {
  const rect = anchor.getBoundingClientRect()
  const scrollTop = window.scrollY

  return {
    anchor: rect.top + scrollTop + rect.height * 0.5,
    content: anchor.dataset.phoneContent || 'earthie-video',
    cssRotate: readNumber(anchor.dataset.phoneRotate, 0),
    height: rect.height,
    model: readModelPose(anchor),
    offsetY: readNumber(anchor.dataset.phoneRouteOffsetY, readCssNumber(anchor, '--phone-route-offset-y', 0)),
    opacity: readNumber(anchor.dataset.phoneOpacity, 1),
    screenProgress: readScreenProgress(anchor),
    width: rect.width,
    x: rect.left + rect.width * 0.5,
    y: rect.top + rect.height * 0.5,
  }
}

function lerpModelPose(from, to, progress) {
  const pose = MODEL_KEYS.reduce((nextPose, key) => {
    nextPose[key] = lerp(from[key], to[key], progress)
    return nextPose
  }, {})
  const manualDepthSource = to.depthAutoMotion === 0 ? to : from.depthAutoMotion === 0 ? from : null

  if (manualDepthSource) {
    pose.depthAutoMotion = manualDepthSource.depthAutoMotion
    pose.depthPointerX = manualDepthSource.depthPointerX
    pose.depthPointerY = manualDepthSource.depthPointerY
  }

  return pose
}

function isDescriptionCommunityHandoff(from, to) {
  return from.content === 'app-description' && to.content?.startsWith('community-')
}

function isChallengesHandoff(to) {
  return to.content?.startsWith('challenges-')
}

function getHandoffContent(from, to, progress) {
  if (!isDescriptionCommunityHandoff(from, to)) {
    return progress < 0.5 ? from.content : to.content
  }

  if (progress < 0.1) return from.content
  if (progress < 0.80) return 'blank-screen'
  return to.content
}

function lerpPhonePose(from, to, progress) {
  const isCommunityHandoff = isDescriptionCommunityHandoff(from, to)
  const isChallengeHandoff = isChallengesHandoff(to)
  const motionProgress = isCommunityHandoff
    ? smoothStep((progress - 0.1) / 0.9)
    : progress
  const xProgress = isChallengeHandoff
    ? smoothStep((progress - 0.18) / 0.34)
    : motionProgress
  const content = getHandoffContent(from, to, progress)

  return {
    content,
    cssRotate: lerp(from.cssRotate, to.cssRotate, motionProgress),
    height: lerp(from.height, to.height, motionProgress),
    model: lerpModelPose(from.model, to.model, motionProgress),
    offsetY: lerp(from.offsetY, to.offsetY, motionProgress),
    opacity: lerp(from.opacity, to.opacity, motionProgress),
    screenProgress: content === to.content ? to.screenProgress : from.screenProgress,
    width: lerp(from.width, to.width, motionProgress),
    x: lerp(from.x, to.x, xProgress),
    y: lerp(from.y, to.y, motionProgress),
  }
}

function getFallbackPose() {
  return {
    content: 'earthie-video',
    cssRotate: 0,
    height: 520,
    model: MODEL_POSES.landscape,
    offsetY: 0,
    opacity: 0,
    screenProgress: 0,
    width: 920,
    x: typeof window === 'undefined' ? 640 : window.innerWidth / 2,
    y: typeof window === 'undefined' ? 360 : window.innerHeight / 2,
  }
}

export function usePhoneRoute(routeKey) {
  const [pose, setPose] = useState(getFallbackPose)
  const rafRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const delayedReadTimeouts = []
    const runScheduledRead = () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      readRoute()
    }

    function readRoute() {
      const anchors = [...document.querySelectorAll('.phone-scene-anchor')]
        .map(readAnchorPose)
        .filter((anchor) => anchor.width > 0 && anchor.height > 0)
        .sort((a, b) => a.anchor - b.anchor)

      if (anchors.length === 0) {
        setPose(getFallbackPose())
        return
      }

      const viewportCenter = window.scrollY + window.innerHeight * 0.5

      if (anchors.length === 1) {
        const distance = Math.abs(viewportCenter - anchors[0].anchor)
        const visibleRange = window.innerHeight * 0.8
        const opacity = smoothStep(1 - distance / visibleRange)
        setPose({ ...anchors[0], opacity })
        return
      }

      if (viewportCenter <= anchors[0].anchor) {
        setPose(anchors[0])
        return
      }

      if (viewportCenter >= anchors[anchors.length - 1].anchor) {
        setPose(anchors[anchors.length - 1])
        return
      }

      for (let i = 0; i < anchors.length - 1; i += 1) {
        const current = anchors[i]
        const next = anchors[i + 1]

        if (viewportCenter >= current.anchor && viewportCenter <= next.anchor) {
          const progress = smoothStep((viewportCenter - current.anchor) / (next.anchor - current.anchor))
          setPose(lerpPhonePose(current, next, progress))
          return
        }
      }
    }

    function scheduleRead() {
      if (rafRef.current || timeoutRef.current) return

      rafRef.current = window.requestAnimationFrame(runScheduledRead)
      timeoutRef.current = window.setTimeout(runScheduledRead, 80)
    }

    readRoute()
    window.addEventListener('scroll', scheduleRead, { passive: true })
    window.addEventListener('resize', scheduleRead)
    window.addEventListener('hashchange', scheduleRead)
    window.addEventListener('load', scheduleRead)
    window.addEventListener('phone-route-refresh', scheduleRead)
      ;[80, 240, 650, 1200].forEach((delay) => {
        delayedReadTimeouts.push(window.setTimeout(scheduleRead, delay))
      })

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      delayedReadTimeouts.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })

      window.removeEventListener('scroll', scheduleRead)
      window.removeEventListener('resize', scheduleRead)
      window.removeEventListener('hashchange', scheduleRead)
      window.removeEventListener('load', scheduleRead)
      window.removeEventListener('phone-route-refresh', scheduleRead)
    }
  }, [routeKey])

  return pose
}
