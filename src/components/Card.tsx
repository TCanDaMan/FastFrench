import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  hoverable?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export const Card = ({
  children,
  hoverable = false,
  gradient = false,
  onClick,
  className = '',
  ...props
}: CardProps) => {
  return (
    <motion.div
      className={`
        bg-zinc-900 border border-zinc-800 rounded-2xl shadow-card overflow-hidden
        ${hoverable ? 'cursor-pointer hover:border-zinc-700 hover:shadow-card-hover' : ''}
        ${gradient ? 'border-t-2 border-t-gold-500' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={hoverable ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      {...props}
    >
      {gradient && (
        <div className="h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500" />
      )}
      {children}
    </motion.div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export const CardBody = ({ children, className = '' }: CardBodyProps) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className = '' }: CardFooterProps) => {
  return <div className={`px-6 py-4 bg-zinc-800/50 border-t border-zinc-800 ${className}`}>{children}</div>;
};
