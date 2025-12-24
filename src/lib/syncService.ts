import { supabase } from './supabase'
import type { User } from '../types'
import type { Achievement, DailyProgress } from '../types/gamification'
import type { VocabularyWord, VocabularyCategory } from '../types/vocabulary'
import type { PhraseProgress } from '../types/phrases'

export type SyncStatus = 'synced' | 'pending' | 'syncing' | 'error' | 'offline'

interface SyncResult {
  success: boolean
  error?: string
  lastSynced?: Date
}

export interface CloudData {
  profile?: User
  vocabulary?: VocabularyWord[]
  phraseProgress?: PhraseProgress[]
  dailyProgress?: DailyProgress[]
  achievements?: Achievement[]
}

class SyncService {
  private syncInProgress = false
  private realtimeChannel: ReturnType<typeof supabase.channel> | null = null

  // Check if browser is online
  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true
  }

  // Generic retry logic with exponential backoff
  private async retry<T>(
    fn: () => Promise<T>,
    maxAttempts = 3,
    delayMs = 1000
  ): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        if (attempt < maxAttempts) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delayMs * attempt))
        }
      }
    }

    throw lastError || new Error('Retry failed')
  }

  // Sync user profile to Supabase
  async syncProfileToCloud(
    userId: string,
    profileData: {
      display_name?: string
      current_level: number
      current_rank: string
      total_xp: number
      current_streak: number
      longest_streak: number
      streak_freeze_available: boolean
      last_practice_date: Date | null
      daily_xp_goal: 10 | 20 | 50
      paris_trip_date?: Date | null
      preferred_difficulty?: number
    }
  ): Promise<SyncResult> {
    if (!this.isOnline()) {
      return { success: false, error: 'Offline' }
    }

    try {
      const result = await this.retry(async () => {
        const response = await supabase.from('profiles').upsert({
          id: userId,
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        return response
      })

      if (result.error) throw result.error

      return { success: true, lastSynced: new Date() }
    } catch (error) {
      console.error('Failed to sync profile:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  // Sync vocabulary to Supabase
  async syncVocabularyToCloud(
    userId: string,
    words: VocabularyWord[]
  ): Promise<SyncResult> {
    if (!this.isOnline()) {
      return { success: false, error: 'Offline' }
    }

    try {
      // Transform local vocabulary to match database schema
      const vocabularyData = words.map(word => ({
        id: word.id,
        user_id: userId,
        french_word: word.french,
        english_translation: word.english,
        phonetic: word.phonetic,
        category: word.category,
        example_sentence: word.exampleSentence,
        next_review_date: word.nextReviewDate.toISOString(),
        easiness_factor: word.easinessFactor,
        repetitions: word.repetitions,
        interval: word.interval,
        times_correct: word.timesCorrect,
        times_incorrect: word.timesIncorrect,
        mastered: word.mastered,
        updated_at: new Date().toISOString(),
      }))

      // Batch upsert with retry
      const result = await this.retry(async () => {
        const response = await supabase.from('vocabulary').upsert(vocabularyData, {
          onConflict: 'id',
        })
        return response
      })

      if (result.error) throw result.error

      return { success: true, lastSynced: new Date() }
    } catch (error) {
      console.error('Failed to sync vocabulary:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  // Sync phrase progress to Supabase
  async syncPhraseProgressToCloud(
    userId: string,
    progress: PhraseProgress[]
  ): Promise<SyncResult> {
    if (!this.isOnline()) {
      return { success: false, error: 'Offline' }
    }

    try {
      const progressData = progress.map(p => ({
        user_id: userId,
        phrase_id: p.phraseId,
        practiced_count: p.practiced,
        last_practiced: p.lastPracticed?.toISOString() || null,
        comfort_level: p.comfortLevel,
      }))

      const result = await this.retry(async () => {
        const response = await supabase.from('user_phrase_progress').upsert(progressData, {
          onConflict: 'user_id,phrase_id',
        })
        return response
      })

      if (result.error) throw result.error

      return { success: true, lastSynced: new Date() }
    } catch (error) {
      console.error('Failed to sync phrase progress:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  // Sync daily progress to Supabase
  async syncDailyProgressToCloud(
    userId: string,
    dailyProgress: DailyProgress
  ): Promise<SyncResult> {
    if (!this.isOnline()) {
      return { success: false, error: 'Offline' }
    }

    try {
      const result = await this.retry(async () => {
        const response = await supabase.from('daily_progress').upsert({
          user_id: userId,
          date: dailyProgress.date.toISOString().split('T')[0], // Date only
          xp_earned: dailyProgress.xp_earned,
          words_learned: dailyProgress.words_learned,
          words_reviewed: dailyProgress.words_reviewed,
          phrases_practiced: dailyProgress.phrases_practiced,
          time_spent_minutes: dailyProgress.time_spent_minutes,
        }, {
          onConflict: 'user_id,date',
        })
        return response
      })

      if (result.error) throw result.error

      return { success: true, lastSynced: new Date() }
    } catch (error) {
      console.error('Failed to sync daily progress:', error)
      return { success: false, error: (error as Error).message }
    }
  }

  // Fetch profile from Supabase
  async fetchProfileFromCloud(userId: string): Promise<User | null> {
    if (!this.isOnline()) {
      return null
    }

    try {
      const result = await this.retry(async () => {
        const response = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        return response
      })

      if (result.error) throw result.error

      if (!result.data) return null

      // Transform to User type
      return {
        id: result.data.id,
        name: result.data.display_name,
        xp: result.data.total_xp,
        level: result.data.current_level,
        rank: result.data.current_rank,
        streak: result.data.current_streak,
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      return null
    }
  }

  // Fetch vocabulary from Supabase
  async fetchVocabularyFromCloud(userId: string): Promise<VocabularyWord[]> {
    if (!this.isOnline()) {
      return []
    }

    try {
      const result = await this.retry(async () => {
        const response = await supabase
          .from('vocabulary')
          .select('*')
          .eq('user_id', userId)
        return response
      })

      if (result.error) throw result.error

      if (!result.data) return []

      // Transform to VocabularyWord type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return result.data.map((item: any) => ({
        id: item.id as string,
        french: item.french_word as string,
        english: item.english_translation as string,
        phonetic: (item.phonetic || '') as string,
        category: item.category as VocabularyCategory,
        exampleSentence: (item.example_sentence || '') as string,
        easinessFactor: parseFloat(String(item.easiness_factor)),
        interval: item.interval as number,
        repetitions: item.repetitions as number,
        nextReviewDate: new Date(item.next_review_date as string),
        timesCorrect: item.times_correct as number,
        timesIncorrect: item.times_incorrect as number,
        mastered: item.mastered as boolean,
        addedAt: new Date(item.created_at as string),
        lastReviewedAt: item.updated_at ? new Date(item.updated_at as string) : undefined,
      }))
    } catch (error) {
      console.error('Failed to fetch vocabulary:', error)
      return []
    }
  }

  // Fetch phrase progress from Supabase
  async fetchPhraseProgressFromCloud(userId: string): Promise<PhraseProgress[]> {
    if (!this.isOnline()) {
      return []
    }

    try {
      const result = await this.retry(async () => {
        const response = await supabase
          .from('user_phrase_progress')
          .select('*')
          .eq('user_id', userId)
        return response
      })

      if (result.error) throw result.error

      if (!result.data) return []

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return result.data.map((item: any) => ({
        phraseId: item.phrase_id as string,
        practiced: item.practiced_count as number,
        lastPracticed: item.last_practiced ? new Date(item.last_practiced as string) : null,
        comfortLevel: (item.comfort_level || 1) as 1 | 2 | 3 | 4 | 5,
        isLearned: (item.comfort_level as number) >= 5,
      }))
    } catch (error) {
      console.error('Failed to fetch phrase progress:', error)
      return []
    }
  }

  // Fetch daily progress from Supabase
  async fetchDailyProgressFromCloud(userId: string): Promise<DailyProgress | null> {
    if (!this.isOnline()) {
      return null
    }

    try {
      const today = new Date().toISOString().split('T')[0]

      const result = await this.retry(async () => {
        const response = await supabase
          .from('daily_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('date', today)
          .single()
        return response
      })

      if (result.error && result.error.code !== 'PGRST116') throw result.error // Ignore "not found" error

      if (!result.data) return null

      return {
        user_id: result.data.user_id,
        date: new Date(result.data.date),
        xp_earned: result.data.xp_earned,
        words_learned: result.data.words_learned,
        words_reviewed: result.data.words_reviewed,
        phrases_practiced: result.data.phrases_practiced,
        time_spent_minutes: result.data.time_spent_minutes,
        practice_sessions: 0, // Not in DB schema yet
        perfect_lessons: 0, // Not in DB schema yet
      }
    } catch (error) {
      console.error('Failed to fetch daily progress:', error)
      return null
    }
  }

  // Merge local and cloud data (most recent wins)
  mergeVocabulary(
    local: VocabularyWord[],
    cloud: VocabularyWord[]
  ): VocabularyWord[] {
    const merged = new Map<string, VocabularyWord>()

    // Add all local words
    local.forEach(word => merged.set(word.id, word))

    // Merge cloud words (keep most recent)
    cloud.forEach(cloudWord => {
      const localWord = merged.get(cloudWord.id)

      if (!localWord) {
        // Word only exists in cloud
        merged.set(cloudWord.id, cloudWord)
      } else {
        // Compare timestamps and keep most recent
        const localTimestamp = localWord.lastReviewedAt?.getTime() || localWord.addedAt.getTime()
        const cloudTimestamp = cloudWord.lastReviewedAt?.getTime() || cloudWord.addedAt.getTime()

        if (cloudTimestamp > localTimestamp) {
          merged.set(cloudWord.id, cloudWord)
        }
      }
    })

    return Array.from(merged.values())
  }

  // Merge phrase progress (most recent wins)
  mergePhraseProgress(
    local: PhraseProgress[],
    cloud: PhraseProgress[]
  ): PhraseProgress[] {
    const merged = new Map<string, PhraseProgress>()

    // Add all local progress
    local.forEach(p => merged.set(p.phraseId, p))

    // Merge cloud progress
    cloud.forEach(cloudProgress => {
      const localProgress = merged.get(cloudProgress.phraseId)

      if (!localProgress) {
        merged.set(cloudProgress.phraseId, cloudProgress)
      } else {
        // Keep most recently practiced
        const localTime = localProgress.lastPracticed?.getTime() || 0
        const cloudTime = cloudProgress.lastPracticed?.getTime() || 0

        if (cloudTime > localTime) {
          merged.set(cloudProgress.phraseId, cloudProgress)
        }
      }
    })

    return Array.from(merged.values())
  }

  // Full sync from cloud (merge with local)
  async syncFromCloud(userId: string): Promise<CloudData | null> {
    if (!this.isOnline()) {
      return null
    }

    if (this.syncInProgress) {
      console.log('Sync already in progress, skipping')
      return null
    }

    this.syncInProgress = true

    try {
      const [profile, vocabulary, phraseProgress, dailyProgress] = await Promise.all([
        this.fetchProfileFromCloud(userId),
        this.fetchVocabularyFromCloud(userId),
        this.fetchPhraseProgressFromCloud(userId),
        this.fetchDailyProgressFromCloud(userId),
      ])

      return {
        profile: profile || undefined,
        vocabulary,
        phraseProgress,
        dailyProgress: dailyProgress ? [dailyProgress] : [],
      }
    } catch (error) {
      console.error('Failed to sync from cloud:', error)
      return null
    } finally {
      this.syncInProgress = false
    }
  }

  // Full sync to cloud
  async syncToCloud(
    userId: string,
    data: {
      profile?: any
      vocabulary?: VocabularyWord[]
      phraseProgress?: PhraseProgress[]
      dailyProgress?: DailyProgress
    }
  ): Promise<SyncResult> {
    if (!this.isOnline()) {
      return { success: false, error: 'Offline' }
    }

    if (this.syncInProgress) {
      return { success: false, error: 'Sync in progress' }
    }

    this.syncInProgress = true

    try {
      const results = await Promise.all([
        data.profile ? this.syncProfileToCloud(userId, data.profile) : Promise.resolve({ success: true } as SyncResult),
        data.vocabulary ? this.syncVocabularyToCloud(userId, data.vocabulary) : Promise.resolve({ success: true } as SyncResult),
        data.phraseProgress ? this.syncPhraseProgressToCloud(userId, data.phraseProgress) : Promise.resolve({ success: true } as SyncResult),
        data.dailyProgress ? this.syncDailyProgressToCloud(userId, data.dailyProgress) : Promise.resolve({ success: true } as SyncResult),
      ])

      const allSuccessful = results.every(r => r.success)

      if (!allSuccessful) {
        const errors = results.filter(r => !r.success).map(r => r.error || 'Unknown error').join(', ')
        return { success: false, error: errors }
      }

      return { success: true, lastSynced: new Date() }
    } catch (error) {
      console.error('Failed to sync to cloud:', error)
      return { success: false, error: (error as Error).message }
    } finally {
      this.syncInProgress = false
    }
  }

  // Setup realtime sync for profile changes
  setupRealtimeSync(
    userId: string,
    onProfileUpdate?: (profile: any) => void,
    onVocabularyUpdate?: (vocabulary: VocabularyWord[]) => void
  ) {
    if (!this.isOnline()) {
      return
    }

    // Clean up existing channel
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel)
    }

    // Create new channel
    this.realtimeChannel = supabase
      .channel(`user-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('Profile updated in realtime:', payload)
          if (onProfileUpdate && payload.new) {
            onProfileUpdate(payload.new)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vocabulary',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          console.log('Vocabulary updated in realtime')
          if (onVocabularyUpdate) {
            const vocab = await this.fetchVocabularyFromCloud(userId)
            onVocabularyUpdate(vocab)
          }
        }
      )
      .subscribe()
  }

  // Stop realtime sync
  stopRealtimeSync() {
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel)
      this.realtimeChannel = null
    }
  }
}

// Export singleton instance
export const syncService = new SyncService()
