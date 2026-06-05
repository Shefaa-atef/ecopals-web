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

    const canvas = rive.canvas
    const container = canvas?.parentElement

    resizeLayer()

    const observer = container ? new ResizeObserver(resizeLayer) : null
    observer?.observe(container)

    const timeoutId = window.setTimeout(resizeLayer, 120)

    return () => {
      observer?.disconnect()
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
            <motion.div
              className={`earthie-action-chip ${isActive ? 'earthie-action-chip--active' : ''}`}
              key={action.label}
              initial={{ opacity: 0, y: 28, scale: 0.88 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.55 + index * 0.12 }}
            >
              <span className="earthie-action-icon" aria-hidden="true">
                <Icon size={17} strokeWidth={2.7} />
              </span>
              <span className="earthie-action-text">{action.label}</span>
              <span className="earthie-action-value">{action.value}</span>
            </motion.div>
          )
        })}
      </div>
    </aside>
  )
}
