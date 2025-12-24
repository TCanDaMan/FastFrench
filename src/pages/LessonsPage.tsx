import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

export default function LessonsPage() {
  const lessons = [
    { id: 1, title: 'Basic Greetings', level: 1, locked: false, progress: 0 },
    { id: 2, title: 'Numbers 1-10', level: 1, locked: true, progress: 0 },
    { id: 3, title: 'Common Phrases', level: 1, locked: true, progress: 0 },
  ]

  return (
    <div className="min-h-screen pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto pt-8 lg:pt-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-6"
        >
          Lessons
        </motion.h1>

        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
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
      className={`w-full bg-white rounded-xl shadow-lg p-6 text-left transition-all ${
        lesson.locked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-gray-500 mb-1">Level {lesson.level}</div>
          <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
        </div>
        {lesson.locked && (
          <Lock className="w-6 h-6 text-gray-400" />
        )}
      </div>

      {!lesson.locked && (
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all"
            style={{ width: `${lesson.progress}%` }}
          />
        </div>
      )}
    </motion.button>
  )
}
