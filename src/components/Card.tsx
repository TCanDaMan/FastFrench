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
        bg-white rounded-xl shadow-md overflow-hidden
        ${hoverable ? 'cursor-pointer' : ''}
        ${gradient ? 'border-t-4 border-primary-900' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={hoverable ? { y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {gradient && (
        <div className="h-1 bg-gradient-to-r from-primary-900 via-primary-600 to-accent-600" />
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
  return <div className={`px-6 py-4 bg-gray-50 ${className}`}>{children}</div>;
};
