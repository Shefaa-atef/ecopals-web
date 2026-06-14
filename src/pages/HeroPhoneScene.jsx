import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { getHeroSoundMuted, setHeroSoundMuted, setHeroVideoRef } from './heroState'
import earthieVideoUrl from '../assets/earthie video.mp4?url'
import phoneModelUrl from '../assets/low_poly_android_phone.glb?url'
import communityArUrl from '../assets/community_ar.jpg'
import communityEnUrl from '../assets/community_en.jpg'
import challengesArUrl from '../assets/challenges_ar.jpg'
import challengesEnUrl from '../assets/challenges_en.jpg'

const DEFAULT_PHONE_MODEL_POSE = {
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
}

const PHONE_CANVAS_DPR = [2, 3]

export default function HeroPhoneScene({ modelPose = DEFAULT_PHONE_MODEL_POSE, screenContent = 'earthie-video' }) {
  const depthMotion = modelPose.depthMotion ?? 0
  const depthAutoMotion = THREE.MathUtils.clamp(modelPose.depthAutoMotion ?? 1, 0, 1)
  const depthPointerX = THREE.MathUtils.clamp(modelPose.depthPointerX ?? 0, -1, 1)

  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 33 }}
      className="hero-phone-canvas"
      dpr={PHONE_CANVAS_DPR}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={1.25} />
      <directionalLight color="#fff1c7" intensity={2.3} position={[1.8, 3.4, 4]} />
      <directionalLight color="#e3faf5" intensity={1.5} position={[-3, 1.5, 2.5]} />
      <DepthPhoneLights amount={depthMotion} autoMotion={depthAutoMotion} pointerX={depthPointerX} />
      <Suspense fallback={null}>
        <HeroPhoneModel modelPose={modelPose} screenContent={screenContent} />
      </Suspense>
    </Canvas>
  )
}

function DepthPhoneLights({ amount, autoMotion = 1, pointerX = 0 }) {
  const leftRimRef = useRef(null)
  const rightRimRef = useRef(null)
  const highlightRef = useRef(null)
  const amountRef = useRef(amount)
  const autoMotionRef = useRef(autoMotion)
  const pointerXRef = useRef(pointerX)

  useEffect(() => {
    amountRef.current = amount
    autoMotionRef.current = autoMotion
    pointerXRef.current = pointerX
  }, [amount, autoMotion, pointerX])

  useFrame(({ clock }) => {
    const activeAmount = amountRef.current
    const activeAutoMotion = autoMotionRef.current
    const manualMotion = 1 - activeAutoMotion
    const activePointerX = pointerXRef.current
    if (!leftRimRef.current || !rightRimRef.current || !highlightRef.current) return

    const time = clock.elapsedTime
    const sweep = Math.sin(time * 0.32) * activeAutoMotion + activePointerX * manualMotion
    const glint = ((Math.sin(time * 0.48 + 1.1) + 1) * 0.5) * activeAutoMotion
      + (0.48 + Math.abs(activePointerX) * 0.28) * manualMotion

    leftRimRef.current.intensity = activeAmount * (0.85 + glint * 0.25)
    rightRimRef.current.intensity = activeAmount * (0.7 + (1 - glint) * 0.22)
    highlightRef.current.intensity = activeAmount * (0.35 + glint * 0.25)
    highlightRef.current.position.x = sweep * 0.85
  })

  return (
    <>
      <directionalLight ref={leftRimRef} color="#e7fff4" intensity={0} position={[-3.2, 1.4, 3.4]} />
      <directionalLight ref={rightRimRef} color="#fff1c8" intensity={0} position={[3.2, 1.7, 2.9]} />
      <pointLight ref={highlightRef} color="#ffffff" intensity={0} position={[0, 2.2, 3.2]} distance={6} />
    </>
  )
}

function updateScreenTextureParallax(
  texture,
  screenContent,
  depthMotion,
  time,
  depthPointerX = 0,
  depthPointerY = 0,
  depthAutoMotion = 1,
) {
  if (!texture) return

  const isVideo = screenContent === 'earthie-video'
  const amount = depthMotion * (isVideo ? 1 : 0.55)
  const autoAmount = depthAutoMotion
  const manualAmount = 1 - depthAutoMotion
  const sway = Math.sin(time * 0.32) * autoAmount + depthPointerX * manualAmount
  const lift = Math.sin(time * 0.28 + 0.7) * autoAmount + depthPointerY * manualAmount
  const baseRepeatX = isVideo ? -1 : 1
  const zoom = 1 - amount * (0.026 + Math.abs(sway) * 0.006)

  texture.offset.set(sway * 0.024 * amount, lift * 0.016 * amount)
  texture.repeat.set(baseRepeatX * zoom, zoom)
  texture.updateMatrix()
}

function useEarthieVideoTexture(enabled) {
  const videoTexture = useMemo(() => {
    if (!enabled) return null

    const startsMuted = getHeroSoundMuted()
    const video = document.createElement('video')
    video.src = earthieVideoUrl
    video.loop = true
    video.muted = startsMuted
    video.defaultMuted = startsMuted
    video.playsInline = true
    video.preload = 'auto'
    video.setAttribute('playsinline', '')

    if (startsMuted) {
      video.setAttribute('muted', '')
    } else {
      video.removeAttribute('muted')
    }

    const texture = new THREE.VideoTexture(video)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.flipY = false
    texture.center.set(0.5, 0.5)
    texture.rotation = Math.PI / 2
    texture.repeat.set(-1, 1)

    return texture
  }, [enabled])

  useEffect(() => {
    if (!videoTexture) {
      setHeroVideoRef(null)
      return undefined
    }

    const video = videoTexture.image
    setHeroVideoRef(video)

    const startVideo = () => {
      video.play().catch(() => {
        video.muted = true
        video.defaultMuted = true
        video.setAttribute('muted', '')
        setHeroSoundMuted(true)
        video.play().catch(() => { })
      })
    }

    video.addEventListener('loadeddata', startVideo, { once: true })
    video.load()
    startVideo()

    return () => {
      setHeroVideoRef(null)
      video.removeEventListener('loadeddata', startVideo)
      video.pause()
      video.removeAttribute('src')
      video.load()
      videoTexture.dispose()
    }
  }, [videoTexture])

  return videoTexture
}

const staticScreenImages = {
  'community-ar': communityArUrl,
  'community-en': communityEnUrl,
  'challenges-ar': challengesArUrl,
  'challenges-en': challengesEnUrl,
}

function useStaticScreenTexture(screenContent) {
  const [texture, setTexture] = useState(null)
  const gl = useThree((state) => state.gl)
  const maxAnisotropy = gl.capabilities.getMaxAnisotropy()

  useEffect(() => {
    const screenImageUrl = staticScreenImages[screenContent]

    if (!screenImageUrl) {
      const frame = window.requestAnimationFrame(() => {
        setTexture((prev) => {
          prev?.dispose()
          return null
        })
      })
      return () => window.cancelAnimationFrame(frame)
    }

    let active = true
    const loader = new THREE.TextureLoader()
    loader.load(screenImageUrl, (tex) => {
      if (!active) {
        tex.dispose()
        return
      }

      tex.colorSpace = THREE.SRGBColorSpace
      tex.flipY = true
      tex.center.set(0.5, 0.5)
      tex.rotation = 0
      tex.offset.set(0, 0)
      tex.repeat.set(1, 1)
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
      tex.generateMipmaps = true
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.anisotropy = maxAnisotropy
      tex.needsUpdate = true
      setTexture(tex)
    })

    return () => {
      active = false
      setTexture((prev) => {
        prev?.dispose()
        return null
      })
    }
  }, [maxAnisotropy, screenContent])

  return texture
}

function HeroPhoneModel({ modelPose, screenContent }) {
  const groupRef = useRef(null)
  const poseRef = useRef(modelPose)
  const screenContentRef = useRef(screenContent)
  const screenMeshesRef = useRef([])
  const { scene } = useGLTF(phoneModelUrl)
  const videoTexture = useEarthieVideoTexture(screenContent === 'earthie-video')
  const staticScreenTexture = useStaticScreenTexture(screenContent)
  const screenTexture = videoTexture ?? staticScreenTexture
  const phoneScene = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    poseRef.current = modelPose
  }, [modelPose])

  useEffect(() => {
    screenContentRef.current = screenContent
  }, [screenContent])

  useEffect(() => {
    screenMeshesRef.current = []

    phoneScene.traverse((node) => {
      if (!node.isMesh) return

      node.castShadow = true
      node.receiveShadow = true
      node.userData.depthBasePosition ??= node.position.clone()

      const isScreenMesh = node.userData.isPhoneScreen || node.material?.name === 'phone_screen' || node.name.toLowerCase().includes('screen')

      if (isScreenMesh) {
        node.userData.isPhoneScreen = true
        screenMeshesRef.current.push({
          basePosition: node.userData.depthBasePosition,
          mesh: node,
        })
        node.material = new THREE.MeshBasicMaterial({
          color: screenContent === 'recycle-portal' ? '#0e3520' : '#ffffff',
          map: screenTexture,
          side: THREE.DoubleSide,
          toneMapped: false,
        })
        return
      }

      node.material = node.material.clone()
      node.material.roughness = 0.62
      node.material.metalness = 0.08
    })
  }, [phoneScene, screenTexture, screenContent])

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const time = clock.elapsedTime
    const pose = poseRef.current ?? DEFAULT_PHONE_MODEL_POSE
    const floatAmount = pose.floatAmount ?? 1
    const depthMotion = pose.depthMotion ?? 0
    const depthAutoMotion = THREE.MathUtils.clamp(pose.depthAutoMotion ?? 1, 0, 1)
    const depthPointerX = THREE.MathUtils.clamp(pose.depthPointerX ?? 0, -1, 1)
    const depthPointerY = THREE.MathUtils.clamp(pose.depthPointerY ?? 0, -1, 1)
    const autoDepthMotion = depthMotion * depthAutoMotion
    const manualDepthMotion = depthMotion * (1 - depthAutoMotion)
    const legacyFloat = floatAmount * (1 - depthMotion * 0.38)
    const yaw = Math.sin(time * 0.32) * 0.068 * autoDepthMotion + depthPointerX * 0.62 * manualDepthMotion
    const tilt = Math.sin(time * 0.28 + 0.7) * 0.024 * autoDepthMotion - depthPointerY * 0.36 * manualDepthMotion
    const roll = Math.sin(time * 0.24 + 1.6) * 0.01 * autoDepthMotion - depthPointerX * 0.035 * manualDepthMotion

    groupRef.current.rotation.x = (pose.rotationX ?? DEFAULT_PHONE_MODEL_POSE.rotationX) + Math.sin(time * 0.5) * 0.014 * legacyFloat + tilt
    groupRef.current.rotation.y = (pose.rotationY ?? DEFAULT_PHONE_MODEL_POSE.rotationY) + Math.sin(time * 0.44) * 0.032 * legacyFloat + yaw
    groupRef.current.rotation.z = (pose.rotationZ ?? DEFAULT_PHONE_MODEL_POSE.rotationZ) + Math.sin(time * 0.38) * 0.012 * legacyFloat + roll
    groupRef.current.position.x = pose.positionX ?? 0
    groupRef.current.position.y = (pose.positionY ?? 0) + Math.sin(time * 0.68) * 0.035 * floatAmount
    groupRef.current.position.z = pose.positionZ ?? 0
    groupRef.current.scale.setScalar(pose.scale ?? DEFAULT_PHONE_MODEL_POSE.scale)

    const screenParallaxX = (Math.sin(time * 0.32 + 0.28) * autoDepthMotion + depthPointerX * manualDepthMotion) * 0.018
    const screenParallaxY = (Math.sin(time * 0.28 + 0.7) * autoDepthMotion + depthPointerY * manualDepthMotion) * 0.006
    const screenLift = (0.009 + Math.cos(time * 0.32) * 0.004 * depthAutoMotion) * depthMotion
    const screenShade = 1 - depthMotion * 0.045 + ((Math.sin(time * 0.32 + 0.9) + 1) * depthAutoMotion + Math.abs(depthPointerX) * manualDepthMotion) * 0.032 * depthMotion

    updateScreenTextureParallax(
      screenTexture,
      screenContent,
      depthMotion,
      time,
      depthPointerX,
      depthPointerY,
      depthAutoMotion,
    )

    const isColorScreen = screenContentRef.current === 'recycle-portal'

    screenMeshesRef.current.forEach(({ mesh, basePosition }) => {
      mesh.position.set(
        basePosition.x + screenParallaxX,
        basePosition.y + screenParallaxY,
        basePosition.z + screenLift,
      )

      // Skip the shade override for solid-color screens — their color is
      // set once in the material useEffect and must not be overwritten here.
      if (mesh.material?.color && !isColorScreen) {
        mesh.material.color.setRGB(screenShade, screenShade, screenShade)
      }
    })
  })

  return (
    <group ref={groupRef} scale={modelPose.scale ?? DEFAULT_PHONE_MODEL_POSE.scale}>
      <primitive object={phoneScene} />
    </group>
  )
}

useGLTF.preload(phoneModelUrl)
