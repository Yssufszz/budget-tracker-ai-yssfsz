import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      // Handle user creation in custom table when they sign up
      if (event === 'SIGNED_UP' && session?.user) {
        await createUserProfile(session.user)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const createUserProfile = async (user) => {
    try {
      const { error } = await supabase
        .from('users_budgettrack')
        .insert([
          {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.user_metadata?.full_name || null,
          }
        ])
        .select()

      if (error) {
        console.error('Error creating user profile:', error)
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error)
    }
  }

  const signInWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUpWithEmail = async (email, password, name = null) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          name: name
        }
      }
    })

    if (!error && data?.user && !data?.user?.email_confirmed_at) {
      if (data.session) {
        await createUserProfile(data.user)
      }
    }

    return { data, error }
  }

  const signInWithGoogle = async () => {
    const isProduction = window.location.hostname !== 'localhost'
    const redirectTo = isProduction 
      ? 'https://budget-tracker-ai-yssfsz.pages.dev'
      : 'http://localhost:3000'

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo
      }
    })

    return { data, error }
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
    signOut,
    createUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}