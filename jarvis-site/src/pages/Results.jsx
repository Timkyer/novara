import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Results() {
const navigate = useNavigate()
const [analysis, setAnalysis] = useState(null)
const [profile, setProfile] = useState(null)

useEffect(() => {
const savedAnalysis = localStorage.getItem('novaAnalysis')
const savedProfile = localStorage.getItem('novaProfile')

if (savedAnalysis) {
try {
setAnalysis(JSON.parse(savedAnalysis))
} catch (error) {
console.error(error)
}
}

if (savedProfile) {
try {
setProfile(JSON.parse(savedProfile))
} catch (error) {
console.error(error)
}
}
}, [])

if (!analysis) {
return (
<div className="page">
<div className="universe-bg" />
<div className="grid-overlay" />
<main className="results-wrap">
<div className="results-head">
<h1>Noch keine Analyse vorhanden</h1>
<p>
Nova hat aktuell noch keine gespeicherte Analyse für dich. Geh
zurück in den Chat und schreibe noch etwas mehr über dein Ziel.
</p>
</div>

<div className="result-actions" style={{ justifyContent: 'center' }}>
<button className="hero-primary small-action" onClick={() => navigate('/chat')}>
Zurück zum Chat
</button>
</div>
</main>
</div>
)
}

return (
<div className="page">
<div className="universe-bg" />
<div className="grid-overlay" />
<div className="stars-layer stars-1" />
<div className="stars-layer stars-2" />
<div className="stars-layer stars-3" />
<div className="nebula nebula-1" />
<div className="nebula nebula-2" />

<main className="results-wrap">
<div className="results-head">
<span className="section-mini">NOVA ANALYSIS</span>
<h1>{analysis.headline || 'Deine Karriere-Einschätzung'}</h1>
<p>
{analysis.summary ||
'Nova hat dein Profil live analysiert und daraus erste Karriere-Richtungen, Stärken und nächste Schritte abgeleitet.'}
</p>
</div>

<section className="results-cards">
<div className="result-box">
<div className="result-box-top">
<h3>Fit Score</h3>
<div className="result-chance">
{typeof analysis.fit_score === 'number'
? `${analysis.fit_score}%`
: 'Live'}
</div>
</div>

<div className="result-copy">
<h4>Empfohlener Fokus</h4>
<p>
{analysis.recommended_focus ||
'Der stärkste Hebel liegt aktuell in einer klareren Zielrolle und einer stärkeren Positionierung.'}
</p>
</div>
</div>

<div className="result-box">
<div className="result-box-top">
<h3>Aktuelles Profil</h3>
</div>

<div className="result-copy">
<h4>Zieljob</h4>
<p>{profile?.target_job || 'Noch offen'}</p>
</div>

<div className="result-copy">
<h4>Standort</h4>
<p>{profile?.location || 'Noch offen'}</p>
</div>

<div className="result-copy">
<h4>Arbeitsmodell</h4>
<p>{profile?.work_model || 'Noch offen'}</p>
</div>
</div>

<div className="result-box">
<div className="result-box-top">
<h3>Skills & Sprachen</h3>
</div>

<div className="result-copy">
<h4>Skills</h4>
<p>
{profile?.skills?.length
? profile.skills.join(' • ')
: 'Noch keine Skills erkannt'}
</p>
</div>

<div className="result-copy">
<h4>Sprachen</h4>
<p>
{profile?.languages?.length
? profile.languages.join(' • ')
: 'Noch keine Sprachen erkannt'}
</p>
</div>
</div>
</section>

<section className="feature-section" style={{ paddingTop: 24 }}>
<div className="section-head">
<span className="section-mini">CAREER PATHS</span>
<h2>Rollen, die Nova aktuell am stärksten sieht</h2>
<p>
Diese Richtungen basieren auf deinem bisherigen Gespräch und
deinem aktuellen Profil.
</p>
</div>

<div className="results-cards">
{(analysis.target_roles || []).map((role, index) => (
<div className="result-box" key={index}>
<div className="result-box-top">
<h3>{role}</h3>
<div className="result-status good">Priorität</div>
</div>

<div className="result-copy">
<p>
Diese Richtung wirkt aktuell passend zu deinem Profil, deinen
Interessen und deiner bisherigen Positionierung.
</p>
</div>
</div>
))}

{!analysis.target_roles?.length && (
<div className="result-box">
<div className="result-box-top">
<h3>Noch keine klaren Rollen</h3>
</div>
<div className="result-copy">
<p>
Nova braucht noch etwas mehr Klarheit von dir, um die besten
Rollen sicher zu priorisieren.
</p>
</div>
</div>
)}
</div>
</section>

<section className="feature-section" style={{ paddingTop: 24 }}>
<div className="section-head">
<span className="section-mini">STRENGTHS</span>
<h2>Was Nova schon als Stärke erkennt</h2>
</div>

<div className="feature-grid">
{(analysis.strengths || []).map((item, index) => (
<div className="feature-grid-card" key={index}>
<h3>Stärke {index + 1}</h3>
<p>{item}</p>
</div>
))}

{!analysis.strengths?.length && (
<div className="feature-grid-card">
<h3>Stärken im Aufbau</h3>
<p>
Nova erkennt erste Potenziale, braucht aber noch etwas mehr
konkrete Informationen.
</p>
</div>
)}
</div>
</section>

<section className="feature-section" style={{ paddingTop: 24 }}>
<div className="section-head">
<span className="section-mini">RISKS & GAPS</span>
<h2>Offene Punkte und Skill Gaps</h2>
</div>

<div className="results-cards">
<div className="result-box">
<div className="result-box-top">
<h3>Risiken / Unklarheiten</h3>
</div>
<div className="result-copy">
{(analysis.risks || []).length ? (
analysis.risks.map((item, index) => <p key={index}>• {item}</p>)
) : (
<p>Aktuell keine großen Risiken erkannt.</p>
)}
</div>
</div>

<div className="result-box">
<div className="result-box-top">
<h3>Skill Gaps</h3>
</div>
<div className="result-copy">
{(analysis.skill_gaps || []).length ? (
analysis.skill_gaps.map((item, index) => <p key={index}>• {item}</p>)
) : (
<p>Aktuell keine klaren Skill Gaps erkannt.</p>
)}
</div>
</div>
</div>
</section>

<section className="faq-section" style={{ paddingTop: 24 }}>
<div className="section-head">
<span className="section-mini">NEXT STEPS</span>
<h2>Die nächsten sinnvollen Schritte</h2>
<p>
Das sind die Moves, die Nova dir auf Basis deiner aktuellen
Situation empfehlen würde.
</p>
</div>

<div className="faq-grid">
{(analysis.next_steps || []).map((step, index) => (
<div className="faq-card" key={index}>
<h3>Schritt {index + 1}</h3>
<p>{step}</p>
</div>
))}

{!analysis.next_steps?.length && (
<div className="faq-card">
<h3>Nächster Schritt</h3>
<p>
Sprich noch etwas konkreter mit Nova über deine Richtung,
Erfahrung und deine Prioritäten.
</p>
</div>
)}
</div>
</section>

<div className="result-actions" style={{ marginTop: 28 }}>
<button className="hero-secondary small-action" onClick={() => navigate('/chat')}>
Zurück zu Nova
</button>

<button className="hero-primary small-action" onClick={() => navigate('/profile')}>
Profil öffnen
</button>
</div>
</main>
</div>
)
}
