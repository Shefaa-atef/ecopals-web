import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
import { Droplets, Recycle, Sprout } from 'lucide-react'
import { playMenuSound } from '../utils/menuAudio'
import bodyRiveUrl from '../assets/body.riv'
import armsRiveUrl from '../assets/arms_.riv'
import './EarthieShowcase.css'

const STATE_MACHINE = 'State Machine 1'
const PROGRESS_INPUT = 'progress'
const RIVE_MIN_DPR = 2
const RIVE_MAX_DPR = 3

function getSharpRiveDpr() {
  return Math.min(Math.max(window.devicePixelRatio || 1, RIVE_MIN_DPR), RIVE_MAX_DPR)
}

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
    actions: [
      { label: 'Recycle', value: '+10' },
      { label: 'Save water', value: '+8' },
      { label: 'Plant', value: '+15' },
    ],
  },
}

earthieCopy.ar.actions = [
  { label: '\u0625\u0639\u0627\u062f\u0629 \u062a\u062f\u0648\u064a\u0631', value: '+10' },
  { label: '\u062a\u0648\u0641\u064a\u0631 \u0627\u0644\u0645\u0627\u0621', value: '+8' },
  { label: '\u0632\u0631\u0627\u0639\u0629', value: '+15' },
]

const actionIcons = [Recycle, Droplets, Sprout]
const actionThresholds = [18, 48, 78]
const actionSounds = ['eco-recycle', 'eco-water', 'eco-plant']
const moodThresholds = [25, 50, 75, 100]

const chipStyles = [
  { '--chip-color': 'var(--fresh-leaf)', '--chip-color-rgb': '105 185 95', '--chip-bg': 'var(--light-leaf)' },
  { '--chip-color': 'var(--ocean-blue)', '--chip-color-rgb': '116 203 213', '--chip-bg': 'var(--light-aqua)' },
  { '--chip-color': 'var(--golden-yellow)', '--chip-color-rgb': '246 200 95', '--chip-bg': 'var(--light-cream)' },
]

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
  })

  useEffect(() => {
    if (!rive) return undefined

    const resizeLayer = () => {
      rive.resizeDrawingSurfaceToCanvas(getSharpRiveDpr())
      rive.startRendering()
    }

    const canvas = rive.canvas
    const container = canvas?.parentElement

    resizeLayer()

    const observer = container ? new ResizeObserver(resizeLayer) : null
    observer?.observe(container)

    // Re-sync drawing surface when the OS display scaling changes (e.g. moving
    // the window between monitors with different DPR on Windows/macOS).
    const dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    const handleDPRChange = () => resizeLayer()
    dprQuery.addEventListener('change', handleDPRChange)

    const t1 = window.setTimeout(resizeLayer, 80)
    const t2 = window.setTimeout(resizeLayer, 300)
    const t3 = window.setTimeout(resizeLayer, 800)

    return () => {
      observer?.disconnect()
      dprQuery.removeEventListener('change', handleDPRChange)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
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
  const previousEnergyRef = useRef(null)
  const displayEnergy = Math.round(energy / 25) * 25
  const stateIndex = Math.round(displayEnergy / 25)
  const roundedEnergy = Math.round(energy)

  useEffect(() => {
    const previousEnergy = previousEnergyRef.current
    previousEnergyRef.current = energy

    if (previousEnergy == null || energy <= previousEnergy) return

    const crossedActionIndex = actionThresholds.findLastIndex((threshold) => (
      previousEnergy < threshold && energy >= threshold
    ))

    if (crossedActionIndex >= 0) {
      playMenuSound(actionSounds[crossedActionIndex])
      return
    }

    const crossedMood = moodThresholds.some((threshold) => previousEnergy < threshold && energy >= threshold)
    if (crossedMood) {
      playMenuSound('eco-mood')
      return
    }

    // soft tick for gradual bar fill (throttled to every ~4% change)
    if (Math.floor(energy / 4) > Math.floor(previousEnergy / 4)) {
      playMenuSound('progress-tick')
    }
  }, [energy])

  return (
    <aside
      className={`earthie-showcase ${isAr ? 'earthie-showcase--ar' : ''}`}
      dir={isAr ? 'rtl' : 'ltr'}
      style={{ '--earthie-energy': energy / 100, '--earthie-energy-pct': `${energy}%` }}
    >
      <motion.div
        className="earthie-meter-shell"
        initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
      >
        <motion.div
          className="earthie-meter-ring"
          aria-hidden="true"
          initial={{ scale: 0.4, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.28 }}
        />
        <div className="earthie-rive-stage">
          <RiveLayer className="earthie-rive-layer--body" progress={energy} src={bodyRiveUrl} />
          <RiveLayer className="earthie-rive-layer--arms" progress={energy} src={armsRiveUrl} />
        </div>

        <motion.div
          className="earthie-meter-readout"
          aria-live="polite"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.42 }}
        >
          <span className="earthie-energy-label">{copy.energy}</span>
          <span className="earthie-energy-value">{roundedEnergy}%</span>
          <span className="earthie-state-label">{copy.states[stateIndex]}</span>
        </motion.div>
      </motion.div>

      <div className="earthie-action-row" aria-label={`${copy.energy} ${roundedEnergy}%`}>
        {copy.actions.map((action, index) => {
          const Icon = actionIcons[index]
          const isActive = energy >= actionThresholds[index]

          return (
            <div
              className={`earthie-action-chip ${isActive ? 'earthie-action-chip--active' : ''}`}
              data-earthie-chip=""
              key={action.label}
              style={chipStyles[index]}
            >
              <span className="earthie-action-icon" aria-hidden="true">
                <Icon size={20} strokeWidth={2.5} />
              </span>
              <span className="earthie-action-text">{action.label}</span>
              <span className="earthie-action-value">{action.value}</span>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
