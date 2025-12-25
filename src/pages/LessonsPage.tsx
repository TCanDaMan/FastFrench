import { motion } from 'framer-motion'
import { Lock, BookOpen } from 'lucide-react'

export default function LessonsPage() {
  const lessons = [
    { id: 1, title: 'Basic Greetings', level: 1, locked: false, progress: 0 },
    { id: 2, title: 'Numbers 1-10', level: 1, locked: true, progress: 0 },
    { id: 3, title: 'Common Phrases', level: 1, locked: true, progress: 0 },
    { id: 4, title: 'Food & Dining', level: 2, locked: true, progress: 0 },
    { id: 5, title: 'Directions', level: 2, locked: true, progress: 0 },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white" style={{ paddingBottom: '5rem', paddingTop: '5rem' }}>
      <div className="px-4 sm:px-6 lg:px-8" style={{ maxWidth: '64rem', marginInline: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Lessons</h1>
          <p className="text-zinc-400">Structured learning path to fluency</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '1rem' }}>
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LessonCard lesson={lesson} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface Lesson {
  id: number
  title: string
  level: number
  locked: boolean
  progress: number
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <motion.button
      whileHover={!lesson.locked ? { scale: 1.02 } : {}}
      whileTap={!lesson.locked ? { scale: 0.98 } : {}}
      disabled={lesson.locked}
      className={`w-full bg-zinc-900 rounded-2xl border border-zinc-700 p-6 text-left transition-all ${
        lesson.locked
          ? 'opacity-50 cursor-not-allowed grayscale'
          : 'hover:border-indigo-500 hover:bg-zinc-800'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            lesson.locked ? 'bg-zinc-800' : 'bg-indigo-500/20'
          }`}>
            {lesson.locked ? (
              <Lock className="w-6 h-6 text-zinc-500" />
            ) : (
              <BookOpen className="w-6 h-6 text-indigo-400" />
            )}
          </div>
          <div>
            <div className="text-sm text-zinc-400 mb-0.5">Level {lesson.level}</div>
            <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
          </div>
        </div>
      </div>

      {!lesson.locked && (
        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
            style={{ width: `${lesson.progress}%` }}
          />
        </div>
      )}

      {lesson.locked && (
        <div className="text-sm text-zinc-500 mt-2">Complete previous lessons to unlock</div>
      )}
    </motion.button>
  )
}
