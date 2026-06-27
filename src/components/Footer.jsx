import { Check, X } from 'lucide-react'
import { appName, appNameAr, legalNavItems } from '../constants/nav'
import { useLang } from '../context/LanguageContext'
import { getPublicPath } from '../utils/routing'
import { playMenuSound } from '../utils/menuAudio'
import logoUrl from '../assets/logo@4x.png'
import './Footer.css'

export default function Footer({ onNavigate }) {
  const { isAr } = useLang()
  const footerCopy = {
    appName: isAr ? appNameAr : appName,
    question: isAr ? 'راح تنزل تطبيقنا؟' : 'Would you download our app?',
    yes: isAr ? 'نعم' : 'Yes',
    no: isAr ? 'لا' : 'No',
    legalLabel: isAr ? 'روابط قانونية' : 'Legal',
  }

  return (
    <footer className={`site-footer${isAr ? ' site-footer--ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
      <section className="footer-download" aria-labelledby="footer-download-title">
        <div className="footer-brand-lockup">
          <span className="footer-logo-shell" aria-hidden="true">
            <img className="footer-logo" src={logoUrl} alt="" />
          </span>
          <p className="footer-app-name">{footerCopy.appName}</p>
        </div>

        <div className="footer-download-copy">
          <h2 id="footer-download-title">{footerCopy.question}</h2>
          <div className="footer-choice-row">
            <a
              className="footer-choice footer-choice--yes"
              href="https://play.google.com/store/apps/details?id=com.ecopals"
              rel="noopener noreferrer"
              target="_blank"
              onClick={() => playMenuSound('cta')}
              onFocus={() => playMenuSound('hover')}
              onMouseEnter={() => playMenuSound('hover')}
            >
              <Check aria-hidden="true" size={19} />
              <span>{footerCopy.yes}</span>
            </a>
            <button
              className="footer-choice footer-choice--no"
              type="button"
              onClick={() => playMenuSound('close')}
              onFocus={() => playMenuSound('hover')}
              onMouseEnter={() => playMenuSound('hover')}
            >
              <X aria-hidden="true" size={19} />
              <span>{footerCopy.no}</span>
            </button>
          </div>
        </div>
      </section>

      <nav className="footer-legal" aria-label={footerCopy.legalLabel}>
        {legalNavItems.map((item) => (
          <a
            href={getPublicPath(item.path)}
            key={item.key}
            onClick={(event) => onNavigate(event, item.path)}
          >
            {isAr ? item.labelAr : item.label}
          </a>
        ))}
      </nav>
    </footer>
  )
}
