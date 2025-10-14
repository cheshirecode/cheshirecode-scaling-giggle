import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  center?: boolean;
  'aria-label'?: string;
}

export function Spinner({
  size = 'medium',
  center = false,
  'aria-label': ariaLabel = 'Loading',
}: SpinnerProps): JSX.Element {
  const spinnerClasses = [styles.spinner, size !== 'medium' && styles[size]]
    .filter(Boolean)
    .join(' ');

  const spinner = (
    <div
      className={spinnerClasses}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );

  if (center) {
    return <div className={styles.center}>{spinner}</div>;
  }

  return spinner;
}

