import { useEffect, useState } from 'react'
import './App.css'

const appName = 'Ecopals'
const supportEmail = 'support@ecopals.app'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Policies', path: '/policies' },
  { label: 'Delete Account', path: '/delete-account' },
]

const deletionMailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
  'Delete my Ecopals account',
)}&body=${encodeURIComponent(
  'Hello Ecopals team,\n\nPlease delete my Ecopals account and associated personal data.\n\nAccount email:\nReason, optional:\n\nThank you.',
)}`

function normalizePath(pathname) {
  return pathname.replace(/\/+$/, '') || '/'
}

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const handlePopState = () => setPath(normalizePath(window.location.pathname))

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function handleNavigate(event, nextPath) {
    const isModifiedClick =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0

    if (isModifiedClick) {
      return
    }

    event.preventDefault()

    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath)
    }

    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pages = {
    '/': <LandingPage />,
    '/policies': <PoliciesPage />,
    '/delete-account': <DeleteAccountPage />,
  }

  return (
    <Layout activePath={path} onNavigate={handleNavigate}>
      {pages[path] ?? <NotFoundPage />}
    </Layout>
  )
}

function Layout({ activePath, children, onNavigate }) {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" onClick={(event) => onNavigate(event, '/')}>
          <span className="brand-mark" aria-hidden="true">
            E
          </span>
          <span>{appName}</span>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              aria-current={activePath === item.path ? 'page' : undefined}
              href={item.path}
              key={item.path}
              onClick={(event) => onNavigate(event, item.path)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <p>{appName}</p>
        <div>
          <a href="/policies" onClick={(event) => onNavigate(event, '/policies')}>
            Policies
          </a>
          <a href="/delete-account" onClick={(event) => onNavigate(event, '/delete-account')}>
            Delete Account
          </a>
          <a href={`mailto:${supportEmail}`}>Contact</a>
        </div>
      </footer>
    </>
  )
}

function LandingPage() {
  return (
    <>
      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow">{appName} app</p>
          <h1>Build greener habits with people who care.</h1>
          <p className="lede">
            A simple landing page foundation for the Ecopals mobile app, ready for your
            screenshots, store links, and final copy.
          </p>
          <div className="button-row">
            <a className="button button-primary" href="#download">
              App Store Links
            </a>
            <a className="button button-secondary" href="#features">
              View Structure
            </a>
          </div>
        </div>

        <div className="app-preview" aria-label="Ecopals app preview">
          <div className="phone-frame">
            <div className="phone-status">
              <span></span>
              <span></span>
            </div>
            <div className="impact-card">
              <p>This Week</p>
              <strong>14 eco actions</strong>
            </div>
            <div className="mini-list">
              <span>Recycle glass</span>
              <span>Walk instead</span>
              <span>Plant care</span>
            </div>
            <div className="progress-strip">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band" id="features">
        <div className="section-heading">
          <p className="eyebrow">Landing structure</p>
          <h2>Core sections are ready to edit.</h2>
        </div>
        <div className="feature-grid">
          <article>
            <span className="feature-icon feature-icon-green"></span>
            <h3>Feature block</h3>
            <p>Add the main Ecopals benefit, such as habit tracking, eco tasks, or community goals.</p>
          </article>
          <article>
            <span className="feature-icon feature-icon-blue"></span>
            <h3>Social proof</h3>
            <p>Use this area for testimonials, usage stats, partner logos, or app store ratings.</p>
          </article>
          <article>
            <span className="feature-icon feature-icon-coral"></span>
            <h3>App highlight</h3>
            <p>Drop in a screenshot or short product story that shows how Ecopals feels in use.</p>
          </article>
        </div>
      </section>

      <section className="split-section">
        <div>
          <p className="eyebrow">How it works</p>
          <h2>Three-step story area.</h2>
        </div>
        <div className="steps-list">
          <article>
            <span>01</span>
            <div>
              <h3>Discover actions</h3>
              <p>Introduce the first moment users experience in the app.</p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>Track progress</h3>
              <p>Explain the progress loop, challenges, reminders, or personal dashboard.</p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>Share impact</h3>
              <p>Show how users invite friends, celebrate milestones, or join a community.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="section-band download-section" id="download">
        <div>
          <p className="eyebrow">Download</p>
          <h2>Store buttons can live here.</h2>
          <p>
            Add App Store, Google Play, beta signup, or waitlist links when you are ready to launch.
          </p>
        </div>
        <div className="store-buttons">
          <a href="#top">iOS Link</a>
          <a href="#top">Android Link</a>
        </div>
      </section>
    </>
  )
}

function PoliciesPage() {
  return (
    <section className="legal-page">
      <div className="legal-hero">
        <p className="eyebrow">Policies</p>
        <h1>{appName} Policies</h1>
        <p>
          Starter privacy, terms, and community policy content for the Ecopals app. Review and
          customize this page before publishing it publicly.
        </p>
        <span>Last updated: May 23, 2026</span>
      </div>

      <div className="legal-layout">
        <aside className="legal-toc" aria-label="Policy sections">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Use</a>
          <a href="#community">Community Guidelines</a>
          <a href="#contact">Contact</a>
        </aside>

        <div className="legal-content">
          <article className="legal-block" id="privacy">
            <h2>Privacy Policy</h2>
            <p>
              Ecopals is designed to help people build eco-friendly habits and connect around
              positive environmental actions. This policy explains the types of information Ecopals
              may collect and how that information may be used.
            </p>

            <h3>Information we may collect</h3>
            <ul>
              <li>Account details such as name, email address, username, and profile information.</li>
              <li>App activity such as eco actions, goals, challenges, rewards, and preferences.</li>
              <li>Content you choose to share, including posts, comments, photos, and feedback.</li>
              <li>Technical data such as device type, app version, crash reports, and usage events.</li>
            </ul>

            <h3>How we may use information</h3>
            <ul>
              <li>To create and manage your Ecopals account.</li>
              <li>To show your progress, challenges, and community activity inside the app.</li>
              <li>To improve app reliability, safety, personalization, and support.</li>
              <li>To send service messages, account notices, or updates you choose to receive.</li>
            </ul>

            <h3>Sharing and retention</h3>
            <p>
              Ecopals does not sell personal information. Some information may be shared with
              service providers that help operate the app, when required by law, or when needed to
              protect users and the service. Information is kept only as long as needed for the
              purposes described here, unless a longer period is required by law.
            </p>

            <h3>Your choices</h3>
            <p>
              You may update account information in the app, manage notification preferences, and
              request account deletion from the Delete Account page.
            </p>
          </article>

          <article className="legal-block" id="terms">
            <h2>Terms of Use</h2>
            <p>
              By using Ecopals, you agree to use the app responsibly, keep your account information
              accurate, and respect other members of the community.
            </p>
            <ul>
              <li>Do not post harmful, misleading, abusive, illegal, or infringing content.</li>
              <li>Do not try to disrupt, scrape, reverse engineer, or misuse the service.</li>
              <li>You are responsible for the content and activity associated with your account.</li>
              <li>Ecopals may remove content or limit access when needed to protect the service.</li>
            </ul>
          </article>

          <article className="legal-block" id="community">
            <h2>Community Guidelines</h2>
            <p>
              Ecopals should feel practical, encouraging, and safe. Community spaces should support
              honest environmental action without harassment, spam, or pressure.
            </p>
            <ul>
              <li>Be respectful when discussing goals, habits, and environmental topics.</li>
              <li>Share accurate information and avoid deceptive claims.</li>
              <li>Report content or behavior that may put users at risk.</li>
            </ul>
          </article>

          <article className="legal-block" id="contact">
            <h2>Contact</h2>
            <p>
              Questions about these policies can be sent to{' '}
              <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

function DeleteAccountPage() {
  return (
    <section className="delete-page">
      <div className="legal-hero">
        <p className="eyebrow">Account deletion</p>
        <h1>Delete your {appName} account</h1>
        <p>
          Use this page to explain how Ecopals users can request account and personal data deletion.
          Replace the email address with your real support address before publishing.
        </p>
      </div>

      <div className="delete-layout">
        <section className="delete-panel">
          <h2>Request deletion in the app</h2>
          <ol>
            <li>Open the Ecopals app.</li>
            <li>Go to Profile or Settings.</li>
            <li>Select Account.</li>
            <li>Choose Delete Account and confirm the request.</li>
          </ol>
        </section>

        <section className="delete-panel accent-panel">
          <h2>Request deletion by email</h2>
          <p>
            If you cannot access the app, send a request from the email address linked to your
            Ecopals account.
          </p>
          <a className="button button-danger" href={deletionMailto}>
            Email Deletion Request
          </a>
        </section>

        <section className="delete-panel">
          <h2>What may be deleted</h2>
          <ul>
            <li>Your account profile and login details.</li>
            <li>Your saved eco actions, goals, progress, and preferences.</li>
            <li>Content associated with your account where deletion is technically possible.</li>
          </ul>
        </section>

        <section className="delete-panel">
          <h2>What may be kept</h2>
          <p>
            Ecopals may retain limited records when required for legal, security, fraud prevention,
            dispute resolution, or service operation purposes.
          </p>
        </section>
      </div>
    </section>
  )
}

function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The page you opened is not part of the Ecopals web structure yet.</p>
      <a className="button button-primary" href="/">
        Go Home
      </a>
    </section>
  )
}

export default App
