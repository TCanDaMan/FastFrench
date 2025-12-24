import { motion, HTMLMotionProps } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { forwardRef } from 'react';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  icon: LucideIcon;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  'aria-label'?: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  primary: 'bg-primary-900 text-white hover:bg-primary-800 active:bg-primary-950',
  secondary: 'bg-primary-100 text-primary-900 hover:bg-primary-200 active:bg-primary-300',
  ghost: 'text-primary-900 hover:bg-primary-50 active:bg-primary-100',
  danger: 'bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800',
};

const sizeConfig: Record<IconButtonSize, { button: string; icon: number }> = {
  xs: { button: 'p-1', icon: 14 },
  sm: { button: 'p-2', icon: 16 },
  md: { button: 'p-3', icon: 20 },
  lg: { button: 'p-4', icon: 24 },
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      variant = 'primary',
      size = 'md',
      disabled,
      className = '',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const { button: buttonClass, icon: iconSize } = sizeConfig[size];

    return (
      <motion.button
        ref={ref}
        className={`
          rounded-full transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${buttonClass}
          ${className}
        `}
        disabled={disabled}
        aria-label={ariaLabel}
        whileTap={!disabled ? { scale: 0.9 } : undefined}
        whileHover={!disabled ? { scale: 1.05 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        <Icon size={iconSize} />
      </motion.button>
    );
  }
);

IconButton.displayName = 'IconButton';
