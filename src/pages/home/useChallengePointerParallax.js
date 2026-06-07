import { useEffect } from 'react'
import gsap from 'gsap'

const basePhoneRotation = {
  x: Math.PI / 2,
  y: 0,
  z: 0,
}

function localLerp(start, target, amount) {
  return start * (1 - amount) + target * amount
}

function clampUnit(value) {
  return Math.max(-1, Math.min(1, value))
}

export default function useChallengePointerParallax({
  challengePhoneAnchorRef,
  challengePlaneRefs,
  challengesSectionRef,
}) {
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
    const currentDepthPointer = { x: 0, y: 0 }
    const targetDepthPointer = { x: 0, y: 0 }
    const currentPhoneRotation = { ...basePhoneRotation }
    const targetPhoneRotation = { ...basePhoneRotation }
    let hasPointerBaseline = false
    let lastSectionPointerMoveAt = 0

    const resetPhonePoseTarget = () => {
      targetPhoneRotation.x = basePhoneRotation.x
      targetPhoneRotation.y = basePhoneRotation.y
      targetPhoneRotation.z = basePhoneRotation.z
      targetDepthPointer.x = 0
      targetDepthPointer.y = 0
    }

    const applyPhonePose = () => {
      if (!phoneAnchor) return false

      currentPhoneRotation.x = localLerp(currentPhoneRotation.x, targetPhoneRotation.x, 0.14)
      currentPhoneRotation.y = localLerp(currentPhoneRotation.y, targetPhoneRotation.y, 0.14)
      currentPhoneRotation.z = localLerp(currentPhoneRotation.z, targetPhoneRotation.z, 0.14)
      currentDepthPointer.x = localLerp(currentDepthPointer.x, targetDepthPointer.x, 0.14)
      currentDepthPointer.y = localLerp(currentDepthPointer.y, targetDepthPointer.y, 0.14)

      phoneAnchor.dataset.phoneRotationX = currentPhoneRotation.x.toFixed(4)
      phoneAnchor.dataset.phoneRotationY = currentPhoneRotation.y.toFixed(4)
      phoneAnchor.dataset.phoneRotationZ = currentPhoneRotation.z.toFixed(4)
      phoneAnchor.dataset.phoneDepthPointerX = currentDepthPointer.x.toFixed(4)
      phoneAnchor.dataset.phoneDepthPointerY = currentDepthPointer.y.toFixed(4)

      return Math.abs(currentPhoneRotation.x - targetPhoneRotation.x) > 0.001
        || Math.abs(currentPhoneRotation.y - targetPhoneRotation.y) > 0.001
        || Math.abs(currentPhoneRotation.z - targetPhoneRotation.z) > 0.001
        || Math.abs(currentDepthPointer.x - targetDepthPointer.x) > 0.001
        || Math.abs(currentDepthPointer.y - targetDepthPointer.y) > 0.001
    }

    const animatePlanes = () => {
      currentOffset.x = localLerp(currentOffset.x, targetOffset.x, easing)
      currentOffset.y = localLerp(currentOffset.y, targetOffset.y, easing)

      const shouldKeepRotatingPhone = applyPhonePose()
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
        window.dispatchEvent(new Event('phone-route-refresh'))
      }

      if (shouldKeepMoving || shouldKeepRotatingPhone) {
        requestAnimationFrameId = window.requestAnimationFrame(animatePlanes)
        return
      }

      requestAnimationFrameId = 0
    }

    const resetPointer = () => {
      targetOffset.x = 0
      targetOffset.y = 0
      hasPointerBaseline = false
      resetPhonePoseTarget()

      if (!requestAnimationFrameId) {
        requestAnimationFrameId = window.requestAnimationFrame(animatePlanes)
      }
    }

    const handleMouseMove = (event) => {
      const rect = section.getBoundingClientRect()
      const isSectionVisible = rect.bottom >= 0 && rect.top <= window.innerHeight
      const isPointerInsideSection = event.clientX >= rect.left
        && event.clientX <= rect.right
        && event.clientY >= rect.top
        && event.clientY <= rect.bottom

      if (!isSectionVisible || !isPointerInsideSection) {
        resetPointer()
        return
      }

      const pointerX = clampUnit(((event.clientX - rect.left) / rect.width) * 2 - 1)
      const pointerY = clampUnit(((event.clientY - rect.top) / rect.height) * 2 - 1)
      const stageRect = phoneAnchor?.parentElement?.getBoundingClientRect()
      const tiltFrame = stageRect && stageRect.width > 0 && stageRect.height > 0 ? stageRect : rect
      const phoneCenterX = tiltFrame.left + tiltFrame.width * 0.5
      const phoneCenterY = tiltFrame.top + tiltFrame.height * 0.6
      const tiltReachX = Math.max(tiltFrame.width * 0.36, 220)
      const tiltReachY = Math.max(tiltFrame.height * 0.34, 220)
      const phoneTiltX = clampUnit((event.clientX - phoneCenterX) / tiltReachX)
      const phoneTiltY = clampUnit((event.clientY - phoneCenterY) / tiltReachY)

      lastSectionPointerMoveAt = window.performance.now()
      targetOffset.x = pointerX
      targetOffset.y = pointerY
      if (hasPointerBaseline) {
        targetPhoneRotation.x = basePhoneRotation.x
        targetPhoneRotation.y = basePhoneRotation.y
        targetPhoneRotation.z = basePhoneRotation.z
        targetDepthPointer.x = phoneTiltX
        targetDepthPointer.y = phoneTiltY
      } else {
        hasPointerBaseline = true
        resetPhonePoseTarget()
      }

      if (!requestAnimationFrameId) {
        requestAnimationFrameId = window.requestAnimationFrame(animatePlanes)
      }
    }

    const sectionObserver = new IntersectionObserver((entries) => {
      const hasRecentlyMovedInSection = window.performance.now() - lastSectionPointerMoveAt < 300
      if (!hasRecentlyMovedInSection && entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.24)) {
        resetPointer()
      }
    }, { threshold: [0, 0.24] })

    sectionObserver.observe(section)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      sectionObserver.disconnect()
      window.removeEventListener('mousemove', handleMouseMove)

      if (requestAnimationFrameId) {
        window.cancelAnimationFrame(requestAnimationFrameId)
      }

      gsap.set([...planes.filter(Boolean), phoneAnchor].filter(Boolean), { clearProps: 'transform' })

      if (phoneAnchor) {
        phoneAnchor.dataset.phoneRotationX = basePhoneRotation.x.toFixed(4)
        phoneAnchor.dataset.phoneRotationY = basePhoneRotation.y.toFixed(4)
        phoneAnchor.dataset.phoneRotationZ = basePhoneRotation.z.toFixed(4)
        phoneAnchor.dataset.phoneDepthPointerX = '0.0000'
        phoneAnchor.dataset.phoneDepthPointerY = '0.0000'
        window.dispatchEvent(new Event('phone-route-refresh'))
      }
    }
  }, [challengePhoneAnchorRef, challengePlaneRefs, challengesSectionRef])
}
