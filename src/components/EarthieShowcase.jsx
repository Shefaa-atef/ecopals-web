import { useEffect, useMemo, useRef } from 'react'
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
import bodyRiveUrl from '../assets/body.riv'
import armsRiveUrl from '../assets/arms_.riv'
import './EarthieShowcase.css'

const STATE_MACHINE = 'State Machine 1'
const PROGRESS_INPUT = 'progress'

const earthieCopy = {
  ar: {
    energy: 'الطاقة',
    name: 'أرض',
    states: ['حزينة', 'تتحسن', 'متفائلة', 'سعيدة', 'مزدهرة'],
  },
  en: {
    energy: 'Energy',
    name: 'Earthie',
    states: ['Sad', 'Waking up', 'Hopeful', 'Happy', 'Thriving'],
  },
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

export default function EarthieShowcase({ isAr, energy = 0 }) {
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
        <div className="earthie-status-header">
          <span className="earthie-energy-label">{copy.energy}</span>
          <span className="earthie-energy-value">{Math.round(energy)}%</span>
        </div>
        <div className="earthie-energy-track" aria-label={`${copy.energy} ${Math.round(energy)}%`}>
          <span style={{ inlineSize: `${energy}%` }} />
        </div>
        <p className="earthie-state-label">{copy.states[stateIndex]}</p>
      </div>
    </aside>
  )
}
