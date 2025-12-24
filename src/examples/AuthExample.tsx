/**
 * Example Component: How to use the Auth System
 *
 * This file demonstrates various ways to use the authentication
 * system in your FastFrench components.
 */

import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/Button'

// Example 1: Display user information
export function UserInfoExample() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <div>Loading user data...</div>
  }

  if (!user) {
    return <div>Not logged in</div>
  }

  return (
    <div>
      <h2>User Information</h2>
      <p>Email: {user.email}</p>
      <p>Display Name: {profile?.display_name}</p>
      <p>Level: {profile?.current_level}</p>
      <p>Total XP: {profile?.total_xp}</p>
      <p>Current Streak: {profile?.current_streak} days</p>
      <p>Rank: {profile?.current_rank}</p>
    </div>
  )
}

// Example 2: Conditional rendering based on auth state
export function ConditionalContentExample() {
  const { user, profile } = useAuth()

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome back, {profile?.display_name}!</h2>
          <p>Continue your learning journey</p>
        </div>
      ) : (
        <div>
          <h2>Welcome to FastFrench!</h2>
          <p>Please log in to get started</p>
        </div>
      )}
    </div>
  )
}

// Example 3: Sign out button
export function SignOutButtonExample() {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    // User will be redirected to /login by ProtectedRoute
  }

  return (
    <Button onClick={handleSignOut} variant="outline">
      Sign Out
    </Button>
  )
}

// Example 4: Display user stats
export function UserStatsExample() {
  const { profile } = useAuth()

  if (!profile) return null

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary-600">
          {profile.current_streak}
        </div>
        <div className="text-sm text-gray-600">Day Streak</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-accent-600">
          {profile.total_xp}
        </div>
        <div className="text-sm text-gray-600">Total XP</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-600">
          {profile.current_level}
        </div>
        <div className="text-sm text-gray-600">Level</div>
      </div>
    </div>
  )
}

// Example 5: Accessing user ID for database queries
export function UserSpecificDataExample() {
  const { user } = useAuth()

  // Use user.id to fetch user-specific data from Supabase
  // Example:
  // const { data } = await supabase
  //   .from('user_achievements')
  //   .select('*')
  //   .eq('user_id', user?.id)

  return (
    <div>
      <p>User ID: {user?.id}</p>
      <p>This ID can be used to query user-specific data</p>
    </div>
  )
}

// Example 6: Show different content based on user level
export function LevelBasedContentExample() {
  const { profile } = useAuth()

  if (!profile) return null

  const isAdvanced = (profile.current_level || 0) >= 10

  return (
    <div>
      {isAdvanced ? (
        <div>
          <h2>Advanced Content</h2>
          <p>You've unlocked advanced features!</p>
        </div>
      ) : (
        <div>
          <h2>Beginner Content</h2>
          <p>Keep practicing to unlock more!</p>
        </div>
      )}
    </div>
  )
}

// Example 7: Full component with all features
export function CompleteAuthExample() {
  const { user, profile, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="text-center p-8">
        <p>Please log in to continue</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{profile.display_name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <Button onClick={signOut} variant="outline" size="sm">
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-primary-600">
            {profile.current_level}
          </div>
          <div className="text-sm text-gray-600">Current Level</div>
        </div>
        <div className="bg-accent-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-accent-600">
            {profile.total_xp}
          </div>
          <div className="text-sm text-gray-600">Total XP</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Rank:</span>
          <span className="font-semibold capitalize">{profile.current_rank}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Current Streak:</span>
          <span className="font-semibold">{profile.current_streak} days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Daily XP Goal:</span>
          <span className="font-semibold">{profile.daily_xp_goal} XP</span>
        </div>
      </div>
    </div>
  )
}
