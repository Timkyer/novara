import SiteHeader from '../components/TempHeader'
import '../styles/auth-page.css'

export default function Help() {
  return (
    <div className="auth-page-shell">
      <SiteHeader />

      <div className="auth-page-card auth-confirm-card">
        <span className="auth-page-pill">HILFE</span>
        <h1>Hilfe</h1>
        <p>
          Diese Seite ist vorbereitet. Hier können später Support, Kontakt,
          Hilfecenter und häufige Fragen eingebaut werden.
        </p>
      </div>
    </div>
  )
}