import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Badge } from './Badge';
import { ProgressBar } from './ProgressBar';

interface XPDisplayProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  rank?: string;
  className?: string;
}

export const XPDisplay = ({
  currentXP,
  nextLevelXP,
  level,
  rank = 'Beginner',
  className = '',
}: XPDisplayProps) => {
  const progress = (currentXP / nextLevelXP) * 100;
  const xpNeeded = nextLevelXP - currentXP;

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="bg-gradient-to-br from-primary-900 to-primary-600 rounded-full p-3"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Zap className="text-white" size={24} fill="currentColor" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-primary-900">Level {level}</h3>
            <p className="text-sm text-gray-600">{rank}</p>
          </div>
        </div>
        <Badge variant="primary" size="lg">
          {currentXP} XP
        </Badge>
      </div>

      <ProgressBar progress={progress} showLabel={false} color="primary" />

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">
          {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
        </span>
        <span className="text-xs font-semibold text-primary-900">
          {xpNeeded.toLocaleString()} XP to next level
        </span>
      </div>
    </motion.div>
  );
};
