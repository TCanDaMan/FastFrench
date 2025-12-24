/**
 * React Hook for Text-to-Speech
 * Provides easy-to-use TTS functionality for French pronunciation
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  stopSpeaking,
  isSpeaking,
  getAvailableVoices,
  getFrenchVoices,
  getBestFrenchVoice,
  preloadVoices,
  speakWithFallback,
  type TTSOptions,
  type FrenchVoice,
} from '../lib/tts'

export interface UseTTSOptions {
  lang?: 'fr-FR' | 'en-US'
  rate?: number
  pitch?: number
  voice?: string
  autoPreload?: boolean
}

export interface UseTTSReturn {
  speak: (text: string, options?: Partial<TTSOptions>) => Promise<void>
  stop: () => void
  speaking: boolean
  supported: boolean
  voices: SpeechSynthesisVoice[]
  frenchVoices: FrenchVoice[]
  bestFrenchVoice: SpeechSynthesisVoice | null
  selectedVoice: string | undefined
  setVoice: (voiceName: string) => void
  loading: boolean
  error: Error | null
}

export function useTTS(options: UseTTSOptions = {}): UseTTSReturn {
  const [speaking, setSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [frenchVoices, setFrenchVoices] = useState<FrenchVoice[]>([])
  const [bestFrenchVoice, setBestFrenchVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>(options.voice)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [supported, setSupported] = useState(true)

  const speakingRef = useRef(false)
  const checkIntervalRef = useRef<number>()

  // Initialize voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false)
      setLoading(false)
      setError(new Error('Speech synthesis not supported in this browser'))
      return
    }

    const initVoices = async () => {
      try {
        setLoading(true)
        await preloadVoices()

        const allVoices = getAvailableVoices()
        const french = getFrenchVoices()
        const best = getBestFrenchVoice()

        setVoices(allVoices)
        setFrenchVoices(french)
        setBestFrenchVoice(best)

        // Auto-select best French voice if none selected
        if (!selectedVoice && best) {
          setSelectedVoice(best.name)
        }

        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load voices'))
        setLoading(false)
      }
    }

    if (options.autoPreload !== false) {
      initVoices()
    }

    // Clean up
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [options.autoPreload, selectedVoice])

  // Monitor speaking state
  useEffect(() => {
    if (!supported) return

    const checkSpeaking = () => {
      const currentlySpeaking = isSpeaking()
      if (speakingRef.current !== currentlySpeaking) {
        speakingRef.current = currentlySpeaking
        setSpeaking(currentlySpeaking)
      }
    }

    // Check periodically
    checkIntervalRef.current = window.setInterval(checkSpeaking, 100)

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [supported])

  // Speak function
  const speakText = useCallback(
    async (text: string, speakOptions: Partial<TTSOptions> = {}) => {
      if (!supported) {
        const err = new Error('Speech synthesis not supported')
        setError(err)
        throw err
      }

      setError(null)

      const finalOptions: TTSOptions = {
        text,
        lang: speakOptions.lang || options.lang || 'fr-FR',
        rate: speakOptions.rate ?? options.rate ?? 0.9,
        pitch: speakOptions.pitch ?? options.pitch ?? 1.0,
        voice: speakOptions.voice || selectedVoice || options.voice,
        onStart: () => {
          setSpeaking(true)
          speakingRef.current = true
          speakOptions.onStart?.()
        },
        onEnd: () => {
          setSpeaking(false)
          speakingRef.current = false
          speakOptions.onEnd?.()
        },
        onError: (err) => {
          setError(err)
          setSpeaking(false)
          speakingRef.current = false
          speakOptions.onError?.(err)
        },
      }

      try {
        await speakWithFallback(text, finalOptions)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Speech failed')
        setError(error)
        throw error
      }
    },
    [supported, options, selectedVoice]
  )

  // Stop function
  const stop = useCallback(() => {
    stopSpeaking()
    setSpeaking(false)
    speakingRef.current = false
  }, [])

  // Set voice function
  const setVoice = useCallback((voiceName: string) => {
    setSelectedVoice(voiceName)
  }, [])

  return {
    speak: speakText,
    stop,
    speaking,
    supported,
    voices,
    frenchVoices,
    bestFrenchVoice,
    selectedVoice,
    setVoice,
    loading,
    error,
  }
}

/**
 * Hook for slow pronunciation practice
 */
export function useSlowTTS(baseRate: number = 0.6) {
  const tts = useTTS({ rate: baseRate })
  const [isSlowMode, setIsSlowMode] = useState(false)

  const speakSlow = useCallback(
    async (text: string) => {
      setIsSlowMode(true)
      try {
        await tts.speak(text, { rate: baseRate })
      } finally {
        setIsSlowMode(false)
      }
    },
    [tts, baseRate]
  )

  const speakNormal = useCallback(
    async (text: string) => {
      setIsSlowMode(false)
      await tts.speak(text, { rate: 0.9 })
    },
    [tts]
  )

  return {
    ...tts,
    speakSlow,
    speakNormal,
    isSlowMode,
  }
}

/**
 * Hook for voice selection UI
 */
export function useVoiceSelection() {
  const tts = useTTS()
  const [isOpen, setIsOpen] = useState(false)

  const selectVoice = useCallback(
    async (voiceName: string) => {
      tts.setVoice(voiceName)
      setIsOpen(false)

      // Preview the voice
      if (tts.frenchVoices.length > 0) {
        await tts.speak('Bonjour', { voice: voiceName })
      }
    },
    [tts]
  )

  return {
    ...tts,
    isOpen,
    setIsOpen,
    selectVoice,
  }
}
