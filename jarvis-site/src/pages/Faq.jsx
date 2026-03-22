import SiteHeader from '../components/TempHeader'
import '../styles/auth-page.css'

export default function Faq() {
  return (
    <div className="auth-page-shell">
      <SiteHeader />

      <div className="auth-page-card auth-confirm-card">
        <span className="auth-page-pill">FAQ</span>
        <h1>FAQ</h1>
        <p>
          Diese Seite ist vorbereitet. Hier können später Fragen, Antworten und
          Erklärungen zu Nova und der Plattform eingebaut werden.
        </p>
      </div>
    </div>
  )
}