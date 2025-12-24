import { motion } from 'framer-motion';
import { LucideIcon, Lock } from 'lucide-react';
import { Badge } from './Badge';

interface AchievementCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  xpReward: number;
  unlocked: boolean;
  progress?: number;
  progressMax?: number;
  unlockedAt?: Date;
  className?: string;
}

export const AchievementCard = ({
  name,
  description,
  icon: Icon,
  xpReward,
  unlocked,
  progress,
  progressMax,
  unlockedAt,
  className = '',
}: AchievementCardProps) => {
  const showProgress = !unlocked && progress !== undefined && progressMax !== undefined;
  const progressPercentage = showProgress ? (progress! / progressMax!) * 100 : 0;

  return (
    <motion.div
      className={`
        bg-white rounded-xl shadow-md overflow-hidden
        ${unlocked ? 'border-2 border-green-500' : 'border-2 border-gray-200'}
        ${className}
      `}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <motion.div
            className={`
              rounded-full p-4 flex-shrink-0
              ${
                unlocked
                  ? 'bg-gradient-to-br from-green-400 to-green-600'
                  : 'bg-gray-200'
              }
            `}
            animate={unlocked ? { rotate: 360 } : {}}
            transition={{ duration: 0.6 }}
          >
            {unlocked ? (
              <Icon className="text-white" size={32} />
            ) : (
              <Lock className="text-gray-400" size={32} />
            )}
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3
                className={`text-lg font-bold ${
                  unlocked ? 'text-primary-900' : 'text-gray-500'
                }`}
              >
                {name}
              </h3>
              <Badge variant={unlocked ? 'success' : 'neutral'} size="sm">
                +{xpReward} XP
              </Badge>
            </div>

            <p
              className={`text-sm mb-3 ${
                unlocked ? 'text-gray-700' : 'text-gray-500'
              }`}
            >
              {description}
            </p>

            {/* Progress */}
            {showProgress && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Progress</span>
                  <span className="font-semibold">
                    {progress} / {progressMax}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-900 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Unlocked timestamp */}
            {unlocked && unlockedAt && (
              <p className="text-xs text-green-600 mt-2">
                Unlocked on {unlockedAt.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
