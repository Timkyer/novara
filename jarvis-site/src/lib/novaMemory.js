import { supabase } from "./supabase"

export async function saveProfile(profile, userId, email) {
if (!userId) return

const { error } = await supabase.from("profiles").upsert({
id: userId,
email: email,
full_name: profile.full_name ?? null,
headline: profile.headline ?? null,
about_me: profile.about_me ?? null,
avatar_url: profile.avatar_url ?? null,
target_job: profile.target_job ?? null,
location: profile.location ?? null,
work_model: profile.work_model ?? null,
experience_years: profile.experience_years ?? null,
skills: profile.skills ?? [],
languages: profile.languages ?? [],
education: profile.education ?? null,
salary_expectation: profile.salary_expectation ?? null,
cv_uploaded: profile.cv_uploaded ?? null,
interests: profile.interests ?? [],
strengths: profile.strengths ?? [],
updated_at: new Date().toISOString(),
})

if (error) {
console.error("Profile save error:", error)
}
}

export async function loadProfile(userId) {
if (!userId) return null

const { data, error } = await supabase
.from("profiles")
.select("*")
.eq("id", userId)
.single()

if (error) {
console.error("Load profile error:", error)
return null
}

return data
}

export async function createChat(userId) {
const { data, error } = await supabase
.from("chats")
.insert({ user_id: userId })
.select()
.single()

if (error) {
console.error("Create chat error:", error)
return null
}

return data.id
}

export async function saveMessage(chatId, userId, role, content) {
if (!chatId || !userId || !role || !content) return

const { error } = await supabase.from("messages").insert({
chat_id: chatId,
user_id: userId,
role,
content,
})

if (error) {
console.error("Message save error:", error)
}
}

export async function saveAnalysis(analysisData, userId, chatId) {
if (!userId || !analysisData) return

const { error } = await supabase.from("analyses").insert({
user_id: userId,
chat_id: chatId,
profile: analysisData.profile || {},
analysis: analysisData.analysis || {},
})

if (error) {
console.error("Analysis save error:", error)
}
}
