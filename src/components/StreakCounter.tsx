import { motion } from 'framer-motion';
import { Flame, Snowflake } from 'lucide-react';
import { Badge } from './Badge';

interface StreakCounterProps {
  streak: number;
  freezes?: number;
  maxStreak?: number;
  className?: string;
}

export const StreakCounter = ({
  streak,
  freezes = 0,
  maxStreak,
  className = '',
}: StreakCounterProps) => {
  const isOnFire = streak >= 7;

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            className={`rounded-full p-4 ${
              isOnFire
                ? 'bg-gradient-to-br from-orange-500 to-red-600'
                : 'bg-gradient-to-br from-orange-400 to-orange-500'
            }`}
            animate={
              isOnFire
                ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Flame className="text-white" size={32} fill="currentColor" />
          </motion.div>

          <div>
            <div className="flex items-baseline gap-2">
              <motion.span
                className="text-4xl font-bold text-primary-900"
                key={streak}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                {streak}
              </motion.span>
              <span className="text-lg text-gray-600">day streak</span>
            </div>
            {maxStreak !== undefined && maxStreak > streak && (
              <p className="text-sm text-gray-500 mt-1">
                Personal best: {maxStreak} days
              </p>
            )}
          </div>
        </div>

        {freezes > 0 && (
          <Badge variant="info" size="md" dot>
            <Snowflake size={14} />
            <span>{freezes} freeze{freezes !== 1 ? 's' : ''}</span>
          </Badge>
        )}
      </div>

      {isOnFire && (
        <motion.div
          className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm font-semibold text-orange-900 flex items-center gap-2">
            <Flame size={16} fill="currentColor" />
            You're on fire! Keep the streak alive!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
