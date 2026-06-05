import { appName, supportEmail } from '../constants/nav'
import './PrivacyPage.css'

export default function PrivacyPage() {
  return (
    <section className="legal-page">
      <div className="legal-hero">
        <p className="eyebrow">Privacy</p>
        <h1>{appName} Privacy Policy</h1>
        <p>
          Ecopals helps people build eco-friendly habits and connect around positive environmental
          actions. This policy explains what information Ecopals may collect and how it may be used.
        </p>
        <span>Last updated: June 5, 2026</span>
      </div>

      <div className="legal-layout">
        <aside className="legal-toc" aria-label="Privacy sections">
          <a href="#overview">Overview</a>
          <a href="#information">Information</a>
          <a href="#use">Use</a>
          <a href="#choices">Choices</a>
          <a href="#deletion">Deletion</a>
          <a href="#contact">Contact</a>
        </aside>

        <div className="legal-content">
          <article className="legal-block" id="overview">
            <h2>Overview</h2>
            <p>
              Ecopals is designed to support positive environmental action. We use information only
              to operate the app, show user progress, support community features, improve safety,
              and respond to support requests.
            </p>
          </article>

          <article className="legal-block" id="information">
            <h2>Information We May Collect</h2>
            <ul>
              <li>Account details such as name, email address, username, and profile information.</li>
              <li>App activity such as eco actions, goals, challenges, rewards, and preferences.</li>
              <li>Content you choose to share, including posts, comments, photos, and feedback.</li>
              <li>Technical data such as device type, app version, crash reports, and usage events.</li>
            </ul>
          </article>

          <article className="legal-block" id="use">
            <h2>How We May Use Information</h2>
            <ul>
              <li>To create and manage your Ecopals account.</li>
              <li>To show your progress, challenges, and community activity inside the app.</li>
              <li>To improve app reliability, safety, personalization, and support.</li>
              <li>To send service messages, account notices, or updates you choose to receive.</li>
            </ul>
          </article>

          <article className="legal-block" id="choices">
            <h2>Sharing, Retention, and Choices</h2>
            <p>
              Ecopals does not sell personal information. Some information may be shared with
              service providers that help operate the app, when required by law, or when needed to
              protect users and the service. You may update account information in the app, manage
              notification preferences, and request account deletion from the Delete Account page.
            </p>
          </article>

          <article className="legal-block" id="deletion">
            <h2>Account Deletion and Retained Data</h2>
            <p>
              When you delete your Ecopals account from app settings, Ecopals deletes your login
              account and main profile record. This includes the profile details used to identify
              you in the app, such as your name, email address, phone number, profile picture, and
              notification token.
            </p>
            <p>
              Some data may remain after account deletion when it is part of shared app activity or
              is needed for security, fraud prevention, dispute handling, legal compliance, or
              service operation. This may include posts, comments, chat records, challenge
              participation records, group records, reward history, and moderation or security logs.
              Where possible, Ecopals limits retained data to what is necessary for those purposes.
            </p>
          </article>

          <article className="legal-block" id="contact">
            <h2>Contact</h2>
            <p>
              Questions about this privacy policy can be sent to{' '}
              <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
