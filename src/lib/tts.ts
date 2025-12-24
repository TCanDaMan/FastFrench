/**
 * Text-to-Speech Library for FastFrench
 * Provides offline TTS with Web Speech API and optional Azure Speech Services
 */

export interface TTSOptions {
  text: string
  lang?: 'fr-FR' | 'en-US'
  rate?: number // 0.5 to 2.0
  pitch?: number // 0 to 2
  voice?: string // voice name
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: Error) => void
}

export interface FrenchVoice {
  voice: SpeechSynthesisVoice
  priority: number
  name: string
  gender: 'female' | 'male' | 'unknown'
}

// Voice quality priority order for French
const VOICE_PRIORITY: Record<string, number> = {
  'Amélie': 100, // macOS - excellent quality
  'Thomas': 95, // macOS - good quality
  'Microsoft Hortense': 90, // Windows
  'Google français': 85, // Chrome
  'Microsoft Julie': 80, // Windows
  'Daniel (Premium)': 75, // macOS premium
  'Google': 70, // Generic Google voice
  'Microsoft': 65, // Generic Microsoft voice
}

let voicesLoaded = false
let availableVoices: SpeechSynthesisVoice[] = []

/**
 * Preload voices - some browsers require this initialization
 */
export function preloadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported')
      resolve([])
      return
    }

    if (voicesLoaded) {
      resolve(availableVoices)
      return
    }

    const loadVoices = () => {
      availableVoices = speechSynthesis.getVoices()
      if (availableVoices.length > 0) {
        voicesLoaded = true
        resolve(availableVoices)
      }
    }

    // Try immediate load
    loadVoices()

    // Also listen for voiceschanged event (Chrome needs this)
    if (!voicesLoaded) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        loadVoices()
      })

      // Timeout fallback
      setTimeout(() => {
        if (!voicesLoaded) {
          loadVoices()
        }
      }, 1000)
    }
  })
}

/**
 * Get all available voices
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) {
    return []
  }

  if (!voicesLoaded) {
    availableVoices = speechSynthesis.getVoices()
    if (availableVoices.length > 0) {
      voicesLoaded = true
    }
  }

  return availableVoices
}

/**
 * Get all French voices with priority scoring
 */
export function getFrenchVoices(): FrenchVoice[] {
  const voices = getAvailableVoices()
  const frenchVoices: FrenchVoice[] = []

  voices.forEach((voice) => {
    if (voice.lang.startsWith('fr')) {
      let priority = 50 // Default priority

      // Check against known voice priorities
      for (const [voiceName, voicePriority] of Object.entries(VOICE_PRIORITY)) {
        if (voice.name.includes(voiceName)) {
          priority = voicePriority
          break
        }
      }

      // Boost priority for fr-FR (France French) vs other French variants
      if (voice.lang === 'fr-FR') {
        priority += 10
      }

      // Try to detect gender from name
      let gender: 'female' | 'male' | 'unknown' = 'unknown'
      const nameLower = voice.name.toLowerCase()
      if (
        nameLower.includes('amélie') ||
        nameLower.includes('julie') ||
        nameLower.includes('hortense') ||
        nameLower.includes('female')
      ) {
        gender = 'female'
        // Prefer female voices for learning (generally clearer)
        priority += 5
      } else if (
        nameLower.includes('thomas') ||
        nameLower.includes('daniel') ||
        nameLower.includes('male')
      ) {
        gender = 'male'
      }

      frenchVoices.push({
        voice,
        priority,
        name: voice.name,
        gender,
      })
    }
  })

  // Sort by priority (highest first)
  return frenchVoices.sort((a, b) => b.priority - a.priority)
}

/**
 * Get the best available French voice
 */
export function getBestFrenchVoice(): SpeechSynthesisVoice | null {
  const frenchVoices = getFrenchVoices()
  return frenchVoices.length > 0 ? frenchVoices[0].voice : null
}

/**
 * Check if currently speaking
 */
export function isSpeaking(): boolean {
  if (!('speechSynthesis' in window)) {
    return false
  }
  return speechSynthesis.speaking
}

/**
 * Stop current speech
 */
export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel()
  }
}

/**
 * Speak text using Web Speech API
 */
export function speak(options: TTSOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      const error = new Error('Speech synthesis not supported in this browser')
      options.onError?.(error)
      reject(error)
      return
    }

    // Stop any ongoing speech
    stopSpeaking()

    const utterance = new SpeechSynthesisUtterance(options.text)

    // Set language (default to French)
    utterance.lang = options.lang || 'fr-FR'

    // Set rate (default to 0.9 for learning - slightly slower)
    utterance.rate = options.rate ?? 0.9

    // Set pitch (default to 1.0)
    utterance.pitch = options.pitch ?? 1.0

    // Set voice if specified, otherwise use best French voice
    if (options.voice) {
      const voices = getAvailableVoices()
      const selectedVoice = voices.find(v => v.name === options.voice)
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }
    } else if (utterance.lang === 'fr-FR') {
      const bestVoice = getBestFrenchVoice()
      if (bestVoice) {
        utterance.voice = bestVoice
      }
    }

    // Set up event handlers
    utterance.onstart = () => {
      options.onStart?.()
    }

    utterance.onend = () => {
      options.onEnd?.()
      resolve()
    }

    utterance.onerror = (event) => {
      const error = new Error(`Speech synthesis error: ${event.error}`)
      options.onError?.(error)
      reject(error)
    }

    // Speak
    try {
      speechSynthesis.speak(utterance)
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown speech error')
      options.onError?.(err)
      reject(err)
    }
  })
}

/**
 * Check if Azure Speech Services is configured
 */
export function isAzureConfigured(): boolean {
  return !!(
    import.meta.env.VITE_AZURE_SPEECH_KEY &&
    import.meta.env.VITE_AZURE_SPEECH_REGION
  )
}

/**
 * Speak using Azure Speech Services (premium quality)
 * Requires VITE_AZURE_SPEECH_KEY and VITE_AZURE_SPEECH_REGION env vars
 */
export async function speakWithAzure(
  text: string,
  options: {
    voice?: string // e.g., 'fr-FR-DeniseNeural'
    rate?: number
    onStart?: () => void
    onEnd?: () => void
    onError?: (error: Error) => void
  } = {}
): Promise<void> {
  if (!isAzureConfigured()) {
    throw new Error('Azure Speech Services not configured')
  }

  const apiKey = import.meta.env.VITE_AZURE_SPEECH_KEY
  const region = import.meta.env.VITE_AZURE_SPEECH_REGION
  const voice = options.voice || 'fr-FR-DeniseNeural' // Premium French female voice

  // Calculate rate for SSML (Azure uses percentages)
  const rate = options.rate ?? 1.0
  const ratePercent = `${Math.round((rate - 1) * 100)}%`

  // Build SSML
  const ssml = `
    <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='fr-FR'>
      <voice name='${voice}'>
        <prosody rate='${ratePercent}'>
          ${text}
        </prosody>
      </voice>
    </speak>
  `

  try {
    options.onStart?.()

    const response = await fetch(
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        },
        body: ssml,
      }
    )

    if (!response.ok) {
      throw new Error(`Azure TTS failed: ${response.statusText}`)
    }

    // Play the audio
    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl)
      options.onEnd?.()
    }

    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl)
      const error = new Error('Failed to play Azure audio')
      options.onError?.(error)
    }

    await audio.play()
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown Azure error')
    options.onError?.(err)
    throw err
  }
}

/**
 * Speak with fallback: try Azure first, then Web Speech API
 */
export async function speakWithFallback(
  text: string,
  options: Partial<TTSOptions> = {}
): Promise<void> {
  if (isAzureConfigured()) {
    try {
      await speakWithAzure(text, {
        rate: options.rate,
        onStart: options.onStart,
        onEnd: options.onEnd,
        onError: options.onError,
      })
      return
    } catch (error) {
      console.warn('Azure TTS failed, falling back to Web Speech API', error)
    }
  }

  // Fallback to Web Speech API
  return speak({ ...options, text })
}
