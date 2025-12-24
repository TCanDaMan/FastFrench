# Sync Quick Start Guide

Quick reference for using the Supabase sync functionality in FastFrench.

## TL;DR

1. Add `useSync()` hook to your app
2. Everything syncs automatically
3. Users can work offline
4. No code changes needed for basic sync

## Quick Integration

### 1. Add to Your App Root

```typescript
// App.tsx or Layout.tsx
import { useSync } from './hooks/useSync'
import { SyncIndicator } from './components/SyncIndicator'

function App() {
  useSync() // That's it! Auto-sync enabled

  return (
    <div>
      <SyncIndicator /> {/* Optional: show sync status */}
      {/* Your app content */}
    </div>
  )
}
```

### 2. Stores Auto-Sync

All these actions automatically sync to Supabase:

```typescript
// Earning XP
const { addXp } = useStore()
addXp(10) // ✅ Auto-syncs

// Learning words
const { reviewWord } = useVocabularyStore()
reviewWord(wordId, quality) // ✅ Auto-syncs

// Practicing phrases
const { recordPractice } = usePhraseStore()
recordPractice(phraseId, correct) // ✅ Auto-syncs

// Updating streak
const { updatePracticeStreak } = useStore()
updatePracticeStreak() // ✅ Auto-syncs
```

## Common Patterns

### Show Sync Status

```typescript
import { SyncIndicator } from './components/SyncIndicator'

// Full indicator with message
<SyncIndicator showDetails />

// Minimal badge
<SyncStatusBadge />
```

### Manual Sync Button

```typescript
import { useSync } from './hooks/useSync'

function SyncButton() {
  const { forceSync, syncStatus } = useSync()

  return (
    <button
      onClick={forceSync}
      disabled={syncStatus === 'syncing'}
    >
      {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
    </button>
  )
}
```

### Check Online Status

```typescript
const { isOnline } = useSync()

return (
  <div>
    {isOnline ? '🟢 Online' : '🔴 Offline'}
  </div>
)
```

### Sync Specific Data

```typescript
const { syncVocabulary, syncPhrases, syncProfile } = useSync()

// Sync just vocabulary
await syncVocabulary()

// Sync just phrases
await syncPhrases()

// Sync just profile
await syncProfile()

// Sync everything
await syncAll()
```

## Configuration Options

```typescript
useSync({
  autoSync: true,           // Auto-sync on mount and periodically
  syncInterval: 5 * 60000,  // Sync every 5 minutes (in ms)
  enableRealtime: false     // Enable realtime subscriptions
})
```

### Recommended Settings

**Production (default):**
```typescript
useSync({
  autoSync: true,
  syncInterval: 5 * 60000,  // 5 minutes
  enableRealtime: false
})
```

**Development (frequent sync):**
```typescript
useSync({
  autoSync: true,
  syncInterval: 30000,      // 30 seconds
  enableRealtime: true      // See changes immediately
})
```

**Manual sync only:**
```typescript
const { forceSync } = useSync({
  autoSync: false
})
```

## Sync Status Values

```typescript
type SyncStatus =
  | 'synced'    // ✅ All data synced
  | 'pending'   // ⏳ Waiting to sync
  | 'syncing'   // 🔄 Currently syncing
  | 'error'     // ❌ Sync failed
  | 'offline'   // 📡 No internet
```

## Access Sync Anywhere

```typescript
// From main store
import { useStore } from './lib/store'

const syncToCloud = useStore(state => state.syncToCloud)
const syncStatus = useStore(state => state.syncStatus)
const lastSyncedAt = useStore(state => state.lastSyncedAt)

// From vocabulary store
import { useVocabularyStore } from './features/vocabulary/vocabularyStore'

const vocabSync = useVocabularyStore(state => state.syncToCloud)
const vocabLastSync = useVocabularyStore(state => state.lastSyncedAt)

// From phrase store
import { usePhraseStore } from './features/phrases/phraseStore'

const phraseSync = usePhraseStore(state => state.syncToCloud)
const phraseLastSync = usePhraseStore(state => state.lastSyncedAt)
```

## Testing Sync

### Test Offline Mode

1. Open DevTools → Network
2. Set to "Offline"
3. Use app (learn words, earn XP)
4. Data saved to localStorage ✅
5. Go back online
6. Data syncs automatically ✅

### Test Multi-Device Sync

1. Login on Device A
2. Learn some words
3. Login on Device B (same account)
4. See words from Device A ✅

### Test Conflict Resolution

1. Go offline
2. Learn words on Device A
3. Learn different words on Device B
4. Go online on both
5. Both sets merge ✅ (most recent wins)

## Debugging

### Check if data is syncing

```typescript
const { lastSyncedAt, syncStatus } = useSync()

console.log('Last synced:', lastSyncedAt)
console.log('Status:', syncStatus)
```

### Check localStorage

```javascript
// In browser console
localStorage.getItem('fastfrench-storage')
localStorage.getItem('vocabulary-storage')
localStorage.getItem('fastfrench-phrases')
```

### Check Supabase data

1. Go to Supabase dashboard
2. Navigate to Table Editor
3. Check `profiles`, `vocabulary`, `user_phrase_progress` tables
4. Verify your user's data is there

### Force sync manually

```typescript
const { forceSync } = useSync()

// In component or console
await forceSync()
```

## Common Issues

### "Sync not working"

✅ Check:
- User is logged in (`user?.id` exists)
- Internet connection
- Supabase env vars set correctly
- Browser console for errors

### "Data not showing after login"

✅ Solution:
- `useSync()` hook should be in app root
- Check `syncFromCloud` is called on login
- Verify data exists in Supabase

### "Offline changes not syncing"

✅ Solution:
- Check `autoSync: true` in `useSync()`
- Monitor network tab for requests
- Verify retry logic is working

## Best Practices

1. **Add `useSync()` once** in app root
2. **Don't call sync manually** unless needed (auto-sync handles it)
3. **Show sync status** to users (builds trust)
4. **Test offline mode** thoroughly
5. **Don't sync too frequently** (default 5min is good)
6. **Let stores handle sync** (they know when to sync)

## Performance Tips

1. **Debouncing works** - Don't worry about rapid changes
2. **Batch operations** - Multiple words sync in one request
3. **Offline first** - No sync overhead when offline
4. **Smart merging** - Only changed data synced

## Next Steps

- Read full docs: `/SYNC_IMPLEMENTATION.md`
- Check database schema: `/supabase/migrations/001_initial_schema.sql`
- Review sync service: `/src/lib/syncService.ts`
- Try the demo: Use app offline → online

## Questions?

Check the full implementation guide or Supabase docs!
