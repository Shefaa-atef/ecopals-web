import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { getHeroSoundMuted, setHeroSoundMuted, setHeroVideoRef } from './heroState'
import earthieVideoUrl from '../assets/earthie video.mp4?url'
import phoneModelUrl from '../assets/low_poly_android_phone.glb?url'
import communityArUrl from '../assets/community_ar.jpg'
import communityEnUrl from '../assets/community_en.jpg'

const DEFAULT_PHONE_MODEL_POSE = {
  rotationX: Math.PI / 2,
  rotationY: Math.PI / 2,
  rotationZ: 0,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  scale: 2.08,
  floatAmount: 1,
}

export default function HeroPhoneScene({ modelPose = DEFAULT_PHONE_MODEL_POSE, screenContent = 'earthie-video' }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 33 }}
      className="hero-phone-canvas"
      dpr={[1.5, 3]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={1.25} />
      <directionalLight color="#fff4d6" intensity={2.3} position={[1.8, 3.4, 4]} />
      <directionalLight color="#dff6ff" intensity={1.5} position={[-3, 1.5, 2.5]} />
      <Suspense fallback={null}>
        <HeroPhoneModel modelPose={modelPose} screenContent={screenContent} />
      </Suspense>
    </Canvas>
  )
}

function useEarthieVideoTexture(enabled) {
  const videoTexture = useMemo(() => {
    if (!enabled) return null

    const video = document.createElement('video')
    video.src = earthieVideoUrl
    video.loop = true
    video.muted = getHeroSoundMuted()
    video.defaultMuted = getHeroSoundMuted()
    video.playsInline = true
    video.preload = 'auto'
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')

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
        video.play().catch(() => {})
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

function useCommunityTexture(screenContent) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    const isAr = screenContent === 'community-ar'
    const isEn = screenContent === 'community-en'
    if (!isAr && !isEn) {
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
    loader.load(isAr ? communityArUrl : communityEnUrl, (tex) => {
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
      tex.generateMipmaps = false
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.NearestFilter
      tex.anisotropy = 16
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
  }, [screenContent])

  return texture
}

function HeroPhoneModel({ modelPose, screenContent }) {
  const groupRef = useRef(null)
  const poseRef = useRef(modelPose)
  const { scene } = useGLTF(phoneModelUrl)
  const videoTexture = useEarthieVideoTexture(screenContent === 'earthie-video')
  const communityTexture = useCommunityTexture(screenContent)
  const screenTexture = videoTexture ?? communityTexture
  const phoneScene = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    poseRef.current = modelPose
  }, [modelPose])

  useEffect(() => {
    phoneScene.traverse((node) => {
      if (!node.isMesh) return

      node.castShadow = true
      node.receiveShadow = true

      if (node.material?.name === 'phone_screen' || node.name.toLowerCase().includes('screen')) {
        node.material = new THREE.MeshBasicMaterial({
          color: '#ffffff',
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
  }, [phoneScene, screenTexture])

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const time = clock.elapsedTime
    const pose = poseRef.current ?? DEFAULT_PHONE_MODEL_POSE
    const floatAmount = pose.floatAmount ?? 1

    groupRef.current.rotation.x = (pose.rotationX ?? DEFAULT_PHONE_MODEL_POSE.rotationX) + Math.sin(time * 0.5) * 0.018 * floatAmount
    groupRef.current.rotation.y = (pose.rotationY ?? DEFAULT_PHONE_MODEL_POSE.rotationY) + Math.sin(time * 0.44) * 0.055 * floatAmount
    groupRef.current.rotation.z = (pose.rotationZ ?? DEFAULT_PHONE_MODEL_POSE.rotationZ) + Math.sin(time * 0.38) * 0.018 * floatAmount
    groupRef.current.position.x = pose.positionX ?? 0
    groupRef.current.position.y = (pose.positionY ?? 0) + Math.sin(time * 0.68) * 0.035 * floatAmount
    groupRef.current.position.z = pose.positionZ ?? 0
    groupRef.current.scale.setScalar(pose.scale ?? DEFAULT_PHONE_MODEL_POSE.scale)
  })

  return (
    <group ref={groupRef} scale={modelPose.scale ?? DEFAULT_PHONE_MODEL_POSE.scale}>
      <primitive object={phoneScene} />
    </group>
  )
}

useGLTF.preload(phoneModelUrl)
