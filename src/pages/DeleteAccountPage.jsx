import { appName, supportEmail } from '../constants/nav'
import './DeleteAccountPage.css'

const deletionMailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
  'Delete my Ecopals account',
)}&body=${encodeURIComponent(
  'Hello Ecopals team,\n\nPlease delete my Ecopals account and associated personal data.\n\nAccount email:\nReason, optional:\n\nThank you.',
)}`

export default function DeleteAccountPage() {
  return (
    <section className="delete-page">
      <div className="legal-hero">
        <p className="eyebrow">Account deletion</p>
        <h1>Delete your {appName} account</h1>
        <p>
          Ecopals users can request account and personal data deletion from inside the app or by
          email if they cannot access their account.
        </p>
      </div>

      <div className="delete-layout">
        <section className="delete-panel">
          <h2>Request Deletion in the App</h2>
          <ol>
            <li>Open the Ecopals app.</li>
            <li>Go to Profile or Settings.</li>
            <li>Select Account.</li>
            <li>Choose Delete Account and confirm the request.</li>
          </ol>
        </section>

        <section className="delete-panel accent-panel">
          <h2>Request Deletion by Email</h2>
          <p>
            If you cannot access the app, send a request from the email address linked to your
            Ecopals account.
          </p>
          <a className="button button-danger" href={deletionMailto}>
            Email Deletion Request
          </a>
        </section>

        <section className="delete-panel">
          <h2>What May Be Deleted</h2>
          <ul>
            <li>Your account profile and login details.</li>
            <li>Your saved eco actions, goals, progress, and preferences.</li>
            <li>Content associated with your account where deletion is technically possible.</li>
          </ul>
        </section>

        <section className="delete-panel">
          <h2>What May Be Kept</h2>
          <p>
            Ecopals may retain limited records when required for legal, security, fraud prevention,
            dispute resolution, or service operation purposes.
          </p>
        </section>
      </div>
    </section>
  )
}
