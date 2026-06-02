import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Globe2, Menu, X } from 'lucide-react'
import { allNavItems, mainNavItems } from '../constants/nav'
import { menuColorLayer, menuColorLayers, menuLink, menuPanel } from '../constants/animations'
import { getPublicPath } from '../utils/routing'
import { playMenuSound } from '../utils/menuAudio'
import { useLang } from '../context/LanguageContext'
import logoUrl from '../assets/logo@4x.png'
import './GameHeader.css'

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

  return (
    <header className="site-header">
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
            onClick={toggleLang}
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
              aria-label={isAr ? 'قائمة التنقل' : 'Expanded game navigation'}
              className="game-menu"
              exit="exit"
              id="game-menu"
              initial="initial"
              variants={menuPanel}
            >
              <nav
                className={`menu-links${isAr ? ' menu-links--rtl' : ''}`}
                aria-label={isAr ? 'قائمة التنقل' : 'Expanded navigation'}
              >
                {allNavItems.map((item, index) => (
                  <motion.a
                    aria-current={isNavItemActive(route, item) ? 'page' : undefined}
                    className="menu-link"
                    custom={index}
                    whileHover={{
                      x: isAr ? -14 : 14,
                      y: -3,
                      rotate: index % 2 === 0 ? -0.8 : 0.8,
                      scale: 1.035,
                      transition: { type: 'spring', stiffness: 420, damping: 18 },
                    }}
                    whileTap={{ scale: 0.965, y: 2 }}
                    href={getPublicPath(item.path, item.hash)}
                    key={item.key}
                    onFocus={() => playMenuSound('hover')}
                    onClick={(event) => handleItemClick(event, item)}
                    onMouseEnter={() => playMenuSound('hover')}
                    style={{
                      '--item-color': item.color,
                      '--item-soft': item.soft,
                      '--item-index': index,
                    }}
                    variants={menuLink}
                  >
                    <span className="menu-link-icon">
                      <item.icon aria-hidden="true" size={23} />
                    </span>
                    <span className={isAr ? 'menu-link-label--ar' : undefined}>
                      {isAr ? item.labelAr : item.label}
                    </span>
                  </motion.a>
                ))}
              </nav>
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
