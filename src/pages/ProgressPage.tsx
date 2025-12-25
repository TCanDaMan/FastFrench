import { Flame, Trophy, Target, MessageCircle, Calendar, Lock } from 'lucide-react'
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
  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="min-h-screen bg-base">
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-24 lg:pt-24">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-text-primary text-2xl font-bold mb-1">Your Progress</h1>
          <p className="text-text-muted text-sm">Track your French learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            icon={Flame}
            iconColor="text-orange-500"
            value={currentStreak}
            subtitle="Day Streak"
          />
          <StatCard
            icon={Trophy}
            iconColor="text-gold"
            value={totalXp.toLocaleString()}
            subtitle="Total XP"
          />
          <StatCard
            icon={Target}
            iconColor="text-success"
            value={`${dailyProgress.current}/${dailyProgress.goal}`}
            subtitle="Daily Goal"
          />
          <StatCard
            icon={MessageCircle}
            iconColor="text-primary"
            value={stats.phrases_practiced}
            subtitle="Phrases"
          />
        </div>

        {/* Weekly Activity */}
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-text-primary font-semibold">Weekly Activity</h2>
            <div className="flex items-center gap-1.5 text-text-muted text-xs">
              <Calendar className="w-3.5 h-3.5" />
              This week
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex justify-between items-end h-32 gap-2 mb-4">
            {weeklyData.map((data, index) => {
              const height = maxXp > 0 ? (data.xp / maxXp) * 100 : 0
              const isToday = index === new Date().getDay() - 1 || (index === 6 && new Date().getDay() === 0)
              const metGoal = data.xp >= dailyProgress.goal

              return (
                <div key={index} className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full flex flex-col justify-end h-24">
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        isToday
                          ? 'bg-primary'
                          : metGoal
                            ? 'bg-success'
                            : 'bg-subtle'
                      }`}
                      style={{
                        height: `${height}%`,
                        minHeight: data.xp > 0 ? '4px' : '0'
                      }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-text-muted'}`}>
                    {data.day}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-5 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-success" />
              <span className="text-xs text-text-muted">Goal met</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
              <span className="text-xs text-text-muted">Today</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-text-primary font-semibold">Achievements</h2>
            <span className="text-xs text-text-muted">
              {unlockedCount}/{achievements.length} unlocked
            </span>
          </div>

          {achievements.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {achievements.slice(0, 8).map((achievement) => (
                <div
                  key={achievement.id}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                    achievement.unlocked
                      ? 'bg-gold/10 border border-gold/30'
                      : 'bg-elevated border border-border'
                  }`}
                  title={achievement.unlocked ? achievement.name : 'Locked'}
                >
                  {achievement.unlocked ? (
                    <span className="text-2xl">🏆</span>
                  ) : (
                    <Lock className="w-5 h-5 text-text-muted" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm text-center py-6">
              Practice to unlock achievements!
            </p>
          )}

          {achievements.length > 8 && (
            <button className="w-full mt-4 btn btn-ghost btn-sm">
              View all {achievements.length} achievements
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  iconColor,
  value,
  subtitle,
}: {
  icon: React.ElementType
  iconColor: string
  value: string | number
  subtitle: string
}) {
  return (
    <div className="stat-card">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{subtitle}</div>
    </div>
  )
}
