import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import TempHeader from '../components/TempHeader'
import { loadProfile, saveProfile } from '../lib/novaMemory'
import '../styles/auth-page.css'

const EMPTY_PROFILE = {
first_name: '',
last_name: '',
age: '',
residence: '',
about_me: '',
avatar_url: '',
}

export default function Profile() {
const navigate = useNavigate()
const { user } = useAuth()

const [profile, setProfile] = useState(EMPTY_PROFILE)
const [loading, setLoading] = useState(true)
const [saving, setSaving] = useState(false)
const [message, setMessage] = useState('')

const storageKey = useMemo(() => {
return user?.id ? `novaProfile_${user.id}` : 'novaProfile_guest'
}, [user?.id])

useEffect(() => {
const boot = async () => {
if (!user?.id) {
setLoading(false)
return
}

try {
let merged = { ...EMPTY_PROFILE }

const dbProfile = await loadProfile(user.id)
if (dbProfile) merged = { ...merged, ...dbProfile }

const saved = localStorage.getItem(storageKey)
if (saved) {
try {
merged = { ...merged, ...JSON.parse(saved) }
} catch (error) {
console.error(error)
}
}

merged.first_name = merged.first_name || user?.user_metadata?.first_name || ''
merged.last_name = merged.last_name || user?.user_metadata?.last_name || ''
merged.age = merged.age || user?.user_metadata?.age || ''
merged.residence = merged.residence || user?.user_metadata?.residence || ''

setProfile(merged)
} finally {
setLoading(false)
}
}

boot()
}, [user, storageKey])

const updateField = (key, value) => {
setProfile((prev) => ({ ...prev, [key]: value }))
}

const handleAvatarChange = (event) => {
const file = event.target.files?.[0]
if (!file) return

const reader = new FileReader()
reader.onload = () => {
updateField('avatar_url', reader.result)
}
reader.readAsDataURL(file)
}

const handleSave = async (event) => {
event.preventDefault()
if (!user?.id) return

try {
setSaving(true)
setMessage('')

const payload = {
...profile,
full_name: [profile.first_name, profile.last_name].filter(Boolean).join(' '),
}

localStorage.setItem(storageKey, JSON.stringify(payload))
await saveProfile(payload, user.id, user.email)

setProfile((prev) => ({
...prev,
...payload,
}))

setMessage('Profil erfolgreich gespeichert.')
} catch (error) {
console.error(error)
setMessage('Profil konnte nicht gespeichert werden.')
} finally {
setSaving(false)
}
}

if (!user) {
return (
<div className="auth-page-shell">
<TempHeader />
<div className="auth-page-card auth-confirm-card">
<span className="auth-page-pill">PROFILE</span>
<h1>Bitte zuerst einloggen</h1>
<p>Du musst eingeloggt sein, um dein Profil zu bearbeiten.</p>
<button
className="auth-submit-button"
type="button"
onClick={() => navigate('/login')}
>
Zum Login
</button>
</div>
</div>
)
}

if (loading) {
return (
<div className="auth-page-shell">
<TempHeader />
<div className="auth-page-card auth-confirm-card">
<span className="auth-page-pill">PROFILE</span>
<h1>Profil wird geladen...</h1>
</div>
</div>
)
}

return (
<div className="auth-page-shell">
<TempHeader />

<div className="auth-page-card auth-profile-card">
<span className="auth-page-pill">PROFILE</span>
<h1>Dein Profil</h1>
<p>
Passe deine Daten an. Nova nutzt diese Informationen für dein Profil
und deine Analyse.
</p>

<form className="auth-profile-form" onSubmit={handleSave}>
<div className="auth-avatar-row">
<div className="auth-avatar-preview">
{profile.avatar_url ? (
<img src={profile.avatar_url} alt="Profilbild" />
) : (
<span>Kein Bild</span>
)}
</div>

<div className="auth-avatar-actions">
<label htmlFor="avatarUpload" className="auth-outline-upload">
Profilbild hochladen
</label>
<input
id="avatarUpload"
type="file"
accept="image/*"
onChange={handleAvatarChange}
style={{ display: 'none' }}
/>
<small>Das Bild wird direkt im Profil gespeichert.</small>
</div>
</div>

<div className="auth-form-grid">
<div className="auth-outline-field">
<label>Vorname</label>
<input
value={profile.first_name}
onChange={(e) => updateField('first_name', e.target.value)}
placeholder="Vorname"
/>
</div>

<div className="auth-outline-field">
<label>Nachname</label>
<input
value={profile.last_name}
onChange={(e) => updateField('last_name', e.target.value)}
placeholder="Nachname"
/>
</div>

<div className="auth-outline-field">
<label>Alter</label>
<input
value={profile.age}
onChange={(e) => updateField('age', e.target.value)}
placeholder="Alter"
/>
</div>

<div className="auth-outline-field">
<label>Wohnort</label>
<input
value={profile.residence}
onChange={(e) => updateField('residence', e.target.value)}
placeholder="Wohnort"
/>
</div>
</div>

<div className="auth-outline-field">
<label>Über mich</label>
<textarea
value={profile.about_me}
onChange={(e) => updateField('about_me', e.target.value)}
placeholder="Erzähl etwas über dich..."
rows={6}
/>
</div>

{message ? <div className="auth-message success">{message}</div> : null}

<button className="auth-submit-button" type="submit" disabled={saving}>
{saving ? 'Wird gespeichert...' : 'Profil speichern'}
</button>
</form>
</div>
</div>
)
}
