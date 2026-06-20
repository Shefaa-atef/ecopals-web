import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { appName } from './constants/nav'
import { getPublicPath, getRouteState, isModifiedClick } from './utils/routing'
import { LanguageProvider } from './context/LanguageContext'
import Layout from './components/Layout'
import LoadingScreen from './components/LoadingScreen'
import logoUrl from './assets/logo@4x.png'

const HomePage = lazy(() => import('./pages/HomePage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const DeleteAccountPage = lazy(() => import('./pages/DeleteAccountPage'))
const Match3Page = lazy(() => import('./pages/Match3Page'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  const [loading, setLoading] = useState(true)
  const [route, setRoute] = useState(() => getRouteState())
  const didCheckInitialHashRef = useRef(false)

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

  useEffect(() => {
    if (loading || didCheckInitialHashRef.current) return undefined

    didCheckInitialHashRef.current = true

    if (!route.hash) return undefined

    return scheduleHashScroll(route.hash, 'auto', [140, 620, 1400, 2400])
  }, [loading, route.hash, route.path])

  function handleNavigate(event, nextPath, hash) {
    if (isModifiedClick(event)) return false

    event.preventDefault()

    const publicPath = getPublicPath(nextPath, hash)

    if (`${window.location.pathname}${window.location.hash}` !== publicPath) {
      window.history.pushState({}, '', publicPath)
    }

    setRoute({ path: nextPath, hash: hash ?? '' })

    if (hash) {
      const delays = route.path === nextPath ? [140, 620] : [140, 620, 1400, 2400]
      scheduleHashScroll(hash, 'smooth', delays)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return true
  }

  function renderPage() {
    switch (route.path) {
      case '/': return <HomePage />
      case '/policies': return <PrivacyPage />
      case '/delete-account': return <DeleteAccountPage />
      case '/match-3': return <Match3Page onNavigate={handleNavigate} />
      default: return <NotFoundPage onNavigate={handleNavigate} />
    }
  }

  return (
    <LanguageProvider>
      <AnimatePresence>
        {loading && <LoadingScreen key="loading" onDone={() => setLoading(false)} />}
      </AnimatePresence>
      {!loading && (
        <Layout route={route} onNavigate={handleNavigate}>
          <Suspense fallback={null}>
            {renderPage()}
          </Suspense>
        </Layout>
      )}
    </LanguageProvider>
  )
}

function scrollToHashTarget(hash, behavior) {
  const target = document.getElementById(hash)
  if (!target) return false

  const top = Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY))
  window.scrollTo({ top, behavior })
  return true
}

function scheduleHashScroll(hash, behavior = 'smooth', delays = [140, 620]) {
  const timeoutIds = []
  let frameId = 0
  let secondFrameId = 0

  frameId = window.requestAnimationFrame(() => {
    secondFrameId = window.requestAnimationFrame(() => {
      scrollToHashTarget(hash, behavior)
      delays.forEach((delay, index) => {
        const nextBehavior = index === delays.length - 1 ? 'auto' : behavior
        timeoutIds.push(window.setTimeout(() => scrollToHashTarget(hash, nextBehavior), delay))
      })
    })
  })

  return () => {
    window.cancelAnimationFrame(frameId)
    window.cancelAnimationFrame(secondFrameId)
    timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId))
  }
}

export default App
