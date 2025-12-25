import { motion } from 'framer-motion'
import { Flame, Trophy, Target, MessageCircle, Calendar } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useGamification } from '../hooks/useGamification'

export default function ProgressPage() {
  const { profile } = useAuth()
  const { dailyProgress, stats, achievements } = useGamification()

  const currentStreak = profile?.current_streak || 0
  const totalXp = profile?.total_xp || 0

  // Placeholder weekly data - would come from API in real app
  const weeklyData = [
    { day: 'M', xp: 15 },
    { day: 'T', xp: 25 },
    { day: 'W', xp: 10 },
    { day: 'T', xp: 30 },
    { day: 'F', xp: 20 },
    { day: 'S', xp: 5 },
    { day: 'S', xp: 0 },
  ]

  const maxXp = Math.max(...weeklyData.map(d => d.xp), dailyProgress.goal)

  return (
    <div className="min-h-screen bg-zinc-950 text-white" style={{ paddingBottom: '5rem', paddingTop: '5rem' }}>
      <div className="px-4 sm:px-6 lg:px-8 mx-auto" style={{ maxWidth: '72rem' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Your Progress</h1>
          <p className="text-zinc-400">Track your French learning journey</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            icon={Flame}
            title="Day Streak"
            value={`${currentStreak}`}
            subtitle="days"
            iconColor="text-orange-400"
            iconBg="bg-orange-500/20"
          />
          <StatCard
            icon={Trophy}
            title="Total XP"
            value={`${totalXp}`}
            subtitle="points"
            iconColor="text-yellow-400"
            iconBg="bg-yellow-500/20"
          />
          <StatCard
            icon={Target}
            title="Daily Goal"
            value={`${dailyProgress.current}/${dailyProgress.goal}`}
            subtitle="XP today"
            iconColor="text-emerald-400"
            iconBg="bg-emerald-500/20"
          />
          <StatCard
            icon={MessageCircle}
            title="Phrases"
            value={`${stats.phrases_practiced}`}
            subtitle="practiced"
            iconColor="text-purple-400"
            iconBg="bg-purple-500/20"
          />
        </div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Weekly Activity</h2>
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <Calendar className="w-4 h-4" />
              This week
            </div>
          </div>

          <div className="flex justify-between items-end h-40 gap-2">
            {weeklyData.map((data, index) => {
              const height = maxXp > 0 ? (data.xp / maxXp) * 100 : 0
              const isToday = index === new Date().getDay() - 1 || (index === 6 && new Date().getDay() === 0)

              return (
                <div key={index} className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full flex flex-col justify-end" style={{ height: '8rem' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={`w-full rounded-t-lg ${
                        isToday
                          ? 'bg-gradient-to-t from-indigo-600 to-purple-500'
                          : data.xp >= dailyProgress.goal
                            ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                            : 'bg-zinc-700'
                      }`}
                      style={{ minHeight: data.xp > 0 ? '0.5rem' : '0' }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${isToday ? 'text-indigo-400' : 'text-zinc-500'}`}>
                    {data.day}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-zinc-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-t from-emerald-600 to-emerald-400" />
              <span className="text-xs text-zinc-400">Goal met</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-t from-indigo-600 to-purple-500" />
              <span className="text-xs text-zinc-400">Today</span>
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Achievements</h2>
            <span className="text-sm text-zinc-400">
              {achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked
            </span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {achievements.length > 0 ? (
              achievements.slice(0, 8).map((achievement) => (
                <div
                  key={achievement.id}
                  className={`aspect-square rounded-xl flex items-center justify-center ${
                    achievement.unlocked
                      ? 'bg-gold-500/20 border border-gold-500/50'
                      : 'bg-zinc-800'
                  }`}
                  title={achievement.unlocked ? achievement.name : 'Locked'}
                >
                  <span className={`text-3xl ${achievement.unlocked ? '' : 'opacity-30 grayscale'}`}>
                    🏆
                  </span>
                </div>
              ))
            ) : (
              <p className="col-span-4 sm:col-span-6 text-zinc-500 text-center py-4">
                Practice to unlock achievements!
              </p>
            )}
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
  subtitle: string
  iconColor: string
  iconBg: string
}

function StatCard({ icon: Icon, title, value, subtitle, iconColor, iconBg }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5"
    >
      <div className={`inline-flex p-3 rounded-xl ${iconBg} mb-3`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div className="text-sm text-zinc-400 mb-1">{title}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-zinc-500">{subtitle}</div>
    </motion.div>
  )
}
