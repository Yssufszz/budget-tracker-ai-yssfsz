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

  // Function to create user profile in custom table
  const createUserProfile = async (user) => {
    try {
      const { error } = await supabase
        .from('users_budgettrack')
        .insert([
          {
            id: user.id, // Use the same ID from auth.users
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

    // If signup is successful and user is immediately confirmed, create profile
    if (!error && data?.user && !data?.user?.email_confirmed_at) {
      // For cases where email confirmation is disabled
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
    createUserProfile // Export this in case you need it elsewhere
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}