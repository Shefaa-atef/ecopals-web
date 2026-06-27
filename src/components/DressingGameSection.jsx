import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
import { Minus, Plus, RotateCcw, Shirt, SlidersHorizontal, Sparkles, Trash2, X } from 'lucide-react'
import FunTitleReveal from './FunTitleReveal'
import { playMenuSound } from '../utils/menuAudio'
import bodyRiveUrl from '../assets/body.riv'
import armsRiveUrl from '../assets/arms_.riv'
import './DressingGameSection.css'

const STATE_MACHINE = 'State Machine 1'
const PROGRESS_INPUT = 'progress'
const RIVE_PROGRESS = 100
const RIVE_MIN_DPR = 2
const RIVE_MAX_DPR = 3
const MIN_ITEM_SIZE = 0.12
const MAX_ITEM_SIZE = 0.78

const itemAssets = {
  eightiesHat: new URL('../assets/items/80s hat.svg', import.meta.url).href,
  arabWear: new URL('../assets/items/arab wear.svg', import.meta.url).href,
  bag: new URL('../assets/items/bag.svg', import.meta.url).href,
  belt: new URL('../assets/items/belt.svg', import.meta.url).href,
  businessTie: new URL('../assets/items/buisness tie.svg', import.meta.url).href,
  cowboyHat: new URL('../assets/items/cowboy hat.svg', import.meta.url).href,
  crown: new URL('../assets/items/crown.svg', import.meta.url).href,
  bow: new URL('../assets/items/cute bow.svg', import.meta.url).href,
  eyePatch: new URL('../assets/items/eye patch.svg', import.meta.url).href,
  flower: new URL('../assets/items/flower.svg', import.meta.url).href,
  funkyMustache: new URL('../assets/items/funky mostach.svg', import.meta.url).href,
  funnyHat: new URL('../assets/items/funny hat.svg', import.meta.url).href,
  goldEarrings: new URL('../assets/items/gold earings.svg', import.meta.url).href,
  graduationHat: new URL('../assets/items/graduation hat.svg', import.meta.url).href,
  hair: new URL('../assets/items/hair.svg', import.meta.url).href,
  magicGlasses: new URL('../assets/items/harry potter glasses.svg', import.meta.url).href,
  hijab: new URL('../assets/items/hijab.svg', import.meta.url).href,
  kingStick: new URL('../assets/items/king stick.svg', import.meta.url).href,
  mask: new URL('../assets/items/mask.svg', import.meta.url).href,
  moonBalloon: new URL('../assets/items/moon balloon.svg', import.meta.url).href,
  mustache: new URL('../assets/items/mostach.svg', import.meta.url).href,
  pinkEarrings: new URL('../assets/items/pink earrings.svg', import.meta.url).href,
  pinkWatch: new URL('../assets/items/pink watch.svg', import.meta.url).href,
  pirateHat: new URL('../assets/items/pirote hat.svg', import.meta.url).href,
  purse: new URL('../assets/items/purse.svg', import.meta.url).href,
  scarf: new URL('../assets/items/scarf.svg', import.meta.url).href,
  sunBalloon: new URL('../assets/items/sun balloon.svg', import.meta.url).href,
  glasses: new URL('../assets/items/sun glasses.svg', import.meta.url).href,
  wings: new URL('../assets/items/wings.svg', import.meta.url).href,
  winterHat: new URL('../assets/items/winter hat.svg', import.meta.url).href,
  witchHat: new URL('../assets/items/witch hat.svg', import.meta.url).href,
  yellowEarrings: new URL('../assets/items/yellow earrings.svg', import.meta.url).href,
  yellowWatch: new URL('../assets/items/yellow watch.svg', import.meta.url).href,
}

const dressingItems = [
  { key: 'crown', label: 'Solar crown', labelAr: 'تاج الشمس', src: itemAssets.crown, placement: { x: 0.5, y: 0.27, size: 0.26, layer: 12 } },
  { key: 'hijab', label: 'Soft hijab', labelAr: 'حجاب ناعم', src: itemAssets.hijab, placement: { x: 0.5, y: 0.34, size: 0.42, layer: 10 } },
  { key: 'glasses', label: 'Sun glasses', labelAr: 'نظارة شمسية', src: itemAssets.glasses, placement: { x: 0.5, y: 0.43, size: 0.25, layer: 13 } },
  { key: 'bow', label: 'Cute bow', labelAr: 'ربطة لطيفة', src: itemAssets.bow, placement: { x: 0.6, y: 0.31, size: 0.2, rotation: 8, layer: 13 } },
  { key: 'scarf', label: 'Leaf scarf', labelAr: 'وشاح', src: itemAssets.scarf, placement: { x: 0.5, y: 0.61, size: 0.27, rotation: -4, layer: 13 } },
  { key: 'wings', label: 'Garden wings', labelAr: 'أجنحة', src: itemAssets.wings, placement: { x: 0.5, y: 0.5, size: 0.68, layer: 2 } },
  { key: 'flower', label: 'Flower', labelAr: 'زهرة', src: itemAssets.flower, placement: { x: 0.66, y: 0.58, size: 0.2, rotation: 12, layer: 13 } },
  { key: 'bag', label: 'Eco bag', labelAr: 'حقيبة', src: itemAssets.bag, placement: { x: 0.68, y: 0.66, size: 0.26, rotation: -8, layer: 13 } },
  { key: 'yellowWatch', label: 'Yellow watch', labelAr: 'ساعة صفراء', src: itemAssets.yellowWatch, placement: { x: 0.65, y: 0.62, size: 0.16, rotation: 10, layer: 13 } },
  { key: 'graduationHat', label: 'Graduation hat', labelAr: 'قبعة تخرج', src: itemAssets.graduationHat, placement: { x: 0.5, y: 0.24, size: 0.34, rotation: -3, layer: 13 } },
  { key: 'eightiesHat', label: '80s hat', labelAr: 'قبعة الثمانينات', src: itemAssets.eightiesHat, placement: { x: 0.5, y: 0.24, size: 0.32, rotation: -4, layer: 13 } },
  { key: 'arabWear', label: 'Arab wear', labelAr: 'زي عربي', src: itemAssets.arabWear, placement: { x: 0.5, y: 0.64, size: 0.48, layer: 9 } },
  { key: 'belt', label: 'Belt', labelAr: 'حزام', src: itemAssets.belt, placement: { x: 0.5, y: 0.66, size: 0.3, rotation: -2, layer: 13 } },
  { key: 'businessTie', label: 'Business tie', labelAr: 'ربطة عمل', src: itemAssets.businessTie, placement: { x: 0.5, y: 0.6, size: 0.25, layer: 13 } },
  { key: 'cowboyHat', label: 'Cowboy hat', labelAr: 'قبعة رعاة', src: itemAssets.cowboyHat, placement: { x: 0.5, y: 0.25, size: 0.34, rotation: 3, layer: 13 } },
  { key: 'eyePatch', label: 'Eye patch', labelAr: 'رقعة عين', src: itemAssets.eyePatch, placement: { x: 0.48, y: 0.43, size: 0.2, rotation: -4, layer: 13 } },
  { key: 'funkyMustache', label: 'Funky mustache', labelAr: 'شارب مرح', src: itemAssets.funkyMustache, placement: { x: 0.5, y: 0.49, size: 0.24, layer: 13 } },
  { key: 'funnyHat', label: 'Funny hat', labelAr: 'قبعة مضحكة', src: itemAssets.funnyHat, placement: { x: 0.5, y: 0.23, size: 0.34, rotation: 5, layer: 13 } },
  { key: 'goldEarrings', label: 'Gold earrings', labelAr: 'أقراط ذهبية', src: itemAssets.goldEarrings, placement: { x: 0.5, y: 0.44, size: 0.42, layer: 12 } },
  { key: 'hair', label: 'Hair', labelAr: 'شعر', src: itemAssets.hair, placement: { x: 0.5, y: 0.31, size: 0.38, layer: 12 } },
  { key: 'magicGlasses', label: 'Magic glasses', labelAr: 'نظارة سحرية', src: itemAssets.magicGlasses, placement: { x: 0.5, y: 0.43, size: 0.24, layer: 13 } },
  { key: 'kingStick', label: 'King stick', labelAr: 'عصا الملك', src: itemAssets.kingStick, placement: { x: 0.66, y: 0.6, size: 0.38, rotation: -18, layer: 13 } },
  { key: 'mask', label: 'Mask', labelAr: 'قناع', src: itemAssets.mask, placement: { x: 0.5, y: 0.45, size: 0.28, layer: 13 } },
  { key: 'moonBalloon', label: 'Moon balloon', labelAr: 'بالون القمر', src: itemAssets.moonBalloon, placement: { x: 0.7, y: 0.27, size: 0.32, layer: 12 } },
  { key: 'mustache', label: 'Mustache', labelAr: 'شارب', src: itemAssets.mustache, placement: { x: 0.5, y: 0.5, size: 0.22, layer: 13 } },
  { key: 'pinkEarrings', label: 'Pink earrings', labelAr: 'أقراط وردية', src: itemAssets.pinkEarrings, placement: { x: 0.5, y: 0.44, size: 0.42, layer: 12 } },
  { key: 'pinkWatch', label: 'Pink watch', labelAr: 'ساعة وردية', src: itemAssets.pinkWatch, placement: { x: 0.65, y: 0.62, size: 0.16, rotation: 10, layer: 13 } },
  { key: 'pirateHat', label: 'Pirate hat', labelAr: 'قبعة قرصان', src: itemAssets.pirateHat, placement: { x: 0.5, y: 0.25, size: 0.34, rotation: -2, layer: 13 } },
  { key: 'purse', label: 'Purse', labelAr: 'حقيبة يد', src: itemAssets.purse, placement: { x: 0.69, y: 0.67, size: 0.24, rotation: -8, layer: 13 } },
  { key: 'sunBalloon', label: 'Sun balloon', labelAr: 'بالون الشمس', src: itemAssets.sunBalloon, placement: { x: 0.7, y: 0.27, size: 0.33, layer: 12 } },
  { key: 'winterHat', label: 'Winter hat', labelAr: 'قبعة شتوية', src: itemAssets.winterHat, placement: { x: 0.5, y: 0.24, size: 0.34, layer: 13 } },
  { key: 'witchHat', label: 'Witch hat', labelAr: 'قبعة ساحرة', src: itemAssets.witchHat, placement: { x: 0.5, y: 0.21, size: 0.42, rotation: -5, layer: 13 } },
  { key: 'yellowEarrings', label: 'Yellow earrings', labelAr: 'أقراط صفراء', src: itemAssets.yellowEarrings, placement: { x: 0.5, y: 0.44, size: 0.42, layer: 12 } },
]

const copy = {
  en: {
    kicker: 'Dress-up studio',
    title: 'Style Your EcoPal',
    subtitle: 'A playful closet of hats, charms, outfits, and tiny details for building a look that feels personal.',
    wardrobe: 'Wardrobe',
    close: 'Close wardrobe',
    reset: 'Clear look',
    remove: 'Remove',
    smaller: 'Smaller',
    larger: 'Larger',
    size: 'Size',
    noSelection: 'Style controls',
    addItem: (label) => `Add ${label}`,
    selectItem: (label) => `Select ${label}`,
  },
  ar: {
    kicker: 'استوديو اللبس',
    title: 'زيّن الإيكوبال',
    subtitle: 'خزانة مرحة مليئة بالقبعات والإكسسوارات والتفاصيل الصغيرة لصناعة شكل يليق بالإيكوبال.',
    wardrobe: 'الخزانة',
    close: 'إغلاق الخزانة',
    reset: 'مسح الشكل',
    remove: 'إزالة',
    smaller: 'تصغير',
    larger: 'تكبير',
    size: 'الحجم',
    noSelection: 'أدوات التنسيق',
    addItem: (label) => `إضافة ${label}`,
    selectItem: (label) => `اختيار ${label}`,
  },
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getSharpRiveDpr() {
  return Math.min(Math.max(window.devicePixelRatio || 1, RIVE_MIN_DPR), RIVE_MAX_DPR)
}

function createPlacedItem(item) {
  const id = window.crypto?.randomUUID?.() ?? `${item.key}-${Date.now()}`
  const placement = item.placement

  return {
    id,
    itemKey: item.key,
    x: placement.x,
    y: placement.y,
    size: placement.size,
    rotation: placement.rotation ?? 0,
    layer: placement.layer ?? 12,
  }
}

function DressingRiveLayer({ className, src }) {
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
    const observer = container ? new ResizeObserver(resizeLayer) : null

    resizeLayer()
    observer?.observe(container)

    const input = rive
      .stateMachineInputs(STATE_MACHINE)
      ?.find((stateMachineInput) => stateMachineInput.name === PROGRESS_INPUT)

    if (input) input.value = RIVE_PROGRESS

    const t1 = window.setTimeout(resizeLayer, 80)
    const t2 = window.setTimeout(resizeLayer, 300)

    return () => {
      observer?.disconnect()
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [rive])

  return <RiveComponent aria-hidden="true" className={`dressing-rive-layer ${className}`} />
}

export default function DressingGameSection({ isAr = false }) {
  const t = copy[isAr ? 'ar' : 'en']
  const stageRef = useRef(null)
  const [placedItems, setPlacedItems] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [movingItem, setMovingItem] = useState(null)
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false)

  const itemByKey = useMemo(() => (
    dressingItems.reduce((items, item) => ({ ...items, [item.key]: item }), {})
  ), [])

  const selectedPlacedItem = placedItems.find((item) => item.id === selectedId)
  const selectedWardrobeItem = selectedPlacedItem ? itemByKey[selectedPlacedItem.itemKey] : null

  const addItemToStage = useCallback((item, { closeWardrobe = false } = {}) => {
    playMenuSound('select')

    const existing = placedItems.find((placedItem) => placedItem.itemKey === item.key)

    if (existing) {
      setSelectedId(existing.id)
    } else {
      const nextItem = createPlacedItem(item)
      setPlacedItems((current) => [...current, nextItem])
      setSelectedId(nextItem.id)
    }

    if (closeWardrobe) {
      setIsWardrobeOpen(false)
    }
  }, [placedItems])

  const clearLook = useCallback(() => {
    setPlacedItems([])
    setSelectedId(null)
    playMenuSound('close')
  }, [])

  const removeSelectedItem = useCallback(() => {
    if (!selectedId) return

    setPlacedItems((current) => current.filter((item) => item.id !== selectedId))
    setSelectedId(null)
    playMenuSound('close')
  }, [selectedId])

  const updateSelectedSize = useCallback((nextSize) => {
    if (!selectedId) return

    setPlacedItems((current) => current.map((item) => (
      item.id === selectedId
        ? { ...item, size: clamp(nextSize, MIN_ITEM_SIZE, MAX_ITEM_SIZE) }
        : item
    )))
  }, [selectedId])

  function handleStagePointerDown(event) {
    if (event.target === event.currentTarget) {
      setSelectedId(null)
    }
  }

  function handlePlacedPointerDown(event, placedItem) {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    event.preventDefault()
    event.stopPropagation()

    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return

    setSelectedId(placedItem.id)
    setMovingItem({
      id: placedItem.id,
      originX: placedItem.x,
      originY: placedItem.y,
      startX: event.clientX,
      startY: event.clientY,
      stageWidth: rect.width,
      stageHeight: rect.height,
    })
    playMenuSound('hover')
  }

  useEffect(() => {
    if (!movingItem) return undefined

    const handlePointerMove = (event) => {
      const nextX = movingItem.originX + ((event.clientX - movingItem.startX) / movingItem.stageWidth)
      const nextY = movingItem.originY + ((event.clientY - movingItem.startY) / movingItem.stageHeight)

      setPlacedItems((current) => current.map((item) => (
        item.id === movingItem.id
          ? { ...item, x: clamp(nextX, 0.08, 0.92), y: clamp(nextY, 0.08, 0.92) }
          : item
      )))
    }

    const handlePointerUp = () => {
      setMovingItem(null)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [movingItem])

  function WardrobeGrid({ inSheet = false }) {
    return (
      <div className={`dressing-wardrobe-grid${inSheet ? ' dressing-wardrobe-grid--sheet' : ''}`}>
        {dressingItems.map((item) => {
          const label = isAr ? item.labelAr : item.label
          const isOnStage = placedItems.some((placedItem) => placedItem.itemKey === item.key)

          return (
            <button
              aria-label={t.addItem(label)}
              aria-pressed={isOnStage}
              className={`dressing-item ${isOnStage ? 'dressing-item--on-stage' : ''}`}
              key={item.key}
              onClick={() => addItemToStage(item, { closeWardrobe: inSheet })}
              onFocus={() => playMenuSound('hover')}
              onMouseEnter={() => playMenuSound('hover')}
              type="button"
            >
              <img alt="" aria-hidden="true" draggable="false" src={item.src} />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <section
      aria-labelledby="clothing-game-title"
      className={`dressing-game-section home-band-prep--clothing-game${isAr ? ' dressing-game-section--ar' : ''}`}
      dir={isAr ? 'rtl' : 'ltr'}
      id="clothing-game"
    >
      <div className="dressing-copy">
        <motion.p
          className="dressing-kicker"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.5 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <Sparkles aria-hidden="true" size={18} />
          <span>{t.kicker}</span>
        </motion.p>
        <h2 className="dressing-title" id="clothing-game-title">
          <FunTitleReveal text={t.title} delay={0.08} />
        </h2>
        <motion.p
          className="dressing-subtitle"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
          viewport={{ once: true, amount: 0.5 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {t.subtitle}
        </motion.p>
      </div>

      <div className="dressing-playground">
        <div className="dressing-stage-wrap">
          <div className="dressing-ecopal-stage" ref={stageRef} onPointerDown={handleStagePointerDown}>
            <span className="dressing-drop-ring" aria-hidden="true" />
            <div className="dressing-rive-stage">
              <DressingRiveLayer className="dressing-rive-layer--body" src={bodyRiveUrl} />
              <DressingRiveLayer className="dressing-rive-layer--arms" src={armsRiveUrl} />
            </div>

            {placedItems.map((placedItem) => {
              const item = itemByKey[placedItem.itemKey]
              if (!item) return null

              const label = isAr ? item.labelAr : item.label
              return (
                <button
                  aria-label={t.selectItem(label)}
                  className={`dressing-stage-item ${selectedId === placedItem.id ? 'dressing-stage-item--selected' : ''}`}
                  key={placedItem.id}
                  onFocus={() => setSelectedId(placedItem.id)}
                  onPointerDown={(event) => handlePlacedPointerDown(event, placedItem)}
                  style={{
                    '--item-x': `${placedItem.x * 100}%`,
                    '--item-y': `${placedItem.y * 100}%`,
                    '--item-size': `${placedItem.size * 100}%`,
                    '--item-rotation': `${placedItem.rotation}deg`,
                    zIndex: placedItem.layer,
                  }}
                  type="button"
                >
                  <img alt="" aria-hidden="true" draggable="false" src={item.src} />
                </button>
              )
            })}
          </div>

          <div className={`dressing-fit-panel${selectedPlacedItem ? '' : ' dressing-fit-panel--empty'}`}>
            <span className="dressing-fit-panel__label">
              <SlidersHorizontal aria-hidden="true" size={18} />
              {selectedWardrobeItem ? (isAr ? selectedWardrobeItem.labelAr : selectedWardrobeItem.label) : t.noSelection}
            </span>
            <div className="dressing-size-controls">
              <button
                aria-label={t.smaller}
                disabled={!selectedPlacedItem}
                onClick={() => updateSelectedSize((selectedPlacedItem?.size ?? 0.24) - 0.04)}
                type="button"
              >
                <Minus aria-hidden="true" size={18} />
              </button>
              <label className="dressing-size-slider">
                <span>{t.size}</span>
                <input
                  disabled={!selectedPlacedItem}
                  max={Math.round(MAX_ITEM_SIZE * 100)}
                  min={Math.round(MIN_ITEM_SIZE * 100)}
                  onChange={(event) => updateSelectedSize(Number(event.target.value) / 100)}
                  type="range"
                  value={Math.round((selectedPlacedItem?.size ?? 0.24) * 100)}
                />
              </label>
              <button
                aria-label={t.larger}
                disabled={!selectedPlacedItem}
                onClick={() => updateSelectedSize((selectedPlacedItem?.size ?? 0.24) + 0.04)}
                type="button"
              >
                <Plus aria-hidden="true" size={18} />
              </button>
              <button
                aria-label={t.remove}
                className="dressing-fit-panel__danger"
                disabled={!selectedPlacedItem}
                onClick={removeSelectedItem}
                type="button"
              >
                <Trash2 aria-hidden="true" size={18} />
              </button>
            </div>
            <button className="dressing-fit-panel__clear" type="button" onClick={clearLook}>
              <RotateCcw aria-hidden="true" size={18} />
              <span>{t.reset}</span>
            </button>
          </div>
        </div>

        <aside className="dressing-wardrobe dressing-wardrobe--dock" aria-label={t.wardrobe}>
          <div className="dressing-wardrobe__head">
            <Shirt aria-hidden="true" size={20} />
            <span>{t.wardrobe}</span>
          </div>
          <WardrobeGrid />
        </aside>

        <div className="dressing-mobile-actions">
          <button
            aria-expanded={isWardrobeOpen}
            className="dressing-mobile-closet-button"
            onClick={() => {
              setIsWardrobeOpen(true)
              playMenuSound('open')
            }}
            type="button"
          >
            <Shirt aria-hidden="true" size={22} />
            <span>{t.wardrobe}</span>
          </button>
          <button className="dressing-reset dressing-reset--mobile" type="button" onClick={clearLook}>
            <RotateCcw aria-hidden="true" size={18} />
            <span>{t.reset}</span>
          </button>
        </div>

      </div>

      {isWardrobeOpen && (
        <div className="dressing-closet-overlay" role="presentation" onMouseDown={() => setIsWardrobeOpen(false)}>
          <motion.div
            aria-label={t.wardrobe}
            aria-modal="true"
            className="dressing-closet-sheet"
            initial={{ opacity: 0, y: 42, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 42, scale: 0.96 }}
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="dressing-closet-sheet__head">
              <span>
                <Shirt aria-hidden="true" size={20} />
                {t.wardrobe}
              </span>
              <button aria-label={t.close} type="button" onClick={() => setIsWardrobeOpen(false)}>
                <X aria-hidden="true" size={20} />
              </button>
            </div>
            <WardrobeGrid inSheet />
          </motion.div>
        </div>
      )}
    </section>
  )
}
