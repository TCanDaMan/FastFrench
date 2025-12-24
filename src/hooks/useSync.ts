import { useEffect, useCallback, useState } from 'react'
import { useStore, selectSyncStatus } from '../lib/store'
import { useVocabularyStore } from '../features/vocabulary/vocabularyStore'
import { usePhraseStore } from '../features/phrases/phraseStore'
import { syncService } from '../lib/syncService'
import type { SyncStatus } from '../lib/syncService'

interface UseSyncOptions {
  autoSync?: boolean // Auto-sync on mount and periodically
  syncInterval?: number // Sync interval in milliseconds (default: 5 minutes)
  enableRealtime?: boolean // Enable realtime sync
}

interface UseSyncReturn {
  syncStatus: SyncStatus
  lastSyncedAt: Date | null
  needsSync: boolean
  forceSync: () => Promise<void>
  syncProfile: () => Promise<void>
  syncVocabulary: () => Promise<void>
  syncPhrases: () => Promise<void>
  syncAll: () => Promise<void>
  isOnline: boolean
}

export function useSync(options: UseSyncOptions = {}): UseSyncReturn {
  const {
    autoSync = true,
    syncInterval = 5 * 60 * 1000, // 5 minutes
    enableRealtime = false,
  } = options

  const user = useStore(state => state.user)
  const { status, lastSyncedAt, needsSync } = useStore(selectSyncStatus)
  const syncToCloud = useStore(state => state.syncToCloud)
  const syncFromCloud = useStore(state => state.syncFromCloud)

  const vocabSyncToCloud = useVocabularyStore(state => state.syncToCloud)
  const vocabSyncFromCloud = useVocabularyStore(state => state.syncFromCloud)

  const phraseSyncToCloud = usePhraseStore(state => state.syncToCloud)
  const phraseSyncFromCloud = usePhraseStore(state => state.syncFromCloud)

  const [isOnline, setIsOnline] = useState(syncService.isOnline())

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Sync when coming back online
      if (user?.id && autoSync) {
        syncAll()
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [user?.id, autoSync])

  // Sync profile to cloud
  const syncProfile = useCallback(async () => {
    if (!user?.id) return
    await syncToCloud()
  }, [user?.id, syncToCloud])

  // Sync vocabulary to cloud
  const syncVocabulary = useCallback(async () => {
    if (!user?.id) return
    await vocabSyncToCloud(user.id)
  }, [user?.id, vocabSyncToCloud])

  // Sync phrases to cloud
  const syncPhrases = useCallback(async () => {
    if (!user?.id) return
    await phraseSyncToCloud(user.id)
  }, [user?.id, phraseSyncToCloud])

  // Sync everything to cloud
  const syncAll = useCallback(async () => {
    if (!user?.id) return

    await Promise.all([
      syncProfile(),
      syncVocabulary(),
      syncPhrases(),
    ])
  }, [user?.id, syncProfile, syncVocabulary, syncPhrases])

  // Force immediate sync (upload + download)
  const forceSync = useCallback(async () => {
    if (!user?.id) return

    // Upload local changes
    await syncAll()

    // Download cloud changes
    await Promise.all([
      syncFromCloud(user.id),
      vocabSyncFromCloud(user.id),
      phraseSyncFromCloud(user.id),
    ])
  }, [
    user?.id,
    syncAll,
    syncFromCloud,
    vocabSyncFromCloud,
    phraseSyncFromCloud,
  ])

  // Auto-sync on mount
  useEffect(() => {
    if (user?.id && autoSync && isOnline) {
      // Initial sync from cloud
      syncFromCloud(user.id)
      vocabSyncFromCloud(user.id)
      phraseSyncFromCloud(user.id)
    }
  }, [user?.id, autoSync, isOnline])

  // Periodic auto-sync
  useEffect(() => {
    if (!user?.id || !autoSync || !isOnline) return

    const interval = setInterval(() => {
      syncAll()
    }, syncInterval)

    return () => clearInterval(interval)
  }, [user?.id, autoSync, isOnline, syncInterval, syncAll])

  // Setup realtime sync
  useEffect(() => {
    if (!user?.id || !enableRealtime || !isOnline) return

    syncService.setupRealtimeSync(
      user.id,
      // On profile update
      (profile) => {
        console.log('Profile updated via realtime:', profile)
        syncFromCloud(user.id)
      },
      // On vocabulary update
      (vocabulary) => {
        console.log('Vocabulary updated via realtime:', vocabulary.length, 'words')
        vocabSyncFromCloud(user.id)
      }
    )

    return () => {
      syncService.stopRealtimeSync()
    }
  }, [user?.id, enableRealtime, isOnline, syncFromCloud, vocabSyncFromCloud])

  // Sync before page unload
  useEffect(() => {
    if (!user?.id) return

    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable sync on page unload
      if (needsSync) {
        syncAll()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [user?.id, needsSync, syncAll])

  return {
    syncStatus: status,
    lastSyncedAt,
    needsSync,
    forceSync,
    syncProfile,
    syncVocabulary,
    syncPhrases,
    syncAll,
    isOnline,
  }
}

// Hook for displaying sync status
export function useSyncIndicator() {
  const { syncStatus, lastSyncedAt, isOnline } = useSync({ autoSync: true })

  const getSyncMessage = useCallback(() => {
    if (!isOnline) return 'Offline - Changes saved locally'

    switch (syncStatus) {
      case 'syncing':
        return 'Syncing...'
      case 'synced':
        if (lastSyncedAt) {
          const minutesAgo = Math.floor((Date.now() - lastSyncedAt.getTime()) / 60000)
          if (minutesAgo < 1) return 'Synced just now'
          if (minutesAgo === 1) return 'Synced 1 minute ago'
          if (minutesAgo < 60) return `Synced ${minutesAgo} minutes ago`
          return 'Synced recently'
        }
        return 'Synced'
      case 'pending':
        return 'Pending sync...'
      case 'error':
        return 'Sync error - Retrying...'
      case 'offline':
        return 'Offline - Changes saved locally'
      default:
        return ''
    }
  }, [syncStatus, lastSyncedAt, isOnline])

  const getSyncColor = useCallback(() => {
    if (!isOnline) return 'gray'

    switch (syncStatus) {
      case 'syncing':
        return 'blue'
      case 'synced':
        return 'green'
      case 'pending':
        return 'yellow'
      case 'error':
        return 'red'
      case 'offline':
        return 'gray'
      default:
        return 'gray'
    }
  }, [syncStatus, isOnline])

  return {
    message: getSyncMessage(),
    color: getSyncColor(),
    isOnline,
    isSyncing: syncStatus === 'syncing',
    hasError: syncStatus === 'error',
  }
}
