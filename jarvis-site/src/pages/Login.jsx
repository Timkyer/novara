import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/auth-page.css'

export default function Login() {
const navigate = useNavigate()
const { signIn, signInWithGoogle } = useAuth()

const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

const handleSubmit = async (e) => {
e.preventDefault()
setError('')

try {
setLoading(true)
await signIn(email, password)
navigate('/chat')
} catch (err) {
setError(err.message || 'Login fehlgeschlagen.')
} finally {
setLoading(false)
}
}

return (
<div className="auth-page-shell">
<div className="auth-page-card auth-page-card-tall auth-page-card-login">
<div className="auth-page-head">
<span className="auth-page-pill">WELCOME BACK</span>
<h1>Login</h1>
<p>
Melde dich an, um wieder mit Nova weiterzuarbeiten und dein Profil
sowie deine Karriereanalyse aufzurufen.
</p>
</div>

<form className="auth-form" onSubmit={handleSubmit}>
<div className="auth-field">
<label htmlFor="email">E-Mail</label>
<input
id="email"
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="name@email.com"
/>
</div>

<div className="auth-field">
<label htmlFor="password">Passwort</label>
<input
id="password"
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
placeholder="Dein Passwort"
/>
</div>

{error ? <div className="auth-message error">{error}</div> : null}

<button className="auth-submit-button" type="submit" disabled={loading}>
{loading ? 'Wird geladen ...' : 'Einloggen'}
</button>
</form>

<button
  className="auth-google-button"
  type="button"
  onClick={signInWithGoogle}
>
  <img src="/google.jpg" alt="Google" className="auth-google-icon" />
  <span>Mit Google fortfahren</span>
</button>

<div className="auth-page-footer">
<span>Noch keinen Account?</span>
<Link to="/register">Jetzt registrieren</Link>
</div>
</div>
</div>
)
}
