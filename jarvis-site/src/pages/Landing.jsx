import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import TempHeader from '../components/TempHeader'
import '../styles/landing-page.css'

function MetricCard({ value, label, text }) {
return (
<article className="landing-metric-card">
<strong>{value}</strong>
<span>{label}</span>
<p>{text}</p>
</article>
)
}

function FeatureCard({ tag, title, text }) {
return (
<article className="landing-feature-card">
<span className="landing-section-tag">{tag}</span>
<h3>{title}</h3>
<p>{text}</p>
</article>
)
}

function StepCard({ number, title, text }) {
return (
<article className="landing-step-card">
<div className="landing-step-number">{number}</div>
<div className="landing-step-copy">
<h3>{title}</h3>
<p>{text}</p>
</div>
</article>
)
}

function MiniPanel({ title, text }) {
return (
<div className="landing-mini-panel">
<strong>{title}</strong>
<span>{text}</span>
</div>
)
}

function NovaCoreHero() {
return (
<div className="landing-core-wrap">
<div className="landing-core-orbit orbit-1" />
<div className="landing-core-orbit orbit-2" />
<div className="landing-core-orbit orbit-3" />
<div className="landing-core-orbit orbit-4" />

<div className="landing-core-ring ring-1" />
<div className="landing-core-ring ring-2" />
<div className="landing-core-ring ring-3" />
<div className="landing-core-ring ring-4" />

<div className="landing-core-center" />
<div className="landing-core-glow" />
</div>
)
}

export default function Landing() {
const navigate = useNavigate()
const { user } = useAuth()

const firstName =
user?.user_metadata?.first_name ||
user?.user_metadata?.full_name?.split(' ')?.[0] ||
'Freund'

const fullName =
[user?.user_metadata?.first_name, user?.user_metadata?.last_name]
.filter(Boolean)
.join(' ') ||
user?.user_metadata?.full_name ||
null

const isLoggedIn = Boolean(user)

const handleSpeakClick = () => {
if (isLoggedIn) {
navigate('/chat')
} else {
navigate('/register')
}
}

return (
<div className="landing-page-shell">
<TempHeader />

<main className="landing-page-main">
<section className="landing-hero-section">
<div className="landing-hero-left">
<div className="landing-top-badge">
<span className="landing-top-badge-dot" />
Intelligent Career Interface
</div>

{isLoggedIn ? (
<div className="landing-welcome-stack">
<span className="landing-welcome-label">WELCOME BACK</span>
<h1 className="landing-hero-title is-user">Hallo {firstName}</h1>
<p className="landing-hero-user-copy">
Nova ist bereit. Wie kann ich dir helfen?
</p>
</div>
) : (
<>
<h1 className="landing-hero-title">
Nova ist die intelligente Oberfläche für deinen nächsten Karriereschritt.
</h1>

<p className="landing-hero-description">
NOVARA verbindet Gespräch, Analyse und Profilaufbau in einer
einzigen modernen Oberfläche. Nova versteht deine Ziele,
erkennt Muster, baut dein Profil intelligent weiter auf und
soll dich langfristig bei Jobsuche, Karrierewegen und
Bewerbungen begleiten.
</p>
</>
)}

<div className="landing-speak-area">
<button
className="landing-speak-button"
type="button"
onClick={handleSpeakClick}
>
<span className="landing-speak-waves">
<span />
<span />
<span />
<span />
</span>
<span className="landing-speak-text">Sprich mit Nova</span>
</button>

{!isLoggedIn && (
<p className="landing-speak-description">
Erstelle zuerst dein Profil oder logge dich ein und starte
direkt mit Nova. Während des Gesprächs entwickelt sich dein
Profil automatisch weiter und die Analyse wird immer präziser.
</p>
)}
</div>

<div className="landing-hero-actions">
<button
className="landing-primary-button"
type="button"
onClick={handleSpeakClick}
>
{isLoggedIn ? 'Jetzt mit Nova starten' : 'Jetzt starten'}
</button>

{isLoggedIn ? (
<button
className="landing-secondary-button"
type="button"
onClick={() => navigate('/profile')}
>
Zum Profil
</button>
) : (
<button
className="landing-secondary-button"
type="button"
onClick={() => navigate('/login')}
>
Zum Login
</button>
)}
</div>

<div className="landing-hero-mini-points">
<div className="landing-mini-point">
<strong>Live Analyse</strong>
<span>Nova erkennt Richtung, Stärken und Potenziale in Echtzeit.</span>
</div>

<div className="landing-mini-point">
<strong>Dynamisches Profil</strong>
<span>Dein Profil wächst mit jeder Interaktion weiter.</span>
</div>

<div className="landing-mini-point">
<strong>Klare Orientierung</strong>
<span>Nicht nur Antworten, sondern echte nächste Schritte.</span>
</div>
</div>
</div>

<div className="landing-hero-right">
<div className="landing-hero-visual-card">
<div className="landing-visual-topline">
<span className="landing-section-tag">Nova Core</span>
<span className="landing-live-state">Live</span>
</div>

<NovaCoreHero />

<div className="landing-visual-copy">
<h2>
{fullName
? `${fullName}, Nova baut dein Profil bereits intelligent weiter auf.`
: 'Nova baut dein Profil intelligent, automatisch und dynamisch auf.'}
</h2>
<p>
Statt dass Informationen im Chat verloren gehen, werden sie
strukturiert, eingeordnet und zu einem echten Profil- und
Karrieresystem zusammengeführt.
</p>
</div>
</div>
</div>
</section>

<section className="landing-metrics-section">
<MetricCard
value="01"
label="Profil"
text="Nova übersetzt Gespräche in ein fortlaufend intelligenteres Profil."
/>
<MetricCard
value="02"
label="Analyse"
text="Muster, Interessen und Chancen werden sichtbar statt verborgen."
/>
<MetricCard
value="03"
label="Richtung"
text="Nova priorisiert Optionen, die realistischer zu dir passen könnten."
/>
</section>

<section className="landing-intro-section">
<div className="landing-intro-copy">
<span className="landing-section-tag">Was NOVARA besonders macht</span>
<h2>Nova denkt nicht wie ein klassisches Jobportal.</h2>
<p>
Gewöhnliche Plattformen zeigen Stellen an. Nova soll verstehen,
warum eine Richtung für dich passen könnte, welche Informationen
noch fehlen und wie aus einem Gespräch ein klareres, nutzbares
Gesamtbild entsteht.
</p>
</div>

<div className="landing-intro-panels">
<div className="landing-intro-panel">
<strong>Weniger Chaos</strong>
<span>
Statt zu vieler Möglichkeiten soll Nova die relevantesten Wege
strukturieren.
</span>
</div>

<div className="landing-intro-panel">
<strong>Mehr Kontext</strong>
<span>
Antworten werden nicht isoliert betrachtet, sondern im
Gesamtzusammenhang verstanden.
</span>
</div>

<div className="landing-intro-panel">
<strong>Mehr Richtung</strong>
<span>
Ziel ist nicht nur Information, sondern ein klarerer nächster
Schritt.
</span>
</div>
</div>
</section>

<section className="landing-features-head">
<span className="landing-section-tag">Plattform</span>
<h2>Eine moderne Oberfläche, die Gespräch, Profil und Karriere verbindet.</h2>
<p>
NOVARA soll mehr sein als eine schöne Oberfläche. Die Plattform soll
Profilaufbau, Live-Analyse und später auch Jobsuche sowie
Bewerbungslogik in einem zusammenhängenden System vereinen.
</p>
</section>

<section className="landing-features-grid">
<FeatureCard
tag="Analyse"
title="Live Verständnis"
text="Nova erkennt Stärken, Unsicherheiten, Interessen und Muster direkt während der Interaktion."
/>
<FeatureCard
tag="Profil"
title="Automatischer Aufbau"
text="Dein Profil wird nicht statisch ausgefüllt, sondern intelligent aus deinen Aussagen weiterentwickelt."
/>
<FeatureCard
tag="Karriere"
title="Passende Richtungen"
text="Nova soll nicht nur viele Wege nennen, sondern die Richtungen priorisieren, die wirklich relevant sein könnten."
/>
<FeatureCard
tag="Struktur"
title="Mehr Ordnung"
text="Informationen werden nicht verstreut, sondern als klares Profil- und Analysebild zusammengeführt."
/>
<FeatureCard
tag="Bewerbung"
title="Später auch Umsetzung"
text="Langfristig kann NOVARA Jobsuche, Bewerbungslogik und weitere Schritte aktiv unterstützen."
/>
<FeatureCard
tag="Zukunft"
title="Wachsende Plattform"
text="Später können Networking, Freelancer-Fokus und Startup-Unterstützung sinnvoll ergänzt werden."
/>
</section>

<section className="landing-how-section">
<div className="landing-how-left">
<span className="landing-section-tag">Wie es funktioniert</span>
<h2>Nova begleitet nicht nur einen Moment, sondern entwickelt Kontext.</h2>
<p>
Jede Interaktion soll das Bild klarer machen. Nova hört zu,
strukturiert Informationen und leitet daraus Richtungen und nächste
Schritte ab.
</p>
</div>

<div className="landing-how-right">
<StepCard
number="01"
title="Verstehen"
text="Nova hört zu, erkennt Details und baut daraus ein nutzbares Bild deiner Situation."
/>
<StepCard
number="02"
title="Strukturieren"
text="Informationen werden zu Profil, Analyse und klaren Mustern zusammengeführt."
/>
<StepCard
number="03"
title="Priorisieren"
text="Nova hebt die Richtungen hervor, bei denen du die stärkste Passung haben könntest."
/>
<StepCard
number="04"
title="Begleiten"
text="Später können daraus Jobsuche, Bewerbungen und weitere Schritte entstehen."
/>
</div>
</section>

<section className="landing-wide-panel">
<div className="landing-wide-panel-left">
<span className="landing-section-tag">Vision</span>
<h2>Aus einer Oberfläche wird ein intelligentes Karrieresystem.</h2>
<p>
NOVARA soll nicht bloß Daten sammeln, sondern daraus Orientierung
und Handlungsfähigkeit erzeugen.
</p>
</div>

<div className="landing-wide-panel-right">
<MiniPanel
title="Heute"
text="Profilaufbau, Live-Analyse und klare Richtungen."
/>
<MiniPanel
title="Morgen"
text="Jobsuche, Bewerbungen und aktive Karriere-Unterstützung."
/>
<MiniPanel
title="Später"
text="Networking, Freelancer-Fokus und Startup-Unterstützung."
/>
</div>
</section>

<section className="landing-final-cta">
<div className="landing-final-cta-card">
<span className="landing-section-tag">Start</span>
<h2>Bereit, mit Nova zu starten?</h2>
<p>
Öffne jetzt den Chat- oder Voice-Bereich und lass Nova dein Profil,
deine Analyse und deine Richtung Schritt für Schritt intelligenter
aufbauen.
</p>

<div className="landing-hero-actions">
<button
className="landing-primary-button"
type="button"
onClick={handleSpeakClick}
>
Jetzt mit Nova sprechen
</button>

{!isLoggedIn && (
<button
className="landing-secondary-button"
type="button"
onClick={() => navigate('/login')}
>
Zum Login
</button>
)}
</div>
</div>
</section>
</main>
</div>
)
}
