/**
 * French Phonetics Helper
 * Provides pronunciation tips for difficult French sounds
 */

export interface PhoneticTip {
  sound: string
  description: string
  example: string
  englishApproximation?: string
  lipPosition?: string
}

/**
 * French sounds with pronunciation guidance
 */
export const FRENCH_SOUNDS: Record<string, PhoneticTip> = {
  // Vowels
  'u': {
    sound: 'u',
    description: 'Round your lips like saying "oo" but try to say "ee"',
    example: 'tu (you)',
    englishApproximation: 'No English equivalent - unique to French',
    lipPosition: 'Lips forward and rounded, tongue forward',
  },
  'ou': {
    sound: 'ou',
    description: 'Like "oo" in "food"',
    example: 'vous (you formal)',
    englishApproximation: 'food, moon',
    lipPosition: 'Lips rounded',
  },
  'eu': {
    sound: 'eu/œ',
    description: 'Like "uh" but with rounded lips',
    example: 'peu (little)',
    englishApproximation: 'Similar to "uh" in "but" with rounded lips',
    lipPosition: 'Lips slightly rounded',
  },
  'on': {
    sound: 'on/ɔ̃',
    description: 'Nasal "o" - say "oh" while blocking nose',
    example: 'bon (good)',
    englishApproximation: 'No direct equivalent - nasal vowel',
    lipPosition: 'Lips rounded, air through nose',
  },
  'an/en': {
    sound: 'an/ɑ̃',
    description: 'Nasal "ah" - say "ah" while blocking nose',
    example: 'dans (in)',
    englishApproximation: 'Similar to "on" in "song" but more nasal',
    lipPosition: 'Mouth open, air through nose',
  },
  'in/un': {
    sound: 'in/ɛ̃',
    description: 'Nasal "eh" - between "an" and "on"',
    example: 'vin (wine)',
    englishApproximation: 'No direct equivalent - nasal vowel',
    lipPosition: 'Mouth slightly open, air through nose',
  },

  // Consonants
  'r': {
    sound: 'r',
    description: 'Guttural "r" from back of throat (like gargling)',
    example: 'rouge (red)',
    englishApproximation: 'Like clearing throat gently',
    lipPosition: 'Tongue back, air flows from throat',
  },
  'j': {
    sound: 'j/ʒ',
    description: 'Like "s" in "measure" or "vision"',
    example: 'je (I)',
    englishApproximation: 'pleasure, measure',
    lipPosition: 'Tongue near roof of mouth',
  },
  'gn': {
    sound: 'gn/ɲ',
    description: 'Like "ny" in "canyon"',
    example: 'champagne',
    englishApproximation: 'onion, canyon',
    lipPosition: 'Tongue touches palate',
  },
  'ch': {
    sound: 'ch/ʃ',
    description: 'Like "sh" in "shoe"',
    example: 'chat (cat)',
    englishApproximation: 'shoe, fish',
    lipPosition: 'Lips slightly forward',
  },

  // Common combinations
  'oi': {
    sound: 'oi/wa',
    description: 'Like "wa" in "wand"',
    example: 'moi (me)',
    englishApproximation: 'wand, want',
    lipPosition: 'Glide from rounded to open',
  },
  'ai/ei': {
    sound: 'ai/ɛ',
    description: 'Like "e" in "pet"',
    example: 'mais (but)',
    englishApproximation: 'pet, met',
    lipPosition: 'Mouth half-open',
  },
}

/**
 * Common pronunciation patterns
 */
export const PRONUNCIATION_RULES = [
  {
    rule: 'Silent final consonants',
    description: 'Most final consonants are not pronounced',
    examples: ['temps (time)', 'chez (at)', 'est (is)'],
    exception: 'Exceptions: C, R, F, L (think "CaReFuL")',
  },
  {
    rule: 'Liaisons',
    description: 'Connect final consonant to next vowel',
    examples: ['vous êtes → "vou-zet"', 'les amis → "le-zami"'],
    exception: 'Only when words are closely related',
  },
  {
    rule: 'Final "e"',
    description: 'Usually silent in French',
    examples: ['rouge (red)', 'grande (big)'],
    exception: 'Except in short words like "le", "je"',
  },
  {
    rule: 'H is always silent',
    description: 'Never pronounce the letter H',
    examples: ['hôtel → "otel"', 'homme → "omme"'],
    exception: 'Some words with "h aspiré" prevent liaison',
  },
]

/**
 * Get pronunciation tips for a word
 */
export function getPronunciationTips(word: string): PhoneticTip[] {
  const tips: PhoneticTip[] = []
  const wordLower = word.toLowerCase()

  // Check for each sound pattern
  Object.entries(FRENCH_SOUNDS).forEach(([pattern, tip]) => {
    if (wordLower.includes(pattern)) {
      tips.push(tip)
    }
  })

  // Remove duplicates based on sound
  const uniqueTips = tips.filter(
    (tip, index, self) => index === self.findIndex((t) => t.sound === tip.sound)
  )

  return uniqueTips
}

/**
 * Detect difficult sounds for English speakers
 */
export function getDifficultSounds(word: string): PhoneticTip[] {
  const difficultPatterns = ['r', 'u', 'eu', 'on', 'an', 'en', 'in', 'un', 'j', 'gn']
  const tips = getPronunciationTips(word)

  return tips.filter((tip) =>
    difficultPatterns.some((pattern) => tip.sound.includes(pattern))
  )
}

/**
 * Get mouth/lip position emoji based on sound
 */
export function getLipPositionEmoji(sound: string): string {
  const emojiMap: Record<string, string> = {
    'u': '😗', // Rounded lips forward
    'ou': '😮', // Rounded lips
    'eu': '😯', // Slightly rounded
    'on': '😮', // Rounded with nose
    'an': '😲', // Open mouth
    'in': '😐', // Slightly open
    'r': '😤', // Throat sound
    'oi': '😮', // Wide to rounded
  }

  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (sound.includes(key)) {
      return emoji
    }
  }

  return '😊' // Default
}

/**
 * Check if word has nasal vowels
 */
export function hasNasalVowels(word: string): boolean {
  return /[aeiou]n(?![aeiou])|[aeiou]m(?![aeiou])/i.test(word)
}

/**
 * Check if word has silent letters
 */
export function hasSilentLetters(word: string): boolean {
  // Common silent patterns: final e, h, many final consonants
  return /e$|^h|[^cfrln]$/i.test(word)
}

/**
 * Get practice difficulty level
 */
export function getDifficultyLevel(word: string): 'easy' | 'medium' | 'hard' {
  const difficultSounds = getDifficultSounds(word)
  const hasNasal = hasNasalVowels(word)
  const hasSilent = hasSilentLetters(word)

  let score = 0
  score += difficultSounds.length
  if (hasNasal) score += 1
  if (hasSilent) score += 1

  if (score >= 3) return 'hard'
  if (score >= 1) return 'medium'
  return 'easy'
}

/**
 * Break word into syllables (simplified algorithm)
 */
export function syllabify(word: string): string[] {
  // Simple French syllabification rules
  const syllables: string[] = []
  let current = ''

  const vowels = 'aeiouyàâäéèêëïîôùûü'

  for (let i = 0; i < word.length; i++) {
    const char = word[i].toLowerCase()
    current += word[i]

    // Check if we should break syllable
    if (vowels.includes(char)) {
      // Look ahead for consonants
      let nextConsonants = ''
      let j = i + 1
      while (j < word.length && !vowels.includes(word[j].toLowerCase())) {
        nextConsonants += word[j]
        j++
      }

      // If multiple consonants, split between them
      if (nextConsonants.length > 1) {
        current += nextConsonants[0]
        syllables.push(current)
        current = nextConsonants.slice(1)
        i = j - nextConsonants.length + 1
      } else if (nextConsonants.length === 1) {
        // Single consonant goes with next syllable
        if (j < word.length) {
          syllables.push(current)
          current = nextConsonants
          i = j - 1
        } else {
          current += nextConsonants
        }
      }
    }
  }

  if (current) {
    syllables.push(current)
  }

  return syllables.filter((s) => s.length > 0)
}

/**
 * Format phonetic notation with highlighting
 */
export function formatPhonetic(phonetic: string): {
  formatted: string
  highlights: { start: number; end: number; type: 'nasal' | 'r' | 'difficult' }[]
} {
  const highlights: { start: number; end: number; type: 'nasal' | 'r' | 'difficult' }[] = []

  // Detect nasal vowels (ɛ̃, ɑ̃, ɔ̃, œ̃)
  const nasalRegex = /[ɛɑɔœ]̃/g
  let match
  while ((match = nasalRegex.exec(phonetic)) !== null) {
    highlights.push({
      start: match.index,
      end: match.index + 2,
      type: 'nasal',
    })
  }

  // Detect French r (ʁ)
  const rRegex = /[ʁr]/g
  while ((match = rRegex.exec(phonetic)) !== null) {
    highlights.push({
      start: match.index,
      end: match.index + 1,
      type: 'r',
    })
  }

  // Detect difficult sounds (ʒ, ɲ, y)
  const difficultRegex = /[ʒɲy]/g
  while ((match = difficultRegex.exec(phonetic)) !== null) {
    highlights.push({
      start: match.index,
      end: match.index + 1,
      type: 'difficult',
    })
  }

  return {
    formatted: phonetic,
    highlights,
  }
}

/**
 * ============================================
 * LIAISON DETECTION SYSTEM
 * ============================================
 * French liaisons connect a normally silent final consonant
 * to a following word that starts with a vowel sound.
 */

// Words that commonly trigger liaisons when followed by vowels
const LIAISON_TRIGGERS = {
  // Articles and determiners
  articles: ['les', 'des', 'ces', 'mes', 'tes', 'ses', 'nos', 'vos', 'leurs', 'un', 'aux'],
  // Pronouns
  pronouns: ['nous', 'vous', 'ils', 'elles', 'on', 'en'],
  // Common prepositions and adverbs
  prepositions: ['dans', 'sans', 'sous', 'chez', 'très', 'plus', 'moins', 'bien', 'trop'],
  // Adjectives before nouns
  adjectives: ['petit', 'grand', 'gros', 'bon', 'mauvais', 'ancien', 'nouveau', 'premier', 'dernier'],
  // Verbs (especially être forms)
  verbs: ['est', 'sont', 'ont', 'était', 'étaient', 'avait', 'avaient'],
  // Numbers
  numbers: ['deux', 'trois', 'six', 'dix', 'vingt', 'cent'],
}

// All liaison trigger words flattened
const ALL_LIAISON_WORDS = Object.values(LIAISON_TRIGGERS).flat()

// Vowel sounds that allow liaison
const VOWEL_START_REGEX = /^[aeiouyàâäéèêëïîôùûüœæh]/i

// H aspiré words (block liaison despite starting with h)
const H_ASPIRE_WORDS = [
  'haricot', 'héros', 'honte', 'haut', 'huit', 'hibou', 'hamster',
  'hasard', 'hache', 'haie', 'hall', 'handicap', 'hareng', 'harem'
]

export interface LiaisonPoint {
  wordIndex: number
  word: string
  nextWord: string
  liaisonSound: string  // The sound that connects: z, t, n, etc.
  displayMark: string   // How to display: word‿nextWord
}

/**
 * Get the liaison sound for a word ending
 */
function getLiaisonSound(word: string): string | null {
  const lastChar = word.slice(-1).toLowerCase()
  const lastTwo = word.slice(-2).toLowerCase()

  // Common liaison sounds
  if (lastChar === 's' || lastChar === 'x' || lastTwo === 'ez') return 'z'
  if (lastChar === 't' || lastChar === 'd') return 't'
  if (lastChar === 'n') return 'n'
  if (lastChar === 'r') return 'ʁ'
  if (lastTwo === 'ng') return 'g' // Rare

  return null
}

/**
 * Check if a word starts with a vowel sound (allowing liaison)
 */
function startsWithVowelSound(word: string): boolean {
  if (!word) return false

  // Check for h aspiré (blocks liaison)
  if (H_ASPIRE_WORDS.some(h => word.toLowerCase().startsWith(h))) {
    return false
  }

  return VOWEL_START_REGEX.test(word)
}

/**
 * Detect all liaison points in a phrase
 */
export function detectLiaisons(phrase: string): LiaisonPoint[] {
  const words = phrase.split(/\s+/).filter(w => w.length > 0)
  const liaisons: LiaisonPoint[] = []

  for (let i = 0; i < words.length - 1; i++) {
    const currentWord = words[i].toLowerCase().replace(/[.,!?;:]/g, '')
    const nextWord = words[i + 1].replace(/[.,!?;:]/g, '')

    // Check if current word triggers liaison
    if (ALL_LIAISON_WORDS.includes(currentWord)) {
      // Check if next word starts with vowel sound
      if (startsWithVowelSound(nextWord)) {
        const liaisonSound = getLiaisonSound(currentWord)
        if (liaisonSound) {
          liaisons.push({
            wordIndex: i,
            word: words[i],
            nextWord: words[i + 1],
            liaisonSound,
            displayMark: `${words[i]}‿${words[i + 1]}`
          })
        }
      }
    }
  }

  return liaisons
}

/**
 * Get phrase with liaison marks (‿) connecting words
 */
export function getPhraseWithLiaisonMarks(phrase: string): string {
  const liaisons = detectLiaisons(phrase)

  if (liaisons.length === 0) {
    return phrase
  }

  const words = phrase.split(/(\s+)/)
  const result: string[] = []

  for (let i = 0; i < words.length; i++) {
    const word = words[i]

    // Check if this word has a liaison to the next
    const liaison = liaisons.find(l =>
      l.word === word || l.word === word.replace(/[.,!?;:]/g, '')
    )

    if (liaison && i + 2 < words.length) {
      // Add word with liaison mark, skip the space
      result.push(word + '‿')
      i++ // Skip the space
    } else {
      result.push(word)
    }
  }

  return result.join('')
}

/**
 * Get pronunciation guide for a phrase including liaisons
 */
export function getPhrasePronunciationGuide(phrase: string): {
  original: string
  withLiaisons: string
  liaisonPoints: LiaisonPoint[]
  tips: string[]
} {
  const liaisonPoints = detectLiaisons(phrase)
  const withLiaisons = getPhraseWithLiaisonMarks(phrase)

  const tips: string[] = []

  // Generate tips for each liaison
  liaisonPoints.forEach(liaison => {
    tips.push(`Connect "${liaison.word}" to "${liaison.nextWord}" with a [${liaison.liaisonSound}] sound`)
  })

  // Add general tips if there are liaisons
  if (liaisonPoints.length > 0) {
    tips.push('Liaisons make your French sound more natural and fluid')
  }

  return {
    original: phrase,
    withLiaisons,
    liaisonPoints,
    tips,
  }
}
