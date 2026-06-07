import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { getHeroSoundMuted, getHeroVideoRef, setHeroSoundMuted } from './heroState'
import { playMenuSound } from '../utils/menuAudio'
import HeroPhoneScene from './HeroPhoneScene'
import { clamp, MODEL_POSES, phoneDescription, usePhoneRoute } from './phoneRoute'
import './PhoneScrollStage.css'

export default function PhoneScrollStage() {
  const { isAr, lang } = useLang()
  const pose = usePhoneRoute(lang)
  const [soundFlash, setSoundFlash] = useState(null)
  const [soundFlashId, setSoundFlashId] = useState(0)
  const [isSoundMuted, setIsSoundMuted] = useState(getHeroSoundMuted)
  const flashTimer = useRef(null)
  const isVideoContent = pose.content === 'earthie-video'
  const isDescriptionContent = pose.content === 'app-description'
  const isCommunityContent = pose.content === 'community-ar' || pose.content === 'community-en'
  const isChallengesContent = pose.content === 'challenges-ar' || pose.content === 'challenges-en'
  const isStaticPreviewContent = isCommunityContent || isChallengesContent
  const shouldFloat = !isDescriptionContent && !isStaticPreviewContent
  const soundCue = isVideoContent ? soundFlash ?? (isSoundMuted ? 'muted' : null) : null
  const phoneAriaLabel = isVideoContent
    ? (isSoundMuted ? 'Turn video sound on' : 'Mute video sound')
    : isCommunityContent
      ? (isAr ? 'معاينة مجتمع إيكوبالز' : 'EcoPals community preview')
      : isChallengesContent
        ? (isAr ? 'معاينة تحديات إيكوبالز' : 'EcoPals challenges preview')
        : undefined

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
    video.volume = nowMuted ? 0 : 1

    if (nowMuted) {
      video.setAttribute('muted', '')
      playMenuSound('phone-off')
    } else {
      video.removeAttribute('muted')
      playMenuSound('phone-on')
    }

    setHeroSoundMuted(nowMuted)
    setIsSoundMuted(nowMuted)

    if (!nowMuted) {
      video.play().then(() => {
        showSoundFlash('on')
      }).catch(() => {
        video.muted = true
        video.defaultMuted = true
        video.volume = 0
        video.setAttribute('muted', '')
        setHeroSoundMuted(true)
        setIsSoundMuted(true)
        playMenuSound('phone-off')
        showSoundFlash('muted')
      })
      return
    }

    video.play().catch(() => { })
    showSoundFlash('muted')
  }

  const maxPhoneSide = Math.max(pose.width, pose.height)
  const overscanX = Math.round(clamp(maxPhoneSide * 0.58, 180, 560))
  const overscanY = Math.round(clamp(maxPhoneSide * 0.28, 110, 300))
  const phoneCanvasWidth = pose.width + overscanX * 2
  const phoneCanvasHeight = pose.height + overscanY * 2
  const modelScaleCorrection = pose.height / phoneCanvasHeight
  const depthMotionAmount = clamp(pose.model.depthMotion ?? 0, 0, 1)
  const depthAutoMotionAmount = clamp(pose.model.depthAutoMotion ?? 1, 0, 1)
  const depthPointerX = clamp(pose.model.depthPointerX ?? 0, -1, 1)
  const depthPointerY = clamp(pose.model.depthPointerY ?? 0, -1, 1)
  const hasDepthMotion = depthMotionAmount > 0.01
  const hasAutoDepthMotion = hasDepthMotion && depthAutoMotionAmount > 0.01
  const modelPose = {
    ...pose.model,
    depthMotion: depthMotionAmount,
    depthAutoMotion: depthAutoMotionAmount,
    depthPointerX,
    depthPointerY,
    scale: (pose.model.scale ?? MODEL_POSES.landscape.scale) * modelScaleCorrection,
  }
  const shadowHeight = Math.round(clamp(pose.height * 0.14, 38, 86))
  const visualPoseY = pose.y + (pose.offsetY ?? 0)

  const phoneStyle = {
    '--phone-content-height': `${pose.height}px`,
    '--phone-content-left': `${overscanX}px`,
    '--phone-content-top': `${overscanY}px`,
    '--phone-content-width': `${pose.width}px`,
    '--phone-depth-motion': depthMotionAmount,
    '--phone-rim-alpha': 0.18 * depthMotionAmount,
    '--phone-rim-blur': `${18 * depthMotionAmount}px`,
    '--phone-rim-x': `${10 * depthMotionAmount}px`,
    '--phone-rim-y': `${-5 * depthMotionAmount}px`,
    '--phone-shadow-height': `${shadowHeight}px`,
    '--phone-shadow-left': `${overscanX + pose.width * 0.04}px`,
    '--phone-shadow-top': `${overscanY + pose.height * 0.82}px`,
    '--phone-shadow-width': `${pose.width * 0.92}px`,
    height: `${phoneCanvasHeight}px`,
    opacity: pose.opacity,
    transform: `translate3d(${Math.round(pose.x - phoneCanvasWidth / 2)}px, ${Math.round(visualPoseY - phoneCanvasHeight / 2)}px, 0) rotate(${pose.cssRotate}deg)`,
    width: `${phoneCanvasWidth}px`,
  }
  const phoneHitStyle = {
    height: `${pose.height}px`,
    opacity: pose.opacity,
    transform: `translate3d(${Math.round(pose.x - pose.width / 2)}px, ${Math.round(visualPoseY - pose.height / 2)}px, 0) rotate(${pose.cssRotate}deg)`,
    width: `${pose.width}px`,
  }

  return (
    <>
      <div
        className={`hero-phone ${hasDepthMotion ? 'hero-phone--depth-motion' : ''}`}
        style={phoneStyle}
      >
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
          <motion.div
            aria-hidden="true"
            animate={hasAutoDepthMotion ? {
              opacity: [0.28 * depthMotionAmount, 0.4 * depthMotionAmount, 0.3 * depthMotionAmount],
              rotate: [-1.2, 1.1, -1.2],
              scaleX: [0.92, 1.04, 0.92],
              x: [-10, 9, -10],
              y: [8, 14, 8],
            } : hasDepthMotion ? {
              opacity: 0.34 * depthMotionAmount,
              rotate: depthPointerX * 1.8,
              scaleX: 0.98 + Math.abs(depthPointerX) * 0.08,
              x: depthPointerX * 14,
              y: 11 + depthPointerY * 5,
            } : {
              opacity: 0,
              rotate: 0,
              scaleX: 0.9,
              x: 0,
              y: 0,
            }}
            className="hero-phone-depth-shadow"
            initial={false}
            transition={hasAutoDepthMotion ? {
              duration: 12.5,
              ease: 'easeInOut',
              repeat: Infinity,
            } : hasDepthMotion ? {
              duration: 0.18,
              ease: 'easeOut',
            } : {
              duration: 0.2,
              ease: 'easeOut',
            }}
          />
          <HeroPhoneScene modelPose={modelPose} screenContent={pose.content} />
        </motion.div>
        <div className="hero-phone-content">
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
          <AnimatePresence mode="wait">
            {isDescriptionContent && (
              <PhoneDescriptionScreen key={isAr ? 'ar' : 'en'} isAr={isAr} />
            )}
          </AnimatePresence>
        </div>
      </div>
      {isVideoContent && (
        <button
          aria-label={phoneAriaLabel}
          aria-pressed={!isSoundMuted}
          className="hero-phone-hit-area"
          onClick={handlePhoneClick}
          style={phoneHitStyle}
          type="button"
        />
      )}
    </>
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
