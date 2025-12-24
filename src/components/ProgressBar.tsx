import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent' | 'success';
  animated?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const colorStyles = {
  primary: 'bg-primary-900',
  accent: 'bg-accent-600',
  success: 'bg-green-600',
};

export const ProgressBar = ({
  progress,
  showLabel = true,
  size = 'md',
  color = 'primary',
  animated = true,
  className = '',
}: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <motion.span
            className="text-sm font-bold text-primary-900"
            key={clampedProgress}
            initial={animated ? { scale: 1.2 } : undefined}
            animate={animated ? { scale: 1 } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            {Math.round(clampedProgress)}%
          </motion.span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        <motion.div
          className={`${sizeStyles[size]} ${colorStyles[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
};
