const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const OpenAI = require('openai')

dotenv.config()

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json({ limit: '2mb' }))

const client = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
})

const EMPTY_PROFILE = {
full_name: null,
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

function uniqueStrings(values = []) {
return Array.from(
new Set(
(Array.isArray(values) ? values : [])
.filter(Boolean)
.map((v) => String(v).trim())
.filter(Boolean),
),
)
}

function normalizeWorkModel(value) {
if (!value) return null
const v = String(value).toLowerCase()

if (
v.includes('remote') ||
v.includes('homeoffice') ||
v.includes('home office')
) {
return 'remote'
}

if (v.includes('hybrid')) {
return 'hybrid'
}

if (
v.includes('vor ort') ||
v.includes('vor-ort') ||
v.includes('onsite') ||
v.includes('büro') ||
v.includes('buero') ||
v.includes('office')
) {
return 'onsite'
}

return null
}

function normalizeProfile(profile = {}) {
return {
...EMPTY_PROFILE,
...profile,
work_model: normalizeWorkModel(profile?.work_model),
experience_years:
profile?.experience_years === null ||
profile?.experience_years === undefined ||
profile?.experience_years === ''
? null
: Number(profile.experience_years),
skills: uniqueStrings(profile?.skills),
languages: uniqueStrings(profile?.languages),
interests: uniqueStrings(profile?.interests),
strengths: uniqueStrings(profile?.strengths),
cv_uploaded:
typeof profile?.cv_uploaded === 'boolean' ? profile.cv_uploaded : null,
}
}

function mergeProfile(currentProfile = {}, extracted = {}) {
const base = normalizeProfile(currentProfile)

return {
...base,
full_name: extracted.full_name ?? base.full_name,
headline: extracted.headline ?? base.headline,
about_me: extracted.about_me ?? base.about_me,
avatar_url: extracted.avatar_url ?? base.avatar_url,
target_job: extracted.target_job ?? base.target_job,
location: extracted.location ?? base.location,
work_model: normalizeWorkModel(extracted.work_model) ?? base.work_model,
experience_years:
extracted.experience_years !== null &&
extracted.experience_years !== undefined &&
extracted.experience_years !== ''
? Number(extracted.experience_years)
: base.experience_years,
skills: uniqueStrings([...(base.skills || []), ...(extracted.skills || [])]),
languages: uniqueStrings([
...(base.languages || []),
...(extracted.languages || []),
]),
education: extracted.education ?? base.education,
salary_expectation:
extracted.salary_expectation ?? base.salary_expectation,
cv_uploaded:
typeof extracted.cv_uploaded === 'boolean'
? extracted.cv_uploaded
: base.cv_uploaded,
interests: uniqueStrings([
...(base.interests || []),
...(extracted.interests || []),
]),
strengths: uniqueStrings([
...(base.strengths || []),
...(extracted.strengths || []),
]),
}
}

function getProfileCompletion(profile) {
const checks = [
!!profile?.full_name,
!!profile?.target_job,
!!profile?.location,
!!profile?.work_model,
profile?.experience_years !== null &&
profile?.experience_years !== undefined &&
profile?.experience_years !== '',
Array.isArray(profile?.skills) && profile.skills.length > 0,
Array.isArray(profile?.languages) && profile.languages.length > 0,
Array.isArray(profile?.interests) && profile.interests.length > 0,
Array.isArray(profile?.strengths) && profile.strengths.length > 0,
]

const done = checks.filter(Boolean).length
return Math.round((done / checks.length) * 100)
}

function detectLanguages(text) {
const found = []
const lower = text.toLowerCase()

if (lower.includes('deutsch') || lower.includes('german')) found.push('Deutsch')
if (lower.includes('englisch') || lower.includes('english')) found.push('Englisch')
if (lower.includes('französisch') || lower.includes('franzoesisch')) {
found.push('Französisch')
}
if (lower.includes('spanisch')) found.push('Spanisch')

return uniqueStrings(found)
}

function detectWorkModel(text) {
const lower = text.toLowerCase()
if (lower.includes('remote') || lower.includes('homeoffice')) return 'remote'
if (lower.includes('hybrid')) return 'hybrid'
if (lower.includes('vor ort') || lower.includes('onsite')) return 'onsite'
return null
}

function detectExperienceYears(text) {
const match = text.match(/(\d+)\s*(jahr|jahre)/i)
if (match) return Number(match[1])

if (text.toLowerCase().includes('ein jahr')) return 1
if (text.toLowerCase().includes('zwei jahre')) return 2
if (text.toLowerCase().includes('drei jahre')) return 3

return null
}

function detectTargetJob(text) {
const lower = text.toLowerCase()

if (lower.includes('marketing')) return 'Marketing'
if (lower.includes('social media')) return 'Social Media'
if (lower.includes('design')) return 'Design'
if (lower.includes('branding')) return 'Branding'
if (lower.includes('sales')) return 'Sales'
if (lower.includes('finance')) return 'Finance'
if (lower.includes('content')) return 'Content'
if (lower.includes('grafik')) return 'Grafikdesign'

const match = text.match(/ich suche(?:\s+etwas)?(?:\s+im|\s+in)?\s+([A-Za-zÄÖÜäöüß\s/-]+)/i)
if (match?.[1]) {
return match[1].trim().slice(0, 40)
}

return null
}

function detectSkills(text) {
const lower = text.toLowerCase()
const skills = []

if (lower.includes('marketing')) skills.push('Marketing')
if (lower.includes('social media')) skills.push('Social Media')
if (lower.includes('design')) skills.push('Design')
if (lower.includes('branding')) skills.push('Branding')
if (lower.includes('content')) skills.push('Content Creation')
if (lower.includes('grafik')) skills.push('Grafikdesign')
if (lower.includes('kommunikation')) skills.push('Kommunikation')
if (lower.includes('kreativ')) skills.push('Kreativität')
if (lower.includes('team')) skills.push('Teamwork')
if (lower.includes('verkauf')) skills.push('Vertrieb')

return uniqueStrings(skills)
}

function detectInterests(text) {
return detectSkills(text)
}

function detectStrengths(text) {
const lower = text.toLowerCase()
const strengths = []

if (lower.includes('kreativ')) strengths.push('Kreativität')
if (lower.includes('team')) strengths.push('Teamfähigkeit')
if (lower.includes('kommunikation')) strengths.push('Kommunikation')
if (lower.includes('zuverlässig') || lower.includes('zuverlaessig')) {
strengths.push('Zuverlässigkeit')
}
if (lower.includes('organisiert')) strengths.push('Organisation')

return uniqueStrings(strengths)
}

function detectName(text) {
const match = text.match(/ich bin\s+([A-ZÄÖÜ][a-zäöüß]+)(?:\s|,|\.|$)/)
return match?.[1] || null
}

function extractProfileFromMessage(message) {
const extracted = {
full_name: detectName(message),
target_job: detectTargetJob(message),
work_model: detectWorkModel(message),
experience_years: detectExperienceYears(message),
skills: detectSkills(message),
languages: detectLanguages(message),
interests: detectInterests(message),
strengths: detectStrengths(message),
headline: null,
about_me: null,
avatar_url: null,
location: null,
education: null,
salary_expectation: null,
cv_uploaded: null,
}

return extracted
}

function buildAnalysis(profile) {
const completion = getProfileCompletion(profile)

const targetRoles = uniqueStrings([
...(profile?.target_job ? [profile.target_job] : []),
...(profile?.interests || []),
]).slice(0, 4)

const strengths =
uniqueStrings([
...(profile?.strengths || []),
...(profile?.skills || []).slice(0, 3),
]).slice(0, 5)

const skillGaps =
profile?.skills?.length >= 4
? ['Strategische Vertiefung']
: ['Mehr konkrete Skills definieren']

return {
headline:
profile?.target_job
? `Nova erkennt Potenzial für ${profile.target_job}`
: 'Nova baut dein Profil auf',
fit_score: Math.max(34, Math.min(96, completion)),
recommended_focus:
profile?.target_job
? `Der stärkste Hebel liegt aktuell in einer klareren Zielrolle rund um ${profile.target_job}.`
: 'Der stärkste Hebel liegt aktuell in einer klareren Zielrolle.',
summary:
profile?.experience_years !== null && profile?.target_job
? `Du bringst erste relevante Erfahrung mit und bewegst dich aktuell in Richtung ${profile.target_job}.`
: 'Nova sammelt weitere Informationen, um deine Richtung und dein Profil präziser auszuwerten.',
target_roles: targetRoles,
strengths,
skill_gaps: skillGaps,
}
}

function buildFallbackReply(profile) {
if (profile?.target_job && profile?.work_model) {
return `Verstanden. Ich habe deine Richtung weiter geschärft. Aktuell passt für dich besonders ${profile.target_job} mit dem Arbeitsmodell ${profile.work_model}.`
}

if (profile?.target_job) {
return `Verstanden. Ich habe erkannt, dass du dich aktuell besonders in Richtung ${profile.target_job} orientierst.`
}

return 'Verstanden. Ich habe dein Profil weiter ergänzt und ordne deine Richtung jetzt klarer ein.'
}

app.get('/', (req, res) => {
res.send('Nova AI Server läuft')
})

app.post('/api/chat', async (req, res) => {
try {
const { message, profile = {}, history = [] } = req.body

if (!message || !String(message).trim()) {
return res.status(400).json({
ok: false,
error: 'Keine Nachricht gesendet.',
})
}

const currentProfile = normalizeProfile(profile)
const extractedProfile = extractProfileFromMessage(message)
const mergedProfile = mergeProfile(currentProfile, extractedProfile)
const analysis = buildAnalysis(mergedProfile)

let reply = buildFallbackReply(mergedProfile)

try {
const recentHistory = Array.isArray(history)
? history.slice(-8).map((m) => ({
role: m?.role === 'assistant' ? 'assistant' : 'user',
content: String(m?.content || ''),
}))
: []

const completion = await client.chat.completions.create({
model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
temperature: 0.6,
messages: [
{
role: 'system',
content: `
Du bist Nova, eine ruhige, hochwertige Karriere-KI.
Antworte immer auf Deutsch.
Antworte kurz, klar, modern und hilfreich.
Kein allgemeines Chatbot-Gerede.
Beziehe dich auf das Profil und die letzte Nachricht.
`.trim(),
},
...recentHistory,
{
role: 'user',
content: `
Aktuelles Profil:
${JSON.stringify(mergedProfile, null, 2)}

Aktuelle Analyse:
${JSON.stringify(analysis, null, 2)}

Neue Nachricht:
${message}

Formuliere eine kurze hochwertige Antwort als Nova.
`.trim(),
},
],
})

const aiReply = completion?.choices?.[0]?.message?.content?.trim()
if (aiReply) {
reply = aiReply
}
} catch (openAiError) {
console.error('OPENAI CHAT ERROR:', openAiError?.message || openAiError)
}

return res.json({
ok: true,
reply,
profile: mergedProfile,
analysis,
})
} catch (error) {
console.error('CHAT SERVER ERROR:', error)
return res.status(500).json({
ok: false,
error: error?.message || 'Chat Fehler',
})
}
})

app.listen(PORT, () => {
console.log(`Nova AI Server läuft auf http://localhost:${PORT}`)
})
