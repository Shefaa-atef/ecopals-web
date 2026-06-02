import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { appName } from './constants/nav'
import { getPublicPath, getRouteState, isModifiedClick } from './utils/routing'
import { LanguageProvider } from './context/LanguageContext'
import Layout from './components/Layout'
import LoadingScreen from './components/LoadingScreen'
import HomePage from './pages/HomePage'
import PrivacyPage from './pages/PrivacyPage'
import DeleteAccountPage from './pages/DeleteAccountPage'
import NotFoundPage from './pages/NotFoundPage'
import logoUrl from './assets/logo@4x.png'

function App() {
  const [loading, setLoading] = useState(true)
  const [route, setRoute] = useState(() => getRouteState())

  useEffect(() => {
    document.title = appName

    const icon =
      document.querySelector("link[rel='icon']") ??
      document.head.appendChild(document.createElement('link'))
    icon.rel = 'icon'
    icon.type = 'image/png'
    icon.href = logoUrl

    const appleIcon =
      document.querySelector("link[rel='apple-touch-icon']") ??
      document.head.appendChild(document.createElement('link'))
    appleIcon.rel = 'apple-touch-icon'
    appleIcon.href = logoUrl
  }, [])

  useEffect(() => {
    const syncRoute = () => setRoute(getRouteState())
    window.addEventListener('popstate', syncRoute)
    window.addEventListener('hashchange', syncRoute)
    return () => {
      window.removeEventListener('popstate', syncRoute)
      window.removeEventListener('hashchange', syncRoute)
    }
  }, [])

  function handleNavigate(event, nextPath, hash) {
    if (isModifiedClick(event)) return false

    event.preventDefault()

    const publicPath = getPublicPath(nextPath, hash)

    if (`${window.location.pathname}${window.location.hash}` !== publicPath) {
      window.history.pushState({}, '', publicPath)
    }

    setRoute({ path: nextPath, hash: hash ?? '' })

    if (hash) {
      window.requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return true
  }

  const pages = {
    '/': <HomePage />,
    '/policies': <PrivacyPage />,
    '/delete-account': <DeleteAccountPage />,
  }

  return (
    <LanguageProvider>
      <AnimatePresence>
        {loading && <LoadingScreen key="loading" onDone={() => setLoading(false)} />}
      </AnimatePresence>
      {!loading && (
        <Layout route={route} onNavigate={handleNavigate}>
          {pages[route.path] ?? <NotFoundPage onNavigate={handleNavigate} />}
        </Layout>
      )}
    </LanguageProvider>
  )
}

export default App
