import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/header.css'

export default function TempHeader() {
const navigate = useNavigate()
const { user, signOut } = useAuth()

const firstName = user?.user_metadata?.first_name || ''
const lastName = user?.user_metadata?.last_name || ''

const fullName =
[firstName, lastName].filter(Boolean).join(' ') ||
user?.user_metadata?.full_name ||
'Profil'

const handleLogout = async () => {
try {
await signOut()
navigate('/')
} catch (error) {
console.error('LOGOUT ERROR:', error)
}
}

return (
<header className="site-header">
<div className="site-header-left">
<button className="site-logo" type="button" onClick={() => navigate('/')}>
NOVARA
</button>

<nav className="site-nav">
<NavLink to="/nova">Nova</NavLink>
<NavLink to="/faq">FAQ</NavLink>
<NavLink to="/help">Hilfe</NavLink>
<NavLink to="/imprint">Impressum</NavLink>
</nav>
</div>

<div className="site-header-right">
{user ? (
<>
<button
className="header-button secondary"
type="button"
onClick={() => navigate('/profile')}
title={fullName}
>
{fullName}
</button>

<button
className="header-button secondary"
type="button"
onClick={handleLogout}
>
Logout
</button>
</>
) : (
<>
<button
className="header-button secondary"
type="button"
onClick={() => navigate('/login')}
>
Login
</button>

<button
className="header-button primary"
type="button"
onClick={() => navigate('/register')}
>
Starten
</button>
</>
)}
</div>
</header>
)
}
