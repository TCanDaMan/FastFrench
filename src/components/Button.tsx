import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'gradient-gold text-zinc-950 hover:shadow-glow-gold active:opacity-90',
  secondary: 'bg-zinc-800 text-white hover:bg-zinc-700 active:bg-zinc-600 border border-zinc-700',
  outline: 'border-2 border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-500 active:bg-zinc-700',
  ghost: 'text-zinc-400 hover:text-white hover:bg-zinc-800 active:bg-zinc-700',
  danger: 'bg-danger-600 text-white hover:bg-danger-500 active:bg-danger-700',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        className={`
          relative font-semibold rounded-xl transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={isDisabled}
        whileTap={!isDisabled ? { scale: 0.95 } : undefined}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {loading && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
          </motion.span>
        )}
        <span className={loading ? 'invisible' : ''}>
          {children as React.ReactNode}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
