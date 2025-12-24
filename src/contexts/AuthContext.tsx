import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Database } from '../types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  signUp: (email: string, displayName: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch or create user profile
  const fetchProfile = async (userId: string) => {
    try {
      // First, try to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (existingProfile) {
        setProfile(existingProfile)
        return
      }

      // If profile doesn't exist, create one
      if (fetchError && fetchError.code === 'PGRST116') {
        const { data: user } = await supabase.auth.getUser()
        const email = user.user?.email || 'Learner'

        const newProfile: Database['public']['Tables']['profiles']['Insert'] = {
          id: userId,
          display_name: email.split('@')[0], // Use email username as default display name
          current_level: 1,
          current_rank: 'debutant',
          total_xp: 0,
          current_streak: 0,
          longest_streak: 0,
          streak_freeze_available: true,
          last_practice_date: null,
          daily_xp_goal: 20,
          paris_trip_date: null,
          preferred_difficulty: null,
        }

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single()

        if (createError) {
          console.error('Error creating profile:', createError)
          return
        }

        setProfile(createdProfile)
      } else if (fetchError) {
        console.error('Error fetching profile:', fetchError)
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    }
  }

  // Sign in with magic link
  const signIn = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  // Sign up with magic link
  const signUp = async (email: string, displayName: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            display_name: displayName,
          },
        },
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  // Refresh session when PWA comes back to foreground
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        supabase.auth.getSession()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Listen to auth state changes
  useEffect(() => {
    let mounted = true

    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth loading timeout - setting loading to false')
        setLoading(false)
      }
    }, 5000)

    // Get initial session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error getting session:', error)
        if (mounted) setLoading(false)
      })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signOut,
    signUp,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
