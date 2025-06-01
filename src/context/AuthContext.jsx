import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fungsi untuk membuat atau update user di users_budgettrack
  const createOrUpdateUserRecord = async (user) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users_budgettrack')
        .upsert(
          {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture
          },
          { 
            onConflict: 'email',
            ignoreDuplicates: false 
          }
        )
        .select()

      if (error) {
        console.error('Error creating/updating user record:', error)
      } else {
        console.log('User record created/updated successfully:', data)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        // Buat atau update record user ketika session ditemukan
        await createOrUpdateUserRecord(session.user)
      }
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        
        // Buat atau update record user ketika ada perubahan auth state
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await createOrUpdateUserRecord(session.user)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signInWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUpWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error }
  }

  const signInWithGoogle = async () => {
    const isProduction = window.location.hostname !== 'localhost'
    const redirectTo = isProduction 
      ? 'https://budget-tracker-ai-yssfsz.pages.dev'
      : 'http://localhost:3000'

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo
      }
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value = {
    user,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}