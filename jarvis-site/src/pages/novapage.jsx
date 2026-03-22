import SiteHeader from '../components/TempHeader'
import '../styles/auth-page.css'

export default function NovaPage() {
  return (
    <div className="auth-page-shell">
      <SiteHeader />

      <div className="auth-page-card auth-confirm-card">
        <span className="auth-page-pill">NOVA</span>
        <h1>Nova</h1>
        <p>
          Diese Seite ist vorbereitet. Hier kann später erklärt werden, was Nova
          kann, wie sie arbeitet und wie sie Nutzer bei Karriere, Jobsuche und
          Bewerbung unterstützt.
        </p>
      </div>
    </div>
  )
}