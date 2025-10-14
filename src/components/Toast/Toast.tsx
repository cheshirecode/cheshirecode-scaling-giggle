import type { ReactNode } from 'react';
import { useToast } from '../../hooks/useToast';
import type { Toast as ToastType } from '../../atoms/toastsAtom';
import styles from './Toast.module.css';

/**
 * Individual Toast component
 *
 * @example
 * ```tsx
 * <Toast
 *   toast={{ id: '1', type: 'success', message: 'Saved!' }}
 *   onClose={() => handleClose('1')}
 * />
 * ```
 */
interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

function Toast({ toast, onClose }: ToastProps): JSX.Element {
  const icons: Record<ToastType['type'], ReactNode> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`} role="alert">
      <span className={styles.icon}>{icons[toast.type]}</span>
      <div className={styles.content}>
        {toast.title && <div className={styles.title}>{toast.title}</div>}
        <div className={styles.message}>{toast.message}</div>
      </div>
      <button
        type="button"
        className={styles.closeButton}
        onClick={() => onClose(toast.id)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

/**
 * Toast container component that displays all active toasts
 * Uses Jotai atom for state management via useToast hook
 *
 * @example
 * ```tsx
 * // In App.tsx or layout
 * function App() {
 *   return (
 *     <>
 *       <YourContent />
 *       <ToastContainer />
 *     </>
 *   );
 * }
 *
 * // In any component
 * function MyComponent() {
 *   const { showToast } = useToast();
 *
 *   const handleSave = async () => {
 *     await saveData();
 *     showToast({
 *       type: 'success',
 *       title: 'Success!',
 *       message: 'Your changes have been saved.',
 *       duration: 3000
 *     });
 *   };
 * }
 * ```
 */
export function ToastContainer(): JSX.Element {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) {
    return <></>;
  }

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={hideToast} />
      ))}
    </div>
  );
}
