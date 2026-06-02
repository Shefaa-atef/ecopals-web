import { createContext, useContext, useEffect, useState } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('eco-lang') || 'en')

  useEffect(() => {
    const isAr = lang === 'ar'
    document.documentElement.lang = isAr ? 'ar' : 'en'
    document.title = isAr ? '\u0625\u064a\u0643\u0648\u0628\u0627\u0644\u0632' : 'Ecopals'
    localStorage.setItem('eco-lang', lang)
  }, [lang])

  function toggleLang() {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'))
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, isAr: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
