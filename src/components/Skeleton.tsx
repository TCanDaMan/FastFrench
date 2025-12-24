import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export const Skeleton = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animate = true,
}: SkeletonProps) => {
  const baseClass = 'bg-gray-200';
  const variantClass =
    variant === 'text'
      ? 'rounded h-4'
      : variant === 'circular'
      ? 'rounded-full'
      : 'rounded-lg';

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  const Component = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        animate: {
          opacity: [0.5, 1, 0.5],
        },
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }
    : {};

  return (
    <Component
      className={`${baseClass} ${variantClass} ${className}`}
      style={style}
      {...animationProps}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      <Skeleton width="60%" height={24} />
      <Skeleton width="100%" height={16} />
      <Skeleton width="80%" height={16} />
      <div className="flex gap-2 mt-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height={14} />
          <Skeleton width="50%" height={14} />
        </div>
      </div>
    </div>
  );
};

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
};
