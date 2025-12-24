# FastFrench Auth - Quick Reference Cheat Sheet

## Import the Hook

```typescript
import { useAuth } from '../hooks/useAuth'
```

## Access Auth Data

```typescript
const { user, profile, loading, signIn, signOut, signUp } = useAuth()
```

### Available Properties

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Supabase auth user object |
| `profile` | `Profile \| null` | User profile from database |
| `loading` | `boolean` | True while checking auth state |
| `signIn` | `function` | Send magic link to email |
| `signOut` | `function` | Log out current user |
| `signUp` | `function` | Create account & send magic link |

### User Object Properties

```typescript
user.id          // User's unique ID
user.email       // User's email address
user.created_at  // When account was created
```

### Profile Object Properties

```typescript
profile.id                    // Same as user.id
profile.display_name          // User's display name
profile.current_level         // Current level (number)
profile.current_rank          // Rank: 'debutant' | 'touriste' | 'voyageur' | 'parisien' | 'maitre'
profile.total_xp              // Total XP earned
profile.current_streak        // Current streak in days
profile.longest_streak        // Longest streak ever
profile.streak_freeze_available  // Can freeze streak?
profile.last_practice_date    // Last practice date (string | null)
profile.daily_xp_goal         // Daily XP goal: 10 | 20 | 50
profile.paris_trip_date       // Paris trip date (string | null)
profile.preferred_difficulty  // Preferred difficulty (number | null)
```

## Common Patterns

### 1. Show User Info

```typescript
function UserInfo() {
  const { profile } = useAuth()
  return <div>Welcome {profile?.display_name}!</div>
}
```

### 2. Sign Out Button

```typescript
function SignOutButton() {
  const { signOut } = useAuth()
  return <button onClick={signOut}>Sign Out</button>
}
```

### 3. Conditional Rendering

```typescript
function ConditionalContent() {
  const { user } = useAuth()
  return user ? <Dashboard /> : <LandingPage />
}
```

### 4. Loading State

```typescript
function MyComponent() {
  const { loading } = useAuth()
  if (loading) return <Spinner />
  return <Content />
}
```

### 5. User Stats Display

```typescript
function Stats() {
  const { profile } = useAuth()
  return (
    <div>
      <div>Level: {profile?.current_level}</div>
      <div>XP: {profile?.total_xp}</div>
      <div>Streak: {profile?.current_streak} days</div>
    </div>
  )
}
```

### 6. Protected Component

```typescript
function ProtectedContent() {
  const { user } = useAuth()
  if (!user) return <div>Please log in</div>
  return <div>Secret content!</div>
}
```

### 7. Get User ID for Queries

```typescript
function MyData() {
  const { user } = useAuth()

  // Use user.id in Supabase queries
  const { data } = await supabase
    .from('my_table')
    .select('*')
    .eq('user_id', user?.id)

  return <div>{/* render data */}</div>
}
```

## Protect Routes

```typescript
import { ProtectedRoute } from '../components/ProtectedRoute'

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## Auth Functions

### Sign In (for existing users)

```typescript
const { signIn } = useAuth()

await signIn('user@example.com')
// Magic link sent to email
```

### Sign Up (for new users)

```typescript
const { signUp } = useAuth()

await signUp('user@example.com', 'Display Name')
// Magic link sent to email, profile will be created
```

### Sign Out

```typescript
const { signOut } = useAuth()

await signOut()
// User logged out, redirected to /login
```

## Routes

| Route | Description |
|-------|-------------|
| `/login` | Login page for existing users |
| `/signup` | Sign up page for new users |
| `/` | Home (protected) |
| `/lessons` | Lessons page (protected) |
| `/phrases` | Phrases page (protected) |
| `/practice` | Practice page (protected) |
| `/pronunciation` | Pronunciation page (protected) |
| `/progress` | Progress page (protected) |
| `/profile` | Profile page (protected) - has sign out button |

## Type Definitions

```typescript
import { User } from '@supabase/supabase-js'
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
```

## Error Handling

```typescript
const { signIn } = useAuth()
const [error, setError] = useState<string | null>(null)

const handleLogin = async () => {
  const { error } = await signIn(email)
  if (error) {
    setError(error.message)
  }
}
```

## Complete Example

```typescript
import { useAuth } from '../hooks/useAuth'

function MyPage() {
  const { user, profile, loading, signOut } = useAuth()

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>
  }

  // Handle unauthenticated state
  if (!user) {
    return <div>Please log in</div>
  }

  // Render authenticated content
  return (
    <div>
      <h1>Welcome {profile?.display_name}!</h1>
      <p>Email: {user.email}</p>
      <p>Level: {profile?.current_level}</p>
      <p>XP: {profile?.total_xp}</p>
      <p>Streak: {profile?.current_streak} days</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

## Debugging Tips

**Check auth state:**
```typescript
const { user, profile, loading } = useAuth()
console.log({ user, profile, loading })
```

**Check if logged in:**
```typescript
const { user } = useAuth()
console.log('Logged in:', !!user)
```

**Check profile loaded:**
```typescript
const { profile } = useAuth()
console.log('Profile loaded:', !!profile)
```

**Monitor auth changes:**
```typescript
useEffect(() => {
  console.log('User changed:', user)
}, [user])
```

## Remember

- All routes except `/login` and `/signup` are protected
- Profile is auto-created on first sign-in
- Magic links expire after one use
- Use `useAuth()` in any component to access auth state
- Use `<ProtectedRoute>` to protect new routes
- Sign out is available on the Profile page

## Need More Help?

- See `AUTH_SETUP.md` for detailed documentation
- See `src/examples/AuthExample.tsx` for code examples
- See `IMPLEMENTATION_SUMMARY.md` for implementation details
