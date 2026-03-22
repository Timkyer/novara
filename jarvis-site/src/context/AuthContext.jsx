import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
let mounted = true

const getSession = async () => {
const { data, error } = await supabase.auth.getSession()

if (error) {
console.error('GET SESSION ERROR:', error)
}

if (mounted) {
setUser(data?.session?.user ?? null)
setLoading(false)
}
}

getSession()

const {
data: { subscription },
} = supabase.auth.onAuthStateChange((_event, session) => {
setUser(session?.user ?? null)
setLoading(false)
})

return () => {
mounted = false
subscription.unsubscribe()
}
}, [])

const signUp = async (email, password, metadata = {}) => {
const { data, error } = await supabase.auth.signUp({
email,
password,
options: {
data: metadata,
emailRedirectTo: `${window.location.origin}/login`,
},
})

if (error) throw error
return data
}

const signIn = async (email, password) => {
const { data, error } = await supabase.auth.signInWithPassword({
email,
password,
})

if (error) throw error
return data
}

const signInWithGoogle = async () => {
const { data, error } = await supabase.auth.signInWithOAuth({
provider: 'google',
options: {
redirectTo: `${window.location.origin}/chat`,
},
})

if (error) throw error
return data
}

const signOut = async () => {
const { error } = await supabase.auth.signOut()
if (error) throw error
}

return (
<AuthContext.Provider
value={{
user,
loading,
signUp,
signIn,
signInWithGoogle,
signOut,
}}
>
{children}
</AuthContext.Provider>
)
}

export function useAuth() {
return useContext(AuthContext)
}
