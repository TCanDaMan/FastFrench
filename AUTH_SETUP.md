# Supabase Authentication Setup for FastFrench

This document explains the authentication system implemented in FastFrench using Supabase magic link authentication.

## Overview

The authentication system uses **passwordless magic link authentication** powered by Supabase. Users receive a secure link via email to sign in - no passwords needed!

## Files Created

### 1. Auth Context (`src/contexts/AuthContext.tsx`)
The main authentication context that manages:
- **User state**: Current authenticated user from Supabase
- **Profile state**: User profile data from the database
- **Loading state**: Authentication check in progress
- **Auth functions**:
  - `signIn(email)` - Send magic link to email
  - `signOut()` - Log out current user
  - `signUp(email, displayName)` - Create account and send magic link

**Key Features**:
- Listens to Supabase auth state changes via `onAuthStateChange`
- Auto-creates user profile in database on first sign-in
- Syncs profile data with Supabase profiles table
- Provides `useAuth` hook for easy access in components

### 2. Auth Hook (`src/hooks/useAuth.ts`)
Convenience re-export of the `useAuth` hook from AuthContext.

### 3. Protected Route Component (`src/components/ProtectedRoute.tsx`)
Wrapper component for routes requiring authentication:
- Shows loading spinner while checking auth state
- Redirects to `/login` if user is not authenticated
- Renders children if user is authenticated

### 4. Login Page (`src/pages/LoginPage.tsx`)
User-friendly login interface with:
- Email input for magic link
- Loading states and error handling
- Success confirmation after sending link
- Link to sign up page

### 5. Sign Up Page (`src/pages/SignUpPage.tsx`)
Registration interface with:
- Display name input
- Email input for magic link
- Loading states and error handling
- Success confirmation after sending link
- Link to login page

### 6. Updated Files
- `src/main.tsx` - Wrapped app with `AuthProvider`
- `src/App.tsx` - Added login/signup routes and protected all main routes
- `src/pages/ProfilePage.tsx` - Integrated with auth to show real user data and sign out
- `src/components/index.ts` - Exported `ProtectedRoute` component

## Authentication Flow

1. **New User Sign Up**:
   ```
   User enters email and name → signUp() → Supabase sends magic link → User clicks link →
   Profile auto-created in database → User logged in
   ```

2. **Existing User Login**:
   ```
   User enters email → signIn() → Supabase sends magic link → User clicks link →
   Profile loaded from database → User logged in
   ```

3. **Auto Login on Return**:
   ```
   User visits site → AuthProvider checks session → Profile loaded → User logged in
   ```

4. **Sign Out**:
   ```
   User clicks sign out → signOut() → Session cleared → Redirect to login
   ```

## Usage in Components

### Basic Usage
```typescript
import { useAuth } from '../hooks/useAuth'

function MyComponent() {
  const { user, profile, loading, signOut } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Welcome {profile?.display_name}</h1>
      <p>Email: {user?.email}</p>
      <p>Level: {profile?.current_level}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Protecting Routes
```typescript
import { ProtectedRoute } from '../components/ProtectedRoute'

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

## Database Integration

The auth system automatically:
- Creates a profile in the `profiles` table on first sign-in
- Sets default values (level 1, rank 'debutant', etc.)
- Uses the user's email username as the default display name
- Links the profile to the user's Supabase auth ID

## Configuration Required

Make sure your `.env` file has:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Setup

1. **Enable Email Auth** in Supabase Dashboard:
   - Go to Authentication > Providers
   - Enable Email provider
   - Configure email templates (optional)

2. **Configure Email Redirect URLs**:
   - Add your app URL to allowed redirect URLs
   - Development: `http://localhost:5173`
   - Production: Your deployed URL

3. **Database Tables**:
   - The `profiles` table should already exist (from `database.ts` types)
   - Row Level Security (RLS) should allow users to read/update their own profiles

## Security Features

- No passwords stored or transmitted
- Secure magic links expire after use
- Session tokens managed by Supabase
- Row Level Security on database
- HTTPS required for production

## Testing

1. **Test Sign Up**:
   - Go to `/signup`
   - Enter email and name
   - Check email for magic link
   - Click link to complete registration

2. **Test Login**:
   - Go to `/login`
   - Enter email
   - Check email for magic link
   - Click link to log in

3. **Test Protected Routes**:
   - Try accessing `/` without logging in
   - Should redirect to `/login`
   - Log in and verify access granted

4. **Test Sign Out**:
   - Go to `/profile`
   - Click "Sign Out"
   - Should redirect to `/login`

## Troubleshooting

### "User already registered" error
This is normal - just use the login page instead of signup.

### Magic link not arriving
- Check spam folder
- Verify email provider settings in Supabase
- Check Supabase logs for delivery issues

### Profile not created
- Check database permissions (RLS policies)
- Check browser console for errors
- Verify `profiles` table exists with correct schema

### Infinite loading on protected routes
- Check Supabase URL and keys are correct
- Verify network requests in browser DevTools
- Check for auth state change errors in console

## Future Enhancements

Potential improvements:
- Social auth (Google, GitHub, etc.)
- Remember device functionality
- Email verification required toggle
- Password option (in addition to magic link)
- Multi-factor authentication
- Profile customization on signup
