import { useNavigate } from 'react-router-dom'
import { Flame, Trophy, Target, BookOpen, MessageCircle, BarChart3, ChevronRight, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useGamification } from '../hooks/useGamification'

export default function HomePage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { dailyProgress } = useGamification()

  const displayName = profile?.display_name || 'Learner'
  const totalXp = profile?.total_xp || 0
  const currentStreak = profile?.current_streak || 0
  const level = Math.floor(Math.sqrt(totalXp / 100)) + 1
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 100
  const xpForNextLevel = Math.pow(level, 2) * 100
  const xpProgress = totalXp - xpForCurrentLevel
  const xpNeeded = xpForNextLevel - xpForCurrentLevel
  const levelProgress = xpNeeded > 0 ? (xpProgress / xpNeeded) * 100 : 0

  const dailyGoalProgress = dailyProgress.goal > 0
    ? (dailyProgress.current / dailyProgress.goal) * 100
    : 0

  return (
    <div className="min-h-screen bg-base">
      {/* Page Container */}
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-24 lg:pt-24">

        {/* User Profile Card */}
        <div className="card p-5 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="w-14 h-14 rounded-full bg-elevated border border-border flex items-center justify-center hover:border-border-hover transition-colors"
            >
              <User className="w-6 h-6 text-text-secondary" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-text-muted text-sm">Welcome back</p>
              <h1 className="text-text-primary text-xl font-semibold truncate">
                Bonjour, {displayName}!
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-text-secondary text-sm">Level {level}</span>
                <span className="text-text-muted">•</span>
                <span className="text-text-muted text-sm">{xpNeeded - xpProgress} XP to next</span>
              </div>
            </div>
          </div>
          {/* Level Progress Bar */}
          <div className="mt-4">
            <div className="progress-bar">
              <div
                className="progress-fill progress-fill-primary"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Streak */}
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="stat-value">{currentStreak}</div>
            <div className="stat-label">Day Streak</div>
          </div>

          {/* Total XP */}
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-gold" />
            </div>
            <div className="stat-value">{totalXp.toLocaleString()}</div>
            <div className="stat-label">Total XP</div>
          </div>

          {/* Daily Goal */}
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-success" />
            </div>
            <div className="stat-value">{dailyProgress.current}/{dailyProgress.goal}</div>
            <div className="stat-label">Daily Goal</div>
            <div className="progress-bar mt-2">
              <div
                className="progress-fill progress-fill-success"
                style={{ width: `${Math.min(dailyGoalProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Paris Countdown Hero */}
        <div className="card p-6 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-purple-600/10" />
          <div className="relative">
            <p className="text-text-muted text-sm font-medium mb-1">Paris Trip Countdown</p>
            <p className="text-text-primary text-4xl font-bold mb-2">~100 days</p>
            <p className="text-text-secondary text-sm mb-4">Keep your streak alive!</p>
            <button
              onClick={() => navigate('/practice')}
              className="btn btn-primary btn-md"
            >
              Continue Learning
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-30">
            🗼
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-text-primary font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard
              icon={BookOpen}
              title="Practice"
              subtitle="110 words due"
              onClick={() => navigate('/practice')}
            />
            <QuickActionCard
              icon={MessageCircle}
              title="Phrases"
              subtitle="79 phrases"
              onClick={() => navigate('/phrases')}
            />
            <QuickActionCard
              icon={Target}
              title="Daily Review"
              subtitle="Start session"
              onClick={() => navigate('/practice')}
            />
            <QuickActionCard
              icon={BarChart3}
              title="Progress"
              subtitle="View stats"
              onClick={() => navigate('/progress')}
            />
          </div>
        </div>

        {/* Pro Tip */}
        <div className="card p-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm">💡</span>
            </div>
            <div>
              <p className="text-text-primary text-sm font-medium mb-1">Pro Tip</p>
              <p className="text-text-muted text-sm">
                Practice for just 10 minutes a day to build a lasting habit. Consistency beats intensity!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function QuickActionCard({
  icon: Icon,
  title,
  subtitle,
  onClick
}: {
  icon: React.ElementType
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="card p-4 text-left hover:border-border-hover transition-all group"
    >
      <div className="w-10 h-10 rounded-lg bg-elevated border border-border flex items-center justify-center mb-3 group-hover:border-border-hover transition-colors">
        <Icon className="w-5 h-5 text-text-secondary" />
      </div>
      <p className="text-text-primary font-medium">{title}</p>
      <p className="text-text-muted text-sm">{subtitle}</p>
    </button>
  )
}
