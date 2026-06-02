import { getPublicPath } from '../utils/routing'
import './NotFoundPage.css'

export default function NotFoundPage({ onNavigate }) {
  return (
    <section className="not-found">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>This path is not part of the EcoPals world yet.</p>
      <a
        className="button button-primary"
        href={getPublicPath('/')}
        onClick={(event) => onNavigate(event, '/')}
      >
        Go Home
      </a>
    </section>
  )
}
