import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null) // Tambah state untuk profile
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      // Ambil profile user jika ada session
      if (session?.user) {
        await getUserProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await getUserProfile(session.user.id)
      } else {
        setUserProfile(null) // Clear profile saat logout
      }
      
      setLoading(false)

      // Handle user creation in custom table when they sign up
      if (event === 'SIGNED_UP' && session?.user) {
        await createUserProfile(session.user)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  // Fungsi untuk mengambil profile user dari database
  const getUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users_budgettrack')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error('Error in getUserProfile:', error)
    }
  }

  const createUserProfile = async (user) => {
    try {
      const { data, error } = await supabase
        .from('users_budgettrack')
        .insert([
          {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.user_metadata?.full_name || null,
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Error creating user profile:', error)
        return
      }

      // Set profile setelah berhasil dibuat
      setUserProfile(data)
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
    userProfile, // Expose userProfile
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    createUserProfile,
    getUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}