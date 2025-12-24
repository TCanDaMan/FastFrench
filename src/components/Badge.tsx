import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-900 border-primary-200',
  secondary: 'bg-gray-100 text-gray-900 border-gray-200',
  success: 'bg-green-100 text-green-900 border-green-200',
  warning: 'bg-yellow-100 text-yellow-900 border-yellow-200',
  danger: 'bg-accent-100 text-accent-900 border-accent-200',
  info: 'bg-blue-100 text-blue-900 border-blue-200',
  neutral: 'bg-gray-50 text-gray-700 border-gray-200',
};

const sizeStyles: Record<BadgeSize, { badge: string; dot: string; text: string }> = {
  sm: {
    badge: 'px-2 py-0.5',
    dot: 'w-1.5 h-1.5',
    text: 'text-xs',
  },
  md: {
    badge: 'px-2.5 py-1',
    dot: 'w-2 h-2',
    text: 'text-sm',
  },
  lg: {
    badge: 'px-3 py-1.5',
    dot: 'w-2.5 h-2.5',
    text: 'text-base',
  },
};

const dotColors: Record<BadgeVariant, string> = {
  primary: 'bg-primary-600',
  secondary: 'bg-gray-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  danger: 'bg-accent-600',
  info: 'bg-blue-600',
  neutral: 'bg-gray-500',
};

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  className = '',
}: BadgeProps) => {
  return (
    <motion.span
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-full border
        ${variantStyles[variant]}
        ${sizeStyles[size].badge}
        ${sizeStyles[size].text}
        ${className}
      `}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {dot && (
        <span className={`rounded-full ${dotColors[variant]} ${sizeStyles[size].dot}`} />
      )}
      {children}
    </motion.span>
  );
};
