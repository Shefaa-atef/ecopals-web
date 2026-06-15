import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Globe2, Menu, X } from 'lucide-react'
import { legalNavItems, mainNavItems } from '../constants/nav'
import {
  TILE_TILTS,
  menuColorLayer,
  menuColorLayers,
  menuLegalLink,
  menuPanel,
  menuTile,
} from '../constants/animations'
import { getPublicPath } from '../utils/routing'
import { playMenuSound } from '../utils/menuAudio'
import { useLang } from '../context/LanguageContext'
import MenuIconTrail from './MenuIconTrail'
import logoUrl from '../assets/logo@4x.png'
import './GameHeader.css'

function LeafSvg({ fill }) {
  return (
    <svg viewBox="0 0 20 28" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 1 C18 6 19 18 10 27 C1 18 2 6 10 1 Z" fill={fill} />
      <path d="M10 27 Q10.6 17 10 3" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  )
}

export default function GameHeader({ route, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { lang, toggleLang, isAr } = useLang()

  useEffect(() => {
    if (!isMenuOpen) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        playMenuSound('close')
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isMenuOpen])

  function handleItemClick(event, item) {
    const didNavigate = onNavigate(event, item.path, item.hash)

    if (didNavigate) {
      if (isMenuOpen) playMenuSound('select')
      setIsMenuOpen(false)
    }
  }

  function handleMenuToggle() {
    const nextIsOpen = !isMenuOpen
    playMenuSound(nextIsOpen ? 'open' : 'close')
    setIsMenuOpen(nextIsOpen)
  }

  function handleMenuClose() {
    playMenuSound('close')
    setIsMenuOpen(false)
  }

  function handleLangToggle() {
    playMenuSound('lang')
    toggleLang()
  }

  return (
    <header className={`site-header${isMenuOpen ? ' site-header--menu-open' : ''}`}>
      <div className="nav-stage">
        <motion.a
          aria-label={isAr ? 'إيكوبالز الرئيسية' : 'Ecopals home'}
          animate={{ y: [0, -4, 0] }}
          className="brand"
          href={getPublicPath('/')}
          onClick={(event) => handleItemClick(event, mainNavItems[0])}
          transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
          whileHover={{ rotate: -4, scale: 1.08, y: -6 }}
          whileTap={{ scale: 0.94 }}
        >
          <span className="brand-orbit" aria-hidden="true">
            <img className="brand-logo" src={logoUrl} alt="" />
          </span>
        </motion.a>

        <div className="nav-controls">
          <motion.button
            aria-label={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
            animate={{ rotate: [0, 1.5, -1, 0], y: [0, -4, 0] }}
            className="lang-button"
            onMouseEnter={() => playMenuSound('hover')}
            onFocus={() => playMenuSound('hover')}
            onClick={handleLangToggle}
            transition={{
              rotate: { duration: 5.8, ease: 'easeInOut', repeat: Infinity },
              y: { duration: 3.9, ease: 'easeInOut', repeat: Infinity },
            }}
            type="button"
            whileHover={{ scale: 1.1, y: -6 }}
            whileTap={{ scale: 0.9 }}
          >
            <Globe2 aria-hidden="true" size={14} className="lang-globe" />
            <AnimatePresence mode="wait">
              <motion.span
                key={lang}
                className={`lang-code lang-code--${isAr ? 'ar' : 'en'}`}
                initial={{ opacity: 0, rotateX: -90, scale: 0.7 }}
                animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                exit={{ opacity: 0, rotateX: 90, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 420, damping: 20 }}
              >
                {isAr ? 'EN' : 'ع'}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <motion.button
            aria-controls="game-menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? (isAr ? 'إغلاق القائمة' : 'Close menu') : (isAr ? 'فتح القائمة' : 'Open menu')}
            animate={
              isMenuOpen
                ? { rotate: 90, scale: 1 }
                : { rotate: [0, 2, -1.5, 0], y: [0, -5, 0] }
            }
            className="menu-button"
            onClick={handleMenuToggle}
            transition={
              isMenuOpen
                ? { type: 'spring', stiffness: 260, damping: 18 }
                : {
                    rotate: { duration: 6.2, ease: 'easeInOut', repeat: Infinity },
                    y: { duration: 4.6, ease: 'easeInOut', repeat: Infinity },
                  }
            }
            type="button"
            whileHover={{ scale: 1.08, y: -6 }}
            whileTap={{ scale: 0.92 }}
          >
            {isMenuOpen ? <X aria-hidden="true" size={27} /> : <Menu aria-hidden="true" size={28} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.button
              aria-label={isAr ? 'إغلاق القائمة' : 'Close menu'}
              className="menu-backdrop"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleMenuClose}
              type="button"
            />

            <motion.div
              aria-hidden="true"
              className="menu-prelayers"
              exit="exit"
              initial="initial"
            >
              {menuColorLayers.map((color, index) => (
                <motion.span
                  className="menu-prelayer"
                  custom={index}
                  key={color}
                  animate="enter"
                  exit="exit"
                  initial="initial"
                  style={{ '--prelayer-color': color }}
                  variants={menuColorLayer}
                />
              ))}
            </motion.div>

            <motion.aside
              animate="enter"
              aria-label={isAr ? 'قائمة التنقل' : 'Game navigation'}
              className="game-menu"
              exit="exit"
              id="game-menu"
              initial="initial"
              variants={menuPanel}
            >
              <motion.button
                aria-label={isAr ? 'إغلاق القائمة' : 'Close menu'}
                className={`menu-close-btn${isAr ? ' menu-close-btn--ar' : ''}`}
                type="button"
                onClick={handleMenuClose}
                onMouseEnter={() => playMenuSound('hover')}
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 320, damping: 18, delay: 0.32 } }}
                exit={{ opacity: 0, scale: 0.5, rotate: 12, transition: { duration: 0.14 } }}
                whileHover={{ y: -4, scale: 1.04, transition: { type: 'spring', stiffness: 380, damping: 14 } }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="menu-close-btn__icon" aria-hidden="true">
                  <X size={20} />
                </span>
                <span className={isAr ? 'menu-close-btn__label menu-close-btn__label--ar' : 'menu-close-btn__label'}>
                  {isAr ? 'إغلاق' : 'Close'}
                </span>
              </motion.button>

              {/* Floating eco particles — mirrors loading screen / hero style */}
              <div className="menu-particles" aria-hidden="true">
                <span className="mp mp--leaf mp--l1"><LeafSvg fill="#3a7d47" /></span>
                <span className="mp mp--leaf mp--l2"><LeafSvg fill="#2f6f3e" /></span>
                <span className="mp mp--leaf mp--l3"><LeafSvg fill="#2f6f3e" /></span>
                <span className="mp mp--leaf mp--l4"><LeafSvg fill="#3a7d47" /></span>
                <span className="mp mp--leaf mp--l5"><LeafSvg fill="#3a7d47" /></span>
                <span className="mp mp--leaf mp--l6"><LeafSvg fill="#4a9060" /></span>
                <span className="mp mp--leaf mp--l7"><LeafSvg fill="#2f6f3e" /></span>
                <span className="mp mp--star mp--s1" />
                <span className="mp mp--star mp--s2" />
                <span className="mp mp--star mp--s3" />
                <span className="mp mp--star mp--s4" />
                <span className="mp mp--drop mp--d1" />
                <span className="mp mp--drop mp--d2" />
                <span className="mp mp--drop mp--d3" />
              </div>

              <MenuIconTrail />

              {/* Section label */}
              <p className="menu-eyebrow" aria-hidden="true">MAIN MENU</p>

              {/* Main navigation tiles */}
              <nav
                className={`menu-tiles${isAr ? ' menu-tiles--rtl' : ''}`}
                aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}
              >
                {mainNavItems.map((item, index) => (
                  <motion.a
                    key={item.key}
                    aria-current={isNavItemActive(route, item) ? 'page' : undefined}
                    className="menu-tile"
                    custom={index}
                    variants={menuTile}
                    href={getPublicPath(item.path, item.hash)}
                    onFocus={() => playMenuSound('hover')}
                    onClick={(event) => handleItemClick(event, item)}
                    onMouseEnter={() => playMenuSound('hover')}
                    style={{
                      '--item-color': item.color,
                      '--item-soft': item.soft,
                    }}
                    whileHover={{
                      y: -9,
                      scale: 1.05,
                      rotate: TILE_TILTS[index % TILE_TILTS.length] * 0.4,
                      transition: { type: 'spring', stiffness: 380, damping: 14 },
                    }}
                    whileTap={{ y: 4, scale: 0.95 }}
                  >
                    <span className="menu-tile-icon" aria-hidden="true">
                      <item.icon size={30} />
                    </span>
                    <span className={isAr ? 'menu-tile-label menu-tile-label--ar' : 'menu-tile-label'}>
                      {isAr ? item.labelAr : item.label}
                    </span>
                  </motion.a>
                ))}
              </nav>

              {/* Legal links */}
              <div
                className={`menu-legal${isAr ? ' menu-legal--rtl' : ''}`}
                role="navigation"
                aria-label={isAr ? 'روابط قانونية' : 'Legal'}
              >
                {legalNavItems.map((item, index) => (
                  <motion.a
                    key={item.key}
                    aria-current={isNavItemActive(route, item) ? 'page' : undefined}
                    className="menu-legal-link"
                    custom={index}
                    variants={menuLegalLink}
                    href={getPublicPath(item.path, item.hash)}
                    onFocus={() => playMenuSound('hover')}
                    onClick={(event) => handleItemClick(event, item)}
                    onMouseEnter={() => playMenuSound('hover')}
                    style={{ '--item-color': item.color }}
                    whileHover={{ y: -3, scale: 1.04 }}
                    whileTap={{ y: 2, scale: 0.97 }}
                  >
                    <item.icon size={15} aria-hidden="true" />
                    <span className={isAr ? 'menu-legal-label--ar' : undefined}>
                      {isAr ? item.labelAr : item.label}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

function isNavItemActive(route, item) {
  if (item.hash) {
    return route.path === item.path && route.hash === item.hash
  }
  return route.path === item.path && !route.hash
}
