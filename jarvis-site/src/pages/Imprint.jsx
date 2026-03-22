import SiteHeader from '../components/TempHeader'
import '../styles/auth-page.css'

export default function Imprint() {
  return (
    <div className="auth-page-shell">
      <SiteHeader />

      <div className="auth-page-card auth-confirm-card">
        <span className="auth-page-pill">IMPRESSUM</span>
        <h1>Impressum</h1>
        <p>
          Diese Seite ist vorbereitet. Hier kann später das vollständige Impressum
          und die rechtlichen Angaben eingefügt werden.
        </p>
      </div>
    </div>
  )
}