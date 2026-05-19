import styles from './Button.module.css';
import { cn } from '@/lib/utils';
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  isLoading?: boolean;
};

export function Button({ className, children, isLoading, ...props }: ButtonProps) {
  return (
    <button className={cn(styles.root, className)} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
