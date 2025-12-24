# Supabase Sync Implementation

This document describes the offline-first sync implementation for FastFrench.

## Architecture Overview

FastFrench uses an **offline-first** architecture where:
1. **localStorage** is the primary data store (instant, works offline)
2. **Supabase** is synced in the background when online
3. Conflicts are resolved using "most recent wins" strategy
4. Users can work seamlessly offline and online

## Files Created/Modified

### Core Sync Infrastructure

#### 1. `/src/lib/syncService.ts`
Central sync service handling all Supabase operations.

**Key Features:**
- Online/offline detection
- Retry logic with exponential backoff
- Batch operations for performance
- Data transformation between local and cloud formats
- Conflict resolution (merge strategies)
- Realtime subscriptions

**Main Methods:**
- `syncToCloud(userId, data)` - Upload local data to Supabase
- `syncFromCloud(userId)` - Download data from Supabase
- `mergeVocabulary(local, cloud)` - Smart merge with timestamp comparison
- `mergePhraseProgress(local, cloud)` - Smart merge for phrase progress
- `setupRealtimeSync(userId, callbacks)` - Subscribe to realtime updates
- `isOnline()` - Check network connectivity

#### 2. `/src/lib/profileSync.ts`
Helper functions for profile data sync.

**Features:**
- Prepare profile data for sync
- Debounced sync (avoids too many requests)
- Immediate sync for critical events
- Profile merge logic

**Main Functions:**
- `prepareProfileForSync(stats)` - Convert store state to DB format
- `debouncedProfileSync(userId, profileData, delayMs)` - Debounced upload
- `syncProfileNow(userId, profileData)` - Immediate upload

### Store Updates

#### 3. `/src/lib/store.ts` (Updated)
Main gamification store with sync capabilities.

**New State:**
- `syncStatus: SyncStatus` - Current sync state ('synced' | 'pending' | 'syncing' | 'error' | 'offline')
- `lastSyncedAt: Date | null` - Last successful sync timestamp

**New Actions:**
- `syncToCloud()` - Upload profile and daily progress
- `syncFromCloud(userId)` - Download and merge cloud data
- `triggerBackgroundSync()` - Debounced sync trigger (called after state changes)

**Automatic Sync Triggers:**
- After XP changes (`addXp`)
- After streak updates (`updatePracticeStreak`)
- After stats increment (`incrementStats`)
- On user login (`setUser`)

#### 4. `/src/features/vocabulary/vocabularyStore.ts` (Updated)
Vocabulary store with Supabase sync.

**New State:**
- `lastSyncedAt: Date | null`

**New Actions:**
- `syncToCloud(userId)` - Upload vocabulary words
- `syncFromCloud(userId)` - Download and merge vocabulary

**Features:**
- Syncs all SM-2 algorithm data (easiness factor, interval, repetitions)
- Merges based on last reviewed timestamp
- Preserves local changes during merge

#### 5. `/src/features/phrases/phraseStore.ts` (Updated)
Phrase progress store with Supabase sync.

**New State:**
- `lastSyncedAt: Date | null`

**New Actions:**
- `syncToCloud(userId)` - Upload phrase progress
- `syncFromCloud(userId)` - Download and merge progress

**Features:**
- Syncs practice counts and comfort levels
- Merges based on last practiced timestamp
- Custom storage handlers for Map serialization

### React Hooks

#### 6. `/src/hooks/useSync.ts`
React hook for managing sync in components.

**Hook: `useSync(options)`**

Options:
- `autoSync: boolean` - Auto-sync on mount and periodically (default: true)
- `syncInterval: number` - Sync interval in ms (default: 5 minutes)
- `enableRealtime: boolean` - Enable realtime subscriptions (default: false)

Returns:
- `syncStatus` - Current sync status
- `lastSyncedAt` - Last sync timestamp
- `needsSync` - Whether sync is needed
- `forceSync()` - Force immediate bidirectional sync
- `syncProfile()` - Sync profile only
- `syncVocabulary()` - Sync vocabulary only
- `syncPhrases()` - Sync phrases only
- `syncAll()` - Sync everything
- `isOnline` - Network status

**Hook: `useSyncIndicator()`**

Returns UI-friendly sync status:
- `message` - Human-readable sync message
- `color` - Color code for UI (green, blue, yellow, red, gray)
- `isOnline` - Network status
- `isSyncing` - Whether actively syncing
- `hasError` - Whether there's a sync error

**Features:**
- Monitors online/offline events
- Auto-syncs on mount (downloads cloud data)
- Periodic background sync
- Syncs before page unload
- Optional realtime subscriptions

### UI Components

#### 7. `/src/components/SyncIndicator.tsx`
Ready-to-use sync status components.

**Components:**

`<SyncIndicator showDetails={boolean} />`
- Full sync indicator with icon and message
- Optional retry button on error
- Customizable styling

`<SyncStatusBadge />`
- Minimal badge (colored dot) for status bar
- Spinning icon when syncing
- Color-coded status

## Usage Examples

### Basic Setup

```typescript
// In your App or Layout component
import { useSync } from './hooks/useSync'

function App() {
  const { syncStatus, isOnline } = useSync({
    autoSync: true,        // Enable auto-sync
    syncInterval: 300000,  // Sync every 5 minutes
    enableRealtime: false  // Disable realtime for now
  })

  return (
    <div>
      <SyncIndicator showDetails />
      {/* Your app content */}
    </div>
  )
}
```

### Manual Sync

```typescript
import { useSync } from './hooks/useSync'

function SettingsPage() {
  const { forceSync, syncStatus } = useSync({ autoSync: false })

  return (
    <button
      onClick={forceSync}
      disabled={syncStatus === 'syncing'}
    >
      Sync Now
    </button>
  )
}
```

### Sync After User Actions

The stores automatically trigger sync after important actions:

```typescript
// This automatically triggers background sync
const { addXp } = useStore()
addXp(10) // Syncs to cloud after 2 seconds (debounced)

// Vocabulary review also triggers sync
const { reviewWord } = useVocabularyStore()
reviewWord('word-id', 5) // Syncs to cloud
```

### Status Indicator in Header

```typescript
import { SyncStatusBadge } from './components/SyncIndicator'

function Header() {
  return (
    <header>
      <h1>FastFrench</h1>
      <SyncStatusBadge />
    </header>
  )
}
```

## Data Flow

### On User Login

1. User logs in via Supabase Auth
2. Store calls `setUser(user)`
3. Store automatically calls `syncFromCloud(userId)`
4. Downloads: profile, vocabulary, phrase progress, daily progress
5. Merges cloud data with local data (most recent wins)
6. User sees merged data

### During Normal Use

1. User learns words, earns XP, practices phrases
2. Changes saved instantly to localStorage
3. Store calls `triggerBackgroundSync()` (debounced 2 seconds)
4. Data uploaded to Supabase in background
5. `syncStatus` updates: pending → syncing → synced

### When Offline

1. User goes offline
2. Changes saved to localStorage as normal
3. Sync attempts detect offline state
4. `syncStatus` set to 'offline'
5. UI shows "Offline - Changes saved locally"
6. When online again, automatic sync resumes

### On Page Reload

1. Data loaded from localStorage (instant)
2. User sees their data immediately
3. `useSync` hook triggers sync from cloud
4. Any newer cloud data merged in
5. User sees updated data

## Conflict Resolution

### Vocabulary Words

When same word exists locally and in cloud:
- Compare `lastReviewedAt` timestamps
- Keep the most recently reviewed version
- Preserves latest SM-2 parameters

```typescript
if (cloudTimestamp > localTimestamp) {
  merged.set(cloudWord.id, cloudWord)
}
```

### Phrase Progress

When same phrase exists locally and in cloud:
- Compare `lastPracticed` timestamps
- Keep the most recently practiced version
- Preserves latest comfort level

### Profile Data

- Cloud profile takes precedence
- Local data used as fallback
- Stats are server-authoritative

## Performance Optimizations

1. **Debouncing** - Sync requests debounced by 2 seconds
2. **Batch Operations** - Multiple words synced in single request
3. **Selective Sync** - Only sync changed data
4. **Retry Logic** - Exponential backoff on failures
5. **Offline Detection** - Skip sync attempts when offline

## Database Schema

### Tables Synced

- `profiles` - User profile and gamification stats
- `vocabulary` - User's vocabulary words with SM-2 data
- `user_phrase_progress` - Phrase practice progress
- `daily_progress` - Daily stats and progress

See `/supabase/migrations/001_initial_schema.sql` for full schema.

## Error Handling

- Network errors: Retry with exponential backoff (3 attempts)
- Offline: Queue for later, show offline indicator
- Supabase errors: Log and show error status
- Data corruption: Local data preserved, cloud sync skipped

## Security

- Row-Level Security (RLS) enforced in Supabase
- Users can only access their own data
- Auth handled by Supabase Auth
- No sensitive data in localStorage

## Testing Offline Functionality

1. Open DevTools → Network tab
2. Set to "Offline" mode
3. Use the app (learn words, earn XP)
4. Changes saved to localStorage
5. Go back "Online"
6. Watch sync indicator show syncing → synced
7. Verify data in Supabase dashboard

## Future Enhancements

- [ ] Realtime collaboration (if multi-device)
- [ ] Conflict resolution UI for user choice
- [ ] Sync queue with retry management
- [ ] Background sync in Service Worker
- [ ] Offline-first caching for static data
- [ ] Sync analytics and monitoring

## Troubleshooting

### Sync not working?

1. Check browser console for errors
2. Verify Supabase connection (check env vars)
3. Check network tab for failed requests
4. Verify user is logged in (`user?.id` exists)
5. Check RLS policies in Supabase

### Data not merging correctly?

1. Check timestamps are being set correctly
2. Verify merge logic in `syncService.ts`
3. Check browser localStorage for local data
4. Check Supabase dashboard for cloud data

### Performance issues?

1. Reduce sync interval (default: 5 minutes)
2. Disable realtime sync if not needed
3. Check batch sizes (too many words?)
4. Monitor network requests in DevTools

## Support

For issues or questions, check:
- Supabase docs: https://supabase.com/docs
- Zustand docs: https://github.com/pmndrs/zustand
- Project GitHub issues
