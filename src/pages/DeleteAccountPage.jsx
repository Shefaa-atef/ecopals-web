import { appName, supportEmail } from '../constants/nav'
import './DeleteAccountPage.css'

const deletionMailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
  'Delete my Ecopals account',
)}&body=${encodeURIComponent(
  'Hello Ecopals team,\n\nPlease delete my Ecopals account and eligible personal data.\n\nAccount email:\nReason, optional:\n\nThank you.',
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
          <h2>What Is Deleted</h2>
          <ul>
            <li>Your login account.</li>
            <li>Your main app profile record.</li>
            <li>Your name, email address, phone number, profile picture, and notification token.</li>
          </ul>
        </section>

        <section className="delete-panel">
          <h2>What May Be Kept</h2>
          <p>
            Some shared activity may remain when needed to keep community features, challenge
            records, group records, rewards, moderation, security, fraud prevention, legal
            compliance, dispute resolution, or service operations working. This may include posts,
            comments, chats, challenge participation records, group records, reward history, and
            security logs.
          </p>
        </section>
      </div>
    </section>
  )
}
