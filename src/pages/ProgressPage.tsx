import { motion } from 'framer-motion'
import { TrendingUp, Award, Target } from 'lucide-react'

export default function ProgressPage() {
  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-md mx-auto pt-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-6"
        >
          Your Progress
        </motion.h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard
            icon={TrendingUp}
            title="Streak"
            value="0 days"
            color="from-primary-500 to-primary-600"
          />
          <StatCard
            icon={Award}
            title="Total XP"
            value="0"
            color="from-accent-500 to-accent-600"
          />
          <StatCard
            icon={Target}
            title="Lessons"
            value="0/50"
            color="from-yellow-500 to-yellow-600"
          />
          <StatCard
            icon={Award}
            title="Achievements"
            value="0/20"
            color="from-green-500 to-green-600"
          />
        </div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Activity</h2>
          <div className="flex justify-between items-end h-32">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
              <div key={day} className="flex flex-col items-center gap-2">
                <div
                  className="w-8 bg-gray-200 rounded-t"
                  style={{ height: `${Math.random() * 100}%` }}
                />
                <span className="text-xs text-gray-600">{day}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ElementType
  title: string
  value: string
  color: string
}

function StatCard({ icon: Icon, title, value, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-4"
    >
      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${color} mb-2`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </motion.div>
  )
}
