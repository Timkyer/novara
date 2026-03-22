import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/auth-page.css'

export default function Register() {
const navigate = useNavigate()
const { signUp, signInWithGoogle } = useAuth()

const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [age, setAge] = useState('')
const [residence, setResidence] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [success, setSuccess] = useState(false)

const handleSubmit = async (e) => {
e.preventDefault()
setError('')
setSuccess(false)

try {
setLoading(true)

await signUp(email, password, {
first_name: firstName,
last_name: lastName,
age: age,
residence: residence,
full_name: `${firstName} ${lastName}`,
})

setSuccess(true)
} catch (err) {
setError(err.message || 'Registrierung fehlgeschlagen.')
} finally {
setLoading(false)
}
}

return (
<div className="auth-page-shell">
<div className="auth-page-card">
<div className="auth-page-head">
<span className="auth-page-pill">CREATE ACCOUNT</span>
<h1>Erstelle dein Profil</h1>
<p>
Gib direkt deine Basisdaten an, damit Nova dich von Anfang an korrekt
versteht und dein Profil automatisch aufbauen kann.
</p>
</div>

{success && (
<div className="auth-message success">
Es wurde eine Bestätigungs-E-Mail gesendet. Bitte bestätige deine E-Mail
und logge dich danach ein.
</div>
)}

{error && (
<div className="auth-message error">
{error}
</div>
)}

<form className="auth-form" onSubmit={handleSubmit}>
<div className="auth-grid">
<div className="auth-field">
<label>Vorname</label>
<input
type="text"
value={firstName}
onChange={(e) => setFirstName(e.target.value)}
required
/>
</div>

<div className="auth-field">
<label>Nachname</label>
<input
type="text"
value={lastName}
onChange={(e) => setLastName(e.target.value)}
required
/>
</div>

<div className="auth-field">
<label>Alter</label>
<input
type="number"
value={age}
onChange={(e) => setAge(e.target.value)}
required
/>
</div>

<div className="auth-field">
<label>Wohnort</label>
<input
type="text"
value={residence}
onChange={(e) => setResidence(e.target.value)}
required
/>
</div>
</div>

<div className="auth-field">
<label>E-Mail</label>
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
/>
</div>

<div className="auth-field">
<label>Passwort</label>
<input
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
required
/>
</div>

<button
className="auth-submit-button"
type="submit"
disabled={loading}
>
{loading ? 'Wird geladen...' : 'Account erstellen'}
</button>
</form>

{/* GOOGLE BUTTON */}
<button
  className="auth-google-button"
  type="button"
  onClick={signInWithGoogle}
>
  <img src="/google.jpg" alt="Google" className="auth-google-icon" />
  <span>Mit Google fortfahren</span>
</button>

<div className="auth-page-footer">
<span>Du hast schon einen Account?</span>
<Link to="/login">Zum Login</Link>
</div>
</div>
</div>
)
}
