import GameHeader from './GameHeader'
import Footer from './Footer'
import SmoothCursor from './SmoothCursor'

export default function Layout({ route, children, onNavigate }) {
  return (
    <>
      <SmoothCursor />
      <GameHeader route={route} onNavigate={onNavigate} />
      <main>{children}</main>
      <Footer onNavigate={onNavigate} />
    </>
  )
}
