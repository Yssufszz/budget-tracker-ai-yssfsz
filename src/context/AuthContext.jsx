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
      console.log('Auth state changed:', event, session?.user?.email) // Debug log
      setUser(session?.user ?? null)
      setLoading(false)

      // Handle user creation in custom table when they sign in for the first time
      if (event === 'SIGNED_IN' && session?.user) {
        // Check if user profile exists, if not create it
        await ensureUserProfile(session.user)
      }
      
      // Backup: Also handle SIGNED_UP if it fires
      if (event === 'SIGNED_UP' && session?.user) {
        await createUserProfile(session.user)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  // Function to ensure user profile exists (check first, create if not exists)
  const ensureUserProfile = async (user) => {
    try {
      // Check if profile already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('users_budgettrack')
        .select('id')
        .eq('id', user.id)
        .single()

      if (fetchError && fetchError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Creating user profile for:', user.email)
        await createUserProfile(user)
      } else if (existingProfile) {
        console.log('User profile already exists for:', user.email)
      }
    } catch (error) {
      console.error('Error in ensureUserProfile:', error)
    }
  }

  // Function to create user profile in custom table
  const createUserProfile = async (user) => {
    try {
      console.log('Attempting to create profile for:', user.email, user.user_metadata)
      
      const { data, error } = await supabase
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
      } else {
        console.log('User profile created successfully:', data)
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

    // Create user profile immediately after successful signup
    if (!error && data?.user) {
      // Always try to create profile, regardless of email confirmation status
      await createUserProfile(data.user)
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
    createUserProfile, // Export this in case you need it elsewhere
    ensureUserProfile // Export this too
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}