import { useEffect, useMemo, useRef, useState } from 'react'
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
import bodyRiveUrl from '../assets/body.riv'
import armsRiveUrl from '../assets/arms_.riv'
import './EarthieShowcase.css'

const STATE_MACHINE = 'State Machine 1'
const PROGRESS_INPUT = 'progress'

const earthieCopy = {
  ar: {
    energy: '\u0627\u0644\u0637\u0627\u0642\u0629',
    name: '\u0623\u0631\u0636',
    states: ['\u062d\u0632\u064a\u0646\u0629', '\u062a\u062a\u062d\u0633\u0646', '\u0645\u062a\u0641\u0627\u0626\u0644\u0629', '\u0633\u0639\u064a\u062f\u0629', '\u0645\u0632\u062f\u0647\u0631\u0629'],
  },
  en: {
    energy: 'Energy',
    name: 'Earthie',
    states: ['Sad', 'Waking up', 'Hopeful', 'Happy', 'Thriving'],
  },
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getSectionProgress(sectionId) {
  const section = document.getElementById(sectionId)
  if (!section) return 0

  const sectionTop = section.getBoundingClientRect().top + window.scrollY
  const scrollable = section.offsetHeight - window.innerHeight
  if (scrollable <= 0) return 0

  return clamp((window.scrollY - sectionTop) / scrollable, 0, 1)
}

function useScrollEnergy(sectionId) {
  const [energy, setEnergy] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    function updateEnergy() {
      rafRef.current = null
      setEnergy(clamp(getSectionProgress(sectionId) * 100, 0, 100))
    }

    function scheduleUpdate() {
      if (rafRef.current) return
      rafRef.current = window.requestAnimationFrame(updateEnergy)
    }

    updateEnergy()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current)
      }

      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [sectionId])

  return energy
}

function RiveLayer({ className, progress, src }) {
  const layout = useMemo(() => new Layout({
    alignment: Alignment.Center,
    fit: Fit.Contain,
  }), [])

  const { rive, RiveComponent } = useRive({
    autoplay: true,
    layout,
    src,
    stateMachines: STATE_MACHINE,
  }, {
    shouldResizeCanvasToContainer: true,
  })

  useEffect(() => {
    if (!rive) return undefined

    const resizeLayer = () => {
      rive.resizeDrawingSurfaceToCanvas()
      rive.startRendering()
    }

    const frameId = window.requestAnimationFrame(resizeLayer)
    const timeoutId = window.setTimeout(resizeLayer, 120)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
    }
  }, [rive])

  useEffect(() => {
    const input = rive
      ?.stateMachineInputs(STATE_MACHINE)
      ?.find((stateMachineInput) => stateMachineInput.name === PROGRESS_INPUT)

    if (input) {
      input.value = progress
    }
  }, [progress, rive])

  return <RiveComponent aria-hidden="true" className={`earthie-rive-layer ${className}`} />
}

export default function EarthieShowcase({ isAr, sectionId = 'game' }) {
  const energy = useScrollEnergy(sectionId)
  const copy = isAr ? earthieCopy.ar : earthieCopy.en
  const displayEnergy = Math.round(energy / 25) * 25
  const stateIndex = Math.round(displayEnergy / 25)

  return (
    <aside
      className={`earthie-showcase ${isAr ? 'earthie-showcase--ar' : ''}`}
      dir={isAr ? 'rtl' : 'ltr'}
      style={{ '--earthie-energy': energy / 100 }}
    >
      <div className="earthie-rive-stage">
        <RiveLayer className="earthie-rive-layer--body" progress={energy} src={bodyRiveUrl} />
        <RiveLayer className="earthie-rive-layer--arms" progress={energy} src={armsRiveUrl} />
      </div>

      <div className="earthie-status" aria-live="polite">
        <div className="earthie-status-row">
          <strong>{copy.name}</strong>
          <span>{Math.round(energy)}%</span>
        </div>
        <div className="earthie-energy-track" aria-label={`${copy.energy} ${Math.round(energy)}%`}>
          <span style={{ inlineSize: `${energy}%` }} />
        </div>
        <p>{copy.states[stateIndex]}</p>
      </div>
    </aside>
  )
}
