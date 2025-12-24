# Integration Checklist

Complete these steps to integrate the Supabase sync functionality into FastFrench.

## Prerequisites

- [x] Supabase project created
- [x] Database schema migrated (`001_initial_schema.sql`)
- [x] Environment variables set (`.env` file)
- [x] Sync implementation complete

## Integration Steps

### 1. Verify Environment Variables

**File:** `.env` or `.env.local`

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

- [ ] Variables are set
- [ ] App restarts after adding variables
- [ ] No TypeScript errors in `/src/lib/supabase.ts`

### 2. Create Auth Context (if not exists)

**File:** `/src/contexts/AuthContext.tsx`

```typescript
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName }
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

- [ ] Create `/src/contexts/AuthContext.tsx`
- [ ] No TypeScript errors

### 3. Wrap App with AuthProvider

**File:** `/src/main.tsx` or `/src/App.tsx`

```typescript
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      {/* Your app content */}
    </AuthProvider>
  )
}
```

- [ ] Add `<AuthProvider>` wrapper
- [ ] Verify auth context is accessible

### 4. Connect Auth to Store

**File:** `/src/App.tsx` or main component

```typescript
import { useEffect } from 'react'
import { useAuth } from './contexts/AuthContext'
import { useStore } from './lib/store'

function AppContent() {
  const { user: authUser } = useAuth()
  const setUser = useStore(state => state.setUser)

  useEffect(() => {
    if (authUser) {
      // Convert Supabase user to app User type
      setUser({
        id: authUser.id,
        name: authUser.user_metadata.display_name || 'User',
        xp: 0, // Will be synced from cloud
        level: 1,
        rank: 'debutant',
        streak: 0,
      })
    } else {
      setUser(null)
    }
  }, [authUser, setUser])

  return (
    <div>
      {/* Your app */}
    </div>
  )
}
```

- [ ] Add auth-to-store connection
- [ ] Test: Login updates store
- [ ] Test: Logout clears store

### 5. Add Sync Hook

**File:** `/src/App.tsx` or main component

```typescript
import { useSync } from './hooks/useSync'
import { SyncIndicator } from './components/SyncIndicator'

function AppContent() {
  // Auto-sync enabled
  useSync({
    autoSync: true,
    syncInterval: 5 * 60000, // 5 minutes
    enableRealtime: false
  })

  return (
    <div>
      <header>
        <SyncIndicator />
      </header>
      {/* Your app */}
    </div>
  )
}
```

- [ ] Add `useSync()` hook
- [ ] Add `<SyncIndicator />` component
- [ ] Verify sync status shows

### 6. Test Sync Flow

#### Test 1: First Login
- [ ] Create new account
- [ ] Add some words/progress
- [ ] Check Supabase dashboard - data appears
- [ ] Logout

#### Test 2: Returning User
- [ ] Login with same account
- [ ] Data loads from cloud
- [ ] Previous progress visible

#### Test 3: Offline Mode
- [ ] DevTools → Network → Set to "Offline"
- [ ] Add words, earn XP
- [ ] Data saved to localStorage
- [ ] Go back online
- [ ] Sync indicator shows "Syncing..."
- [ ] Data appears in Supabase

#### Test 4: Multi-Device (Optional)
- [ ] Login on Device A
- [ ] Add some progress
- [ ] Login on Device B (same account)
- [ ] Progress from Device A appears

### 7. Verify Data in Supabase

Go to Supabase Dashboard → Table Editor:

- [ ] `profiles` table has user data
- [ ] `vocabulary` table has user's words
- [ ] `user_phrase_progress` has practice data
- [ ] `daily_progress` has today's stats
- [ ] RLS policies are working (users only see their data)

### 8. Configure Sync Settings (Optional)

Choose sync strategy based on needs:

**Production (default):**
```typescript
useSync({
  autoSync: true,
  syncInterval: 5 * 60000,  // 5 minutes
  enableRealtime: false
})
```

**Aggressive Sync:**
```typescript
useSync({
  autoSync: true,
  syncInterval: 60000,      // 1 minute
  enableRealtime: true      // Real-time updates
})
```

**Manual Sync Only:**
```typescript
const { forceSync } = useSync({
  autoSync: false
})

// Sync on button click
<button onClick={forceSync}>Sync</button>
```

- [ ] Choose sync strategy
- [ ] Test performance
- [ ] Adjust as needed

### 9. Add Error Handling (Optional but Recommended)

**File:** `/src/App.tsx`

```typescript
import { useSync } from './hooks/useSync'
import { useEffect } from 'react'

function AppContent() {
  const { syncStatus, forceSync } = useSync()

  useEffect(() => {
    if (syncStatus === 'error') {
      // Show toast/notification
      console.error('Sync error - will retry automatically')
    }
  }, [syncStatus])

  return (
    <div>
      {syncStatus === 'error' && (
        <div className="error-banner">
          Sync error. <button onClick={forceSync}>Retry</button>
        </div>
      )}
      {/* Your app */}
    </div>
  )
}
```

- [ ] Add error notifications
- [ ] Add retry button
- [ ] Test error handling

### 10. Performance Check

- [ ] App loads quickly (localStorage first)
- [ ] Sync happens in background (no UI blocking)
- [ ] No excessive API calls (check Network tab)
- [ ] Offline mode works smoothly
- [ ] No console errors

## Troubleshooting

### Issue: Sync not working

**Check:**
1. User is logged in (`authUser` exists)
2. Environment variables are set correctly
3. Supabase project is active
4. RLS policies are correct
5. Network tab shows requests to Supabase

**Solution:**
```typescript
// Debug sync status
const { syncStatus, lastSyncedAt, isOnline } = useSync()
console.log({ syncStatus, lastSyncedAt, isOnline })

// Force sync manually
const { forceSync } = useSync()
await forceSync()
```

### Issue: Data not appearing after login

**Check:**
1. `syncFromCloud` is being called on login
2. Data exists in Supabase (check dashboard)
3. User ID matches between auth and store
4. No errors in browser console

**Solution:**
```typescript
// Add logging to setUser
setUser: (user) => {
  console.log('Setting user:', user)
  if (user) {
    console.log('Syncing from cloud...')
    get().syncFromCloud(user.id)
  }
}
```

### Issue: Offline mode not working

**Check:**
1. localStorage is enabled
2. Data persists after page reload
3. Sync status shows "offline"

**Solution:**
- Verify `persist` middleware in stores
- Check localStorage in DevTools
- Test with Network tab set to "Offline"

### Issue: Performance problems

**Check:**
1. Sync interval (too frequent?)
2. Number of vocabulary words (too many?)
3. Network tab (excessive requests?)

**Solution:**
- Increase sync interval to 10 minutes
- Disable realtime sync
- Batch operations properly

## Final Verification

- [ ] User can sign up
- [ ] User can log in
- [ ] Data syncs to Supabase
- [ ] Offline mode works
- [ ] Data persists after reload
- [ ] Multi-device sync works (if tested)
- [ ] Sync indicator shows correct status
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Performance is good

## Optional Enhancements

- [ ] Add sync progress bar
- [ ] Add sync history/logs
- [ ] Add sync settings page
- [ ] Add conflict resolution UI
- [ ] Add sync analytics
- [ ] Add background sync in Service Worker
- [ ] Add sync testing suite

## Documentation Review

Read these docs for more details:

- [ ] `/SYNC_SUMMARY.md` - Overview and summary
- [ ] `/SYNC_IMPLEMENTATION.md` - Detailed implementation
- [ ] `/docs/SYNC_QUICK_START.md` - Quick reference
- [ ] `/supabase/migrations/001_initial_schema.sql` - Database schema

## Support

If you encounter issues:

1. Check browser console for errors
2. Check Supabase dashboard for data
3. Check Network tab for API calls
4. Review error messages
5. Check RLS policies
6. Review documentation

## Success!

Once all checkboxes are checked, your sync implementation is complete!

Your app now:
- Works offline
- Syncs automatically
- Preserves user data
- Handles conflicts
- Shows sync status
- Performs well

Enjoy your offline-first, cloud-synced French learning app!
