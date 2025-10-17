import { Component, type ReactNode, type ErrorInfo } from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourApp />
 * </ErrorBoundary>
 *
 * // With custom fallback
 * <ErrorBoundary fallback={(error) => <div>Custom error: {error.message}</div>}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you might want to log to an error tracking service
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error && errorInfo) {
      if (fallback) {
        return fallback(error, errorInfo);
      }

      return (
        <div className={'errorBoundary'} role="alert">
          <div className={'container'}>
            <h1 className={'title'}>⚠️ Something went wrong</h1>
            <p className={'message'}>
              We're sorry, but something unexpected happened. Please try refreshing the page or
              contact support if the problem persists.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details className={'details'}>
                <summary className={'summary'}>Error Details (Development Only)</summary>
                <div className={'errorContent'}>
                  <h3>Error:</h3>
                  <pre className={'pre'}>{error.toString()}</pre>
                  <h3>Stack Trace:</h3>
                  <pre className={'pre'}>{errorInfo.componentStack}</pre>
                </div>
              </details>
            )}

            <button type="button" className={'resetButton'} onClick={this.handleReset}>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}
