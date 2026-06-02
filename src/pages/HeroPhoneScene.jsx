import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { heroState } from './heroState'
import earthieVideoUrl from '../assets/earthie video.mp4?url'
import phoneModelUrl from '../assets/low_poly_android_phone.glb?url'

export default function HeroPhoneScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 33 }}
      className="hero-phone-canvas"
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.25} />
      <directionalLight color="#fff4d6" intensity={2.3} position={[1.8, 3.4, 4]} />
      <directionalLight color="#dff6ff" intensity={1.5} position={[-3, 1.5, 2.5]} />
      <Suspense fallback={null}>
        <HeroPhoneModel />
      </Suspense>
    </Canvas>
  )
}

function useEarthieVideoTexture() {
  const videoTexture = useMemo(() => {
    const video = document.createElement('video')
    video.src = earthieVideoUrl
    video.loop = true
    video.muted = heroState.soundMuted
    video.defaultMuted = heroState.soundMuted
    video.playsInline = true
    video.preload = 'auto'
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')

    heroState.videoRef = video

    const texture = new THREE.VideoTexture(video)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.flipY = false
    texture.center.set(0.5, 0.5)
    texture.rotation = Math.PI / 2
    texture.repeat.set(-1, 1)

    return texture
  }, [])

  useEffect(() => {
    const video = videoTexture.image

    const startVideo = () => {
      video.play().catch(() => {
        video.muted = true
        video.defaultMuted = true
        video.setAttribute('muted', '')
        heroState.soundMuted = true
        video.play().catch(() => {})
      })
    }

    video.addEventListener('loadeddata', startVideo, { once: true })
    video.load()
    startVideo()

    return () => {
      video.removeEventListener('loadeddata', startVideo)
      video.pause()
      video.removeAttribute('src')
      video.load()
      videoTexture.dispose()
    }
  }, [videoTexture])

  return videoTexture
}

function HeroPhoneModel() {
  const groupRef = useRef(null)
  const { scene } = useGLTF(phoneModelUrl)
  const videoTexture = useEarthieVideoTexture()
  const phoneScene = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    phoneScene.traverse((node) => {
      if (!node.isMesh) return

      node.castShadow = true
      node.receiveShadow = true

      if (node.material?.name === 'phone_screen' || node.name.toLowerCase().includes('screen')) {
        node.material = new THREE.MeshBasicMaterial({
          color: videoTexture ? '#ffffff' : '#fff4d6',
          map: videoTexture,
          side: THREE.DoubleSide,
          toneMapped: false,
        })
        return
      }

      node.material = node.material.clone()
      node.material.roughness = 0.62
      node.material.metalness = 0.08
    })
  }, [phoneScene, videoTexture])

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const time = clock.elapsedTime
    groupRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.5) * 0.018
    groupRef.current.rotation.y = Math.PI / 2 + Math.sin(time * 0.44) * 0.055
    groupRef.current.rotation.z = Math.sin(time * 0.38) * 0.018
    groupRef.current.position.y = Math.sin(time * 0.68) * 0.035
  })

  return (
    <group ref={groupRef} scale={2.08}>
      <primitive object={phoneScene} />
    </group>
  )
}

useGLTF.preload(phoneModelUrl)
