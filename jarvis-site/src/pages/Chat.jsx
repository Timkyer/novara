import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getLanguage, t } from '../i18n'
import {
saveProfile,
saveMessage,
saveAnalysis,
createChat,
loadProfile,
} from '../lib/novaMemory'
import '../styles/chat-page.css'
import TempHeader from '../components/TempHeader'

const EMPTY_PROFILE = {
full_name: null,
first_name: null,
last_name: null,
age: null,
residence: null,
headline: null,
about_me: null,
avatar_url: null,
target_job: null,
location: null,
work_model: null,
experience_years: null,
skills: [],
languages: [],
education: null,
salary_expectation: null,
cv_uploaded: null,
interests: [],
strengths: [],
}

function AnimatedNumber({ value = 0, duration = 700, suffix = '%' }) {
const [displayValue, setDisplayValue] = useState(0)
const previousRef = useRef(0)

useEffect(() => {
const startValue = previousRef.current
const endValue = Number.isFinite(value) ? value : 0
const startTime = performance.now()
let frameId = null

const animate = (now) => {
const progress = Math.min((now - startTime) / duration, 1)
const eased = 1 - Math.pow(1 - progress, 3)
const current = Math.round(startValue + (endValue - startValue) * eased)
setDisplayValue(current)

if (progress < 1) {
frameId = requestAnimationFrame(animate)
} else {
previousRef.current = endValue
}
}

frameId = requestAnimationFrame(animate)
return () => frameId && cancelAnimationFrame(frameId)
}, [value, duration])

return (
<span>
{displayValue}
{suffix}
</span>
)
}

function TypewriterText({ text = '', speed = 10, className = '' }) {
const [visibleText, setVisibleText] = useState('')

useEffect(() => {
if (!text) {
setVisibleText('')
return
}

let index = 0
setVisibleText('')

const interval = setInterval(() => {
index += 1
setVisibleText(text.slice(0, index))
if (index >= text.length) clearInterval(interval)
}, speed)

return () => clearInterval(interval)
}, [text, speed])

return <div className={className}>{visibleText}</div>
}

function ProgressiveList({ items = [] }) {
const [visibleCount, setVisibleCount] = useState(0)

useEffect(() => {
setVisibleCount(0)
if (!items.length) return

let current = 0
const timer = setInterval(() => {
current += 1
setVisibleCount(current)
if (current >= items.length) clearInterval(timer)
}, 140)

return () => clearInterval(timer)
}, [items])

if (!items.length) {
return (
<ul className="nova-analysis-list">
<li>Noch im Aufbau.</li>
</ul>
)
}

return (
<ul className="nova-analysis-list">
{items.slice(0, visibleCount).map((item, index) => (
<li key={`${item}-${index}`}>{item}</li>
))}
</ul>
)
}

function ProgressiveTags({ items = [] }) {
const [visibleCount, setVisibleCount] = useState(0)

useEffect(() => {
setVisibleCount(0)
if (!items.length) return

let current = 0
const timer = setInterval(() => {
current += 1
setVisibleCount(current)
if (current >= items.length) clearInterval(timer)
}, 120)

return () => clearInterval(timer)
}, [items])

if (!items.length) {
return (
<div className="nova-analysis-tags">
<span className="nova-analysis-tag muted">Noch im Aufbau</span>
</div>
)
}

return (
<div className="nova-analysis-tags">
{items.slice(0, visibleCount).map((item, index) => (
<span key={`${item}-${index}`} className="nova-analysis-tag">
{item}
</span>
))}
</div>
)
}

function useSequentialReveal(active, steps) {
const [visibleCount, setVisibleCount] = useState(0)

useEffect(() => {
if (!active) {
setVisibleCount(0)
return
}

setVisibleCount(0)
const timers = []

for (let i = 1; i <= steps; i += 1) {
timers.push(setTimeout(() => setVisibleCount(i), i * 170))
}

return () => timers.forEach(clearTimeout)
}, [active, steps])

return visibleCount
}

function getCompletionFields(profile) {
return [
{ key: 'full_name', done: !!profile?.full_name },
{ key: 'age', done: !!profile?.age },
{ key: 'residence', done: !!profile?.residence },
{ key: 'target_job', done: !!profile?.target_job },
{ key: 'location', done: !!profile?.location },
{ key: 'work_model', done: !!profile?.work_model },
{
key: 'experience_years',
done:
profile?.experience_years !== null &&
profile?.experience_years !== undefined &&
profile?.experience_years !== '',
},
{ key: 'skills', done: Array.isArray(profile?.skills) && profile.skills.length > 0 },
{ key: 'languages', done: Array.isArray(profile?.languages) && profile.languages.length > 0 },
{ key: 'interests', done: Array.isArray(profile?.interests) && profile.interests.length > 0 },
{ key: 'strengths', done: Array.isArray(profile?.strengths) && profile.strengths.length > 0 },
]
}

function getProfileCompletion(profile) {
const fields = getCompletionFields(profile)
const done = fields.filter((field) => field.done).length
return Math.round((done / fields.length) * 100)
}

function getSkillSignal(profile) {
const count = profile?.skills?.length || 0
if (count >= 8) return 92
if (count >= 6) return 78
if (count >= 4) return 62
if (count >= 2) return 44
return 18
}

function hasEnoughForAnalysis(analysis, messages) {
if ((messages?.length || 0) < 2) return false
if (!analysis) return false

return Boolean(
analysis.headline ||
analysis.summary ||
(analysis.target_roles && analysis.target_roles.length > 0) ||
(analysis.strengths && analysis.strengths.length > 0),
)
}

function AnalysisSection({ title, visible, children }) {
return (
<section className={`nova-analysis-section ${visible ? 'is-visible' : ''}`}>
<h4>{title}</h4>
{children}
</section>
)
}

function AnalysisPanel({ analysis, profile }) {
const fitScore = typeof analysis?.fit_score === 'number' ? analysis.fit_score : 0
const profileCompletion = getProfileCompletion(profile)
const skillSignal = getSkillSignal(profile)
const visibleCount = useSequentialReveal(true, 7)

const radius = 38
const circumference = 2 * Math.PI * radius
const dashOffset = circumference - (fitScore / 100) * circumference

return (
<aside className="nova-analysis-panel-wrap">
<div className="nova-analysis-panel">
<div className="nova-analysis-top">
<span className="nova-analysis-label">Live Analyse</span>

<AnalysisSection title="" visible={visibleCount >= 1}>
<div className="nova-analysis-headline">
<TypewriterText
text={analysis?.headline || 'Nova baut dein Profil auf'}
className="nova-analysis-headline-text"
speed={11}
/>
</div>
</AnalysisSection>
</div>

<AnalysisSection title="" visible={visibleCount >= 2}>
<div className="nova-analysis-fit">
<div className="nova-score-ring-wrap">
<svg className="nova-score-ring" viewBox="0 0 100 100">
<circle className="nova-score-ring-bg" cx="50" cy="50" r={radius} />
<circle
className="nova-score-ring-fg"
cx="50"
cy="50"
r={radius}
strokeDasharray={circumference}
strokeDashoffset={dashOffset}
/>
</svg>

<div className="nova-score-ring-center">
<AnimatedNumber value={fitScore} />
</div>
</div>

<div className="nova-analysis-fit-copy">
<strong>Karriere Fit</strong>
<TypewriterText
text={
analysis?.recommended_focus ||
'Nova sammelt gerade weitere Informationen, um deine Richtung klarer zu priorisieren.'
}
speed={9}
/>
</div>
</div>
</AnalysisSection>

<AnalysisSection title="Zusammenfassung" visible={visibleCount >= 3}>
<TypewriterText
text={
analysis?.summary ||
'Sobald Nova mehr über dich weiß, erscheint hier eine präzisere Live-Einschätzung.'
}
speed={9}
/>
</AnalysisSection>

<AnalysisSection title="Stärkste Richtungen" visible={visibleCount >= 4}>
<ProgressiveTags items={analysis?.target_roles || []} />
</AnalysisSection>

<AnalysisSection title="Stärken" visible={visibleCount >= 5}>
<ProgressiveList items={analysis?.strengths || []} />
</AnalysisSection>

<AnalysisSection title="Skill Gaps" visible={visibleCount >= 6}>
<ProgressiveList items={analysis?.skill_gaps || []} />
</AnalysisSection>

<AnalysisSection title="Profil Fortschritt" visible={visibleCount >= 7}>
<div className="nova-analysis-meters">
<div className="nova-meter-item">
<div className="nova-meter-head">
<span>Vollständigkeit</span>
<strong>
<AnimatedNumber value={profileCompletion} />
</strong>
</div>
<div className="nova-meter-bar">
<div className="nova-meter-fill" style={{ width: `${profileCompletion}%` }} />
</div>
</div>

<div className="nova-meter-item">
<div className="nova-meter-head">
<span>Skill Signal</span>
<strong>
<AnimatedNumber value={skillSignal} />
</strong>
</div>
<div className="nova-meter-bar">
<div className="nova-meter-fill" style={{ width: `${skillSignal}%` }} />
</div>
</div>
</div>

<div className="nova-mini-profile-grid">
<div className="nova-mini-profile-card">
<span>Name</span>
<strong>{profile?.full_name || 'Offen'}</strong>
</div>
<div className="nova-mini-profile-card">
<span>Alter</span>
<strong>{profile?.age || 'Offen'}</strong>
</div>
<div className="nova-mini-profile-card">
<span>Wohnort</span>
<strong>{profile?.residence || 'Offen'}</strong>
</div>
<div className="nova-mini-profile-card">
<span>Zieljob</span>
<strong>{profile?.target_job || 'Offen'}</strong>
</div>
</div>
</AnalysisSection>
</div>
</aside>
)
}

export default function Chat() {
const navigate = useNavigate()
const { signOut, user, loading } = useAuth()
const lang = useMemo(() => getLanguage(), [])
t(lang)

const storageKeys = useMemo(
() => ({
messages: user?.id ? `novaMessages_${user.id}` : 'novaMessages_guest',
profile: user?.id ? `novaProfile_${user.id}` : 'novaProfile_guest',
analysis: user?.id ? `novaAnalysis_${user.id}` : 'novaAnalysis_guest',
chatId: user?.id ? `novaChatId_${user.id}` : 'novaChatId_guest',
writingMode: user?.id ? `novaWritingMode_${user.id}` : 'novaWritingMode_guest',
}),
[user?.id],
)

const [messages, setMessages] = useState([])
const [input, setInput] = useState('')
const [typing, setTyping] = useState(false)
const [chatId, setChatId] = useState(null)
const [currentProfile, setCurrentProfile] = useState(EMPTY_PROFILE)
const [liveAnalysis, setLiveAnalysis] = useState(null)
const [writingMode, setWritingMode] = useState(false)
const [voiceMode, setVoiceMode] = useState(true)
const [initialized, setInitialized] = useState(false)
const [showScrollToBottom, setShowScrollToBottom] = useState(false)

const messagesRef = useRef(null)

useEffect(() => {
const boot = async () => {
if (loading) return

if (!user?.id) {
setMessages([])
setCurrentProfile(EMPTY_PROFILE)
setLiveAnalysis(null)
setChatId(null)
setWritingMode(false)
setVoiceMode(true)
setInitialized(true)
return
}

try {
let mergedProfile = { ...EMPTY_PROFILE }

const dbProfile = await loadProfile(user.id)
if (dbProfile) {
mergedProfile = {
...mergedProfile,
...dbProfile,
}
}

const metaFirstName = user?.user_metadata?.first_name || null
const metaLastName = user?.user_metadata?.last_name || null
const metaAge = user?.user_metadata?.age || null
const metaResidence = user?.user_metadata?.residence || null
const metaFullName =
user?.user_metadata?.full_name ||
[metaFirstName, metaLastName].filter(Boolean).join(' ') ||
null

mergedProfile = {
...mergedProfile,
first_name: mergedProfile.first_name || metaFirstName,
last_name: mergedProfile.last_name || metaLastName,
full_name: mergedProfile.full_name || metaFullName,
age: mergedProfile.age || metaAge,
residence: mergedProfile.residence || metaResidence,
location: mergedProfile.location || metaResidence,
}

const savedMessages = localStorage.getItem(storageKeys.messages)
const savedChatId = localStorage.getItem(storageKeys.chatId)
const savedAnalysis = localStorage.getItem(storageKeys.analysis)
const savedWritingMode = localStorage.getItem(storageKeys.writingMode)
const savedProfile = localStorage.getItem(storageKeys.profile)

if (savedProfile) {
try {
const parsedProfile = JSON.parse(savedProfile)
mergedProfile = {
...mergedProfile,
...parsedProfile,
}
} catch (error) {
console.error('PROFILE PARSE ERROR:', error)
}
}

setCurrentProfile(mergedProfile)

const firstNovaMessage = {
id: 1,
role: 'nova',
text: 'Hallo, ich bin Nova. Ich bin für dich zuständig und stehe dir komplett zur Verfügung.',
}

if (savedMessages) {
try {
const parsedMessages = JSON.parse(savedMessages)
if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
setMessages(parsedMessages)
setWritingMode(true)
setVoiceMode(false)
} else {
setMessages([firstNovaMessage])
}
} catch (error) {
console.error('MESSAGES PARSE ERROR:', error)
setMessages([firstNovaMessage])
}
} else {
setMessages([firstNovaMessage])
}

if (savedChatId) setChatId(savedChatId)

if (savedAnalysis) {
try {
setLiveAnalysis(JSON.parse(savedAnalysis))
} catch (error) {
console.error('ANALYSIS PARSE ERROR:', error)
}
}

if (savedWritingMode === 'true') {
setWritingMode(true)
setVoiceMode(false)
}

await saveProfile(mergedProfile, user.id, user.email)
} catch (error) {
console.error('BOOT ERROR:', error)
} finally {
setInitialized(true)
}
}

boot()
}, [user?.id, loading, storageKeys, user])

const scrollToBottom = (behavior = 'smooth') => {
if (!messagesRef.current) return
messagesRef.current.scrollTo({
top: messagesRef.current.scrollHeight,
behavior,
})
}

const handleMessagesScroll = () => {
if (!messagesRef.current) return
const { scrollTop, scrollHeight, clientHeight } = messagesRef.current
const distanceFromBottom = scrollHeight - (scrollTop + clientHeight)
setShowScrollToBottom(distanceFromBottom > 120)
}

useEffect(() => {
if (!messages.length) return
scrollToBottom('smooth')
}, [messages, typing])

const displayName =
currentProfile?.full_name ||
user?.user_metadata?.full_name ||
[user?.user_metadata?.first_name, user?.user_metadata?.last_name]
.filter(Boolean)
.join(' ') ||
user?.email?.split('@')[0] ||
'Account'

const firstName =
currentProfile?.first_name ||
user?.user_metadata?.first_name ||
user?.user_metadata?.full_name?.split(' ')[0] ||
null

const handleLogout = async () => {
try {
await signOut()
} catch (error) {
console.error(error)
}
navigate('/')
}

const sendMessage = async (customText) => {
const value = (customText ?? input).trim()
if (!value || typing || !user?.id) return

const userMessage = {
id: Date.now(),
role: 'user',
text: value,
}

const nextMessages = [...messages, userMessage]

setMessages(nextMessages)
setInput('')
setTyping(true)
setWritingMode(true)
setVoiceMode(false)

localStorage.setItem(storageKeys.messages, JSON.stringify(nextMessages))
localStorage.setItem(storageKeys.writingMode, 'true')

try {
let currentChatId = chatId

if (!currentChatId) {
currentChatId = await createChat(user.id)
if (currentChatId) {
setChatId(currentChatId)
localStorage.setItem(storageKeys.chatId, currentChatId)
}
}

if (currentChatId) {
try {
await saveMessage(currentChatId, user.id, 'user', value)
} catch (memoryError) {
console.error('SAVE USER MESSAGE ERROR:', memoryError)
}
}

const res = await fetch('http://localhost:3001/api/chat', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
message: value,
profile: currentProfile,
history: nextMessages.map((m) => ({
role: m.role === 'nova' ? 'assistant' : 'user',
content: m.text,
})),
}),
})

let data = null
let rawText = ''

try {
rawText = await res.text()
} catch (readError) {
console.error('READ RESPONSE ERROR:', readError)
}

try {
data = rawText ? JSON.parse(rawText) : null
} catch (parseError) {
console.error('JSON PARSE ERROR:', parseError)
}

if (!res.ok) {
throw new Error(data?.error || 'Server Fehler')
}

if (!data || typeof data !== 'object') {
throw new Error('Ungültige Server-Antwort')
}

const updatedProfile = data?.profile ? data.profile : currentProfile
const analysis = data?.analysis ? data.analysis : liveAnalysis

setCurrentProfile(updatedProfile)
setLiveAnalysis(analysis)

localStorage.setItem(storageKeys.profile, JSON.stringify(updatedProfile))
localStorage.setItem(storageKeys.analysis, JSON.stringify(analysis))

try {
await saveProfile(updatedProfile, user.id, user.email)
} catch (profileError) {
console.error('SAVE PROFILE ERROR:', profileError)
}

const aiReply =
typeof data?.reply === 'string' && data.reply.trim()
? data.reply.trim()
: 'Verstanden. Ich bleibe an deiner Seite und schärfe dein Profil weiter.'

const aiMessage = {
id: Date.now() + 1,
role: 'nova',
text: aiReply,
}

const updatedMessages = [...nextMessages, aiMessage]
setMessages(updatedMessages)
localStorage.setItem(storageKeys.messages, JSON.stringify(updatedMessages))

if (currentChatId) {
try {
await saveMessage(currentChatId, user.id, 'nova', aiMessage.text)
await saveAnalysis(
{
profile: updatedProfile,
analysis,
},
user.id,
currentChatId,
)
} catch (analysisError) {
console.error('SAVE ANALYSIS ERROR:', analysisError)
}
}
} catch (error) {
console.error('CHAT ERROR:', error)

const errorMessage = {
id: Date.now() + 2,
role: 'nova',
text: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.',
}

const updatedMessages = [...nextMessages, errorMessage]
setMessages(updatedMessages)
localStorage.setItem(storageKeys.messages, JSON.stringify(updatedMessages))
} finally {
setTyping(false)
}
}

const handleSubmit = async (e) => {
e.preventDefault()
await sendMessage()
}

const showAnalysis = hasEnoughForAnalysis(liveAnalysis, messages)

if (!initialized) {
return <div className="chat-page-shell" />
}

return (
<div className="chat-page-shell">
<header className="site-header">
<div className="site-header-left">
<button
className="site-logo"
type="button"
onClick={() => navigate('/')}
>
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
<button
className="header-button secondary"
type="button"
onClick={() => navigate('/profile')}
>
{displayName}
</button>

<button
className="header-button secondary"
type="button"
onClick={handleLogout}
>
Logout
</button>
</div>
</header>

{voiceMode && !writingMode ? (
<main className="chat-entry-hero">
<div className="chat-entry-panel">
<span className="chat-page-pill">VOICE INTERFACE</span>

<div className="chat-entry-core-wrap">
<div className="chat-entry-core-ring ring-1" />
<div className="chat-entry-core-ring ring-2" />
<div className="chat-entry-core-ring ring-3" />
<div className="chat-entry-core" />
<div className="chat-entry-core-glow" />
</div>

<button className="chat-voice-cta" type="button">
<span className="chat-voice-cta-waves">
<span />
<span />
<span />
<span />
</span>
<span>Spreche mit Nova</span>
</button>

<button
className="chat-secondary-ghost-button"
onClick={() => {
setWritingMode(true)
setVoiceMode(false)
localStorage.setItem(storageKeys.writingMode, 'true')
}}
type="button"
>
Oder willst du lieber chatten?
</button>
</div>
</main>
) : (
<main className="chat-page-main">
<section className="chat-page-hero">
<div className="chat-page-hero-core-row">
<div className="chat-page-top-core">
<div className="chat-page-top-core-ring ring-1" />
<div className="chat-page-top-core-ring ring-2" />
<div className="chat-page-top-core-ring ring-3" />
<div className="chat-page-top-core-inner" />
<div className="chat-page-top-core-glow" />
</div>
</div>

<h1>
{firstName
? `Hallo ${firstName}, wie kann ich dir behilflich sein?`
: 'Sprich mit Nova'}
</h1>

<p>
Beschreibe deine Ziele, Wünsche oder deine aktuelle Situation. Nova
baut dein Profil und deine Analyse im Hintergrund weiter auf.
</p>

<div className="chat-page-hero-actions">
<button
className="chat-secondary-ghost-button small"
type="button"
onClick={() => {
setVoiceMode(true)
setWritingMode(false)
localStorage.removeItem(storageKeys.writingMode)
}}
>
Zum Voice Call wechseln
</button>
</div>
</section>

<section
className={`chat-balanced-layout ${
showAnalysis ? 'analysis-open' : 'analysis-closed'
}`}
>
<div className="chat-balanced-left-reserve" />

<div className="chat-balanced-main">
<section className="chat-main-card">
<div className="chat-main-card-top">
<div className="chat-main-card-top-left">
<div className="chat-main-inline-core">
<div className="chat-main-inline-core-ring ring-1" />
<div className="chat-main-inline-core-ring ring-2" />
<div className="chat-main-inline-core-inner" />
</div>

<div className="chat-main-card-meta">
<strong className="chat-main-card-title">Nova</strong>
<span className="chat-main-card-status">Online</span>
</div>
</div>
</div>

<div
className="chat-main-messages"
ref={messagesRef}
onScroll={handleMessagesScroll}
>
{messages.map((message) => (
<div
key={message.id}
className={`chat-row ${
message.role === 'user' ? 'chat-row-user' : 'chat-row-nova'
}`}
>
<div
className={`chat-bubble ${
message.role === 'user'
? 'chat-bubble-user'
: 'chat-bubble-nova'
}`}
>
{message.text}
</div>
</div>
))}

{typing && (
<div className="chat-row chat-row-nova">
<div className="chat-bubble chat-bubble-nova chat-typing">
<span />
<span />
<span />
</div>
</div>
)}
</div>

{showScrollToBottom && (
<button
type="button"
className="chat-scroll-bottom-button"
onClick={() => scrollToBottom('smooth')}
>
↓
</button>
)}

<form className="chat-main-input-row" onSubmit={handleSubmit}>
<input
className="chat-main-input"
type="text"
placeholder="Schreib Nova, wonach du suchst ..."
value={input}
onChange={(e) => setInput(e.target.value)}
disabled={typing}
/>

<button className="chat-send-button" type="submit" disabled={typing}>
Senden
</button>
</form>
</section>
</div>

{showAnalysis ? (
<div className="chat-balanced-side">
<AnalysisPanel analysis={liveAnalysis} profile={currentProfile} />
</div>
) : null}
</section>
</main>
)}
</div>
)
}
