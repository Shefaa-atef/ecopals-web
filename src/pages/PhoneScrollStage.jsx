import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { getHeroSoundMuted, getHeroVideoRef, setHeroSoundMuted } from './heroState'
import HeroPhoneScene from './HeroPhoneScene'
import './PhoneScrollStage.css'

const MODEL_POSES = {
  landscape: {
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
    rotationX: Math.PI / 2,
    rotationY: Math.PI / 2,
    rotationZ: Math.PI / 2,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    scale: 2.08,
    floatAmount: 1,
  },
}

const MODEL_KEYS = [
  'rotationX',
  'rotationY',
  'rotationZ',
  'positionX',
  'positionY',
  'positionZ',
  'scale',
  'floatAmount',
]

const phoneDescription = {
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

function clamp(value, min, max) {
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
    opacity: readNumber(anchor.dataset.phoneOpacity, 1),
    screenProgress: readScreenProgress(anchor),
    width: rect.width,
    x: rect.left + rect.width * 0.5,
    y: rect.top + rect.height * 0.5,
  }
}

function lerpModelPose(from, to, progress) {
  return MODEL_KEYS.reduce((pose, key) => {
    pose[key] = lerp(from[key], to[key], progress)
    return pose
  }, {})
}

function lerpPhonePose(from, to, progress) {
  return {
    content: progress < 0.5 ? from.content : to.content,
    cssRotate: lerp(from.cssRotate, to.cssRotate, progress),
    height: lerp(from.height, to.height, progress),
    model: lerpModelPose(from.model, to.model, progress),
    opacity: lerp(from.opacity, to.opacity, progress),
    screenProgress: progress < 0.5 ? from.screenProgress : to.screenProgress,
    width: lerp(from.width, to.width, progress),
    x: lerp(from.x, to.x, progress),
    y: lerp(from.y, to.y, progress),
  }
}

function getFallbackPose() {
  return {
    content: 'earthie-video',
    cssRotate: 0,
    height: 520,
    model: MODEL_POSES.landscape,
    opacity: 0,
    screenProgress: 0,
    width: 920,
    x: typeof window === 'undefined' ? 640 : window.innerWidth / 2,
    y: typeof window === 'undefined' ? 360 : window.innerHeight / 2,
  }
}

function usePhoneRoute() {
  const [pose, setPose] = useState(getFallbackPose)
  const rafRef = useRef(null)

  useEffect(() => {
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
      if (rafRef.current) return

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null
        readRoute()
      })
    }

    readRoute()
    window.addEventListener('scroll', scheduleRead, { passive: true })
    window.addEventListener('resize', scheduleRead)

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current)
      }

      window.removeEventListener('scroll', scheduleRead)
      window.removeEventListener('resize', scheduleRead)
    }
  }, [])

  return pose
}

export default function PhoneScrollStage() {
  const pose = usePhoneRoute()
  const { isAr } = useLang()
  const [soundFlash, setSoundFlash] = useState(null)
  const [soundFlashId, setSoundFlashId] = useState(0)
  const [isSoundMuted, setIsSoundMuted] = useState(getHeroSoundMuted)
  const flashTimer = useRef(null)
  const isVideoContent = pose.content === 'earthie-video'
  const isDescriptionContent = pose.content === 'app-description'
  const shouldFloat = !isDescriptionContent
  const soundCue = isVideoContent ? soundFlash ?? (isSoundMuted ? 'muted' : null) : null

  useEffect(() => {
    return () => clearTimeout(flashTimer.current)
  }, [])

  function showSoundFlash(nextFlash) {
    clearTimeout(flashTimer.current)
    setSoundFlash(nextFlash)
    setSoundFlashId((id) => id + 1)
    flashTimer.current = setTimeout(() => setSoundFlash(null), 600)
  }

  function handlePhoneClick() {
    if (!isVideoContent) return

    const video = getHeroVideoRef()
    if (!video) return

    const nowMuted = !video.muted
    video.muted = nowMuted
    video.defaultMuted = nowMuted

    if (nowMuted) {
      video.setAttribute('muted', '')
    } else {
      video.removeAttribute('muted')
    }

    setHeroSoundMuted(nowMuted)
    setIsSoundMuted(nowMuted)

    if (!nowMuted) {
      video.play().then(() => {
        showSoundFlash('on')
      }).catch(() => {
        video.muted = true
        video.defaultMuted = true
        video.setAttribute('muted', '')
        setHeroSoundMuted(true)
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

  const phoneStyle = {
    height: `${pose.height}px`,
    opacity: pose.opacity,
    pointerEvents: pose.opacity > 0.05 && isVideoContent ? 'auto' : 'none',
    transform: `translate3d(${pose.x - pose.width / 2}px, ${pose.y - pose.height / 2}px, 0) rotate(${pose.cssRotate}deg)`,
    width: `${pose.width}px`,
  }

  return (
    <div
      aria-label={isSoundMuted ? 'Turn video sound on' : 'Mute video sound'}
      aria-pressed={!isSoundMuted}
      className="hero-phone"
      onClick={handlePhoneClick}
      onKeyDown={handlePhoneKeyDown}
      role={isVideoContent ? 'button' : undefined}
      style={phoneStyle}
      tabIndex={isVideoContent ? 0 : -1}
    >
      {soundCue && (
        <div
          aria-hidden="true"
          className={`phone-sound-flash phone-sound-flash--${soundCue} ${soundFlash ? '' : 'phone-sound-prompt'}`}
          key={soundFlash ? `${soundFlash}-${soundFlashId}` : 'sound-prompt'}
        >
          {soundCue === 'on' ? (
            <svg viewBox="0 0 24 24" fill="#1e3a1e" width="36" height="36"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="#1e3a1e" width="36" height="36"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
          )}
        </div>
      )}
      <motion.div
        animate={shouldFloat ? {
          opacity: 1,
          y: [0, -5, 0],
          rotate: [0, -0.15, 0.15, 0],
        } : {
          opacity: 1,
          y: 0,
          rotate: 0,
        }}
        className="hero-phone-motion"
        initial={{ opacity: 0 }}
        transition={shouldFloat ? {
          opacity: { delay: 0.55, duration: 0.6, ease: 'easeOut' },
          y: { delay: 1.2, duration: 7.2, ease: 'easeInOut', repeat: Infinity },
          rotate: { delay: 1.2, duration: 7.2, ease: 'easeInOut', repeat: Infinity },
        } : {
          opacity: { duration: 0.2, ease: 'easeOut' },
          y: { duration: 0.2, ease: 'easeOut' },
          rotate: { duration: 0.2, ease: 'easeOut' },
        }}
      >
        <HeroPhoneScene modelPose={pose.model} screenContent={pose.content} />
      </motion.div>
      <AnimatePresence mode="wait">
        {isDescriptionContent && (
          <PhoneDescriptionScreen key={isAr ? 'ar' : 'en'} isAr={isAr} />
        )}
      </AnimatePresence>
    </div>
  )
}

function PhoneDescriptionScreen({ isAr }) {
  const copy = isAr ? phoneDescription.ar : phoneDescription.en
  const direction = isAr ? 'rtl' : 'ltr'
  const lang = isAr ? 'ar' : 'en'

  return (
    <motion.div
      animate={{
        clipPath: 'inset(0% 0% 0% 0% round 28px)',
        opacity: 1,
      }}
      aria-label="EcoPals app description"
      className="phone-description-screen"
      exit={{
        clipPath: 'inset(0% 50% 0% 50% round 28px)',
        opacity: 0,
        transition: { duration: 0.26, ease: [0.65, 0, 0.35, 1] },
      }}
      initial={{
        clipPath: 'inset(0% 50% 0% 50% round 28px)',
        opacity: 0,
      }}
      transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="phone-description-glow" aria-hidden="true" />
      <motion.div
        aria-hidden="true"
        className="phone-description-split phone-description-split--left"
        initial={{ opacity: 0.7, scaleX: 1 }}
        animate={{ opacity: 0, scaleX: 0.16, x: '-18%' }}
        transition={{ duration: 0.64, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        aria-hidden="true"
        className="phone-description-split phone-description-split--right"
        initial={{ opacity: 0.7, scaleX: 1 }}
        animate={{ opacity: 0, scaleX: 0.16, x: '18%' }}
        transition={{ duration: 0.64, ease: [0.16, 1, 0.3, 1] }}
      />

      <section
        className={`phone-description-panel ${isAr ? 'phone-description-panel--ar' : 'phone-description-panel--en'}`}
        dir={direction}
        lang={lang}
      >
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="phone-description-copy"
          initial={{ opacity: 0, y: 9 }}
          transition={{ delay: 0.08, duration: 0.22, ease: 'easeOut' }}
        >
          <p className="phone-description-kicker">{copy.kicker}</p>
          <h3>{copy.title}</h3>
          <p className="phone-description-text">{copy.body}</p>
        </motion.div>
      </section>
    </motion.div>
  )
}
