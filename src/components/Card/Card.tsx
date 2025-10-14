import { HTMLAttributes } from 'react';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  children: React.ReactNode;
}

export function Card({
  interactive = false,
  className,
  children,
  ...props
}: CardProps): JSX.Element {
  const classes = [styles.card, interactive && styles.interactive, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

