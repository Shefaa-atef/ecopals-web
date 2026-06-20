import { useRef } from 'react'
import { useLang } from '../context/LanguageContext'
import { getPublicPath } from '../utils/routing'
import useMatch3 from './match3/useMatch3'
import './Match3Page.css'

export default function Match3Page({ onNavigate }) {
  const containerRef = useRef(null)
  const { isAr } = useLang()

  useMatch3(containerRef)

  function handleBack(event) {
    onNavigate(event, '/', 'match-3-game')
  }

  return (
    <div className="match3-page">
      <div className="match3-canvas-wrap" ref={containerRef} />
      <a
        className={`match3-back-btn${isAr ? ' match3-back-btn--ar' : ''}`}
        href={getPublicPath('/', 'match-3-game')}
        onClick={handleBack}
        aria-label={isAr ? 'العودة إلى الصفحة الرئيسية' : 'Back to home'}
      >
        {isAr ? '← العودة' : '← Back'}
      </a>
    </div>
  )
}
