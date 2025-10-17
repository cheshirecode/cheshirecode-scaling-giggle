import { Route, Switch } from 'wouter';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { Navigation } from '@/components/Navigation/Navigation';
import { useThemeInitializer } from '@/hooks/useThemeInitializer';
import { HomePage } from '@/pages/HomePage';
import { ApplicationFormPage } from '@/pages/ApplicationFormPage';
import { ApplicationsListPage } from '@/pages/ApplicationsListPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import './App.css';

/**
 * Main Application Component
 *
 * Routing structure:
 * - / : HomePage (Screen 1) - Products selection
 * - /apply/:productId : ApplicationFormPage (Screen 2) - Contact information form
 * - /applications : ApplicationsListPage (Screen 3) - List of applications
 * - * : NotFoundPage - 404 handler
 */
function App(): JSX.Element {
  // Initialize theme from localStorage
  useThemeInitializer();

  return (
    <ErrorBoundary>
      <div className="app">
        <Navigation />

        <main className="main">
          <Switch>
            <Route path="/">{() => <HomePage />}</Route>
            <Route path="/apply/:productId" component={ApplicationFormPage} />
            <Route path="/applications" component={ApplicationsListPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
