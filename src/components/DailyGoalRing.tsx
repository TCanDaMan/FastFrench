import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

interface DailyGoalRingProps {
  current: number;
  goal: number;
  className?: string;
}

export const DailyGoalRing = ({ current, goal, className = '' }: DailyGoalRingProps) => {
  const progress = Math.min((current / goal) * 100, 100);
  const isComplete = current >= goal;
  const radius = 70;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md p-6 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              stroke="#e5e7eb"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress circle */}
            <motion.circle
              stroke={isComplete ? '#10b981' : '#1e3a8a'}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                strokeDasharray: `${circumference} ${circumference}`,
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              animate={isComplete ? { scale: [1, 1.2, 1], rotate: 360 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Target
                size={28}
                className={isComplete ? 'text-green-600' : 'text-primary-900'}
              />
            </motion.div>
            <motion.span
              className={`text-2xl font-bold mt-1 ${
                isComplete ? 'text-green-600' : 'text-primary-900'
              }`}
              key={current}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              {current}
            </motion.span>
            <span className="text-sm text-gray-600">/ {goal} XP</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <h3 className="text-lg font-bold text-primary-900">Daily Goal</h3>
          {isComplete ? (
            <motion.p
              className="text-sm text-green-600 font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Goal completed! Great job!
            </motion.p>
          ) : (
            <p className="text-sm text-gray-600">
              {goal - current} XP remaining
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
