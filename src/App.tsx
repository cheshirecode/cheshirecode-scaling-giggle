import { Route, Switch } from 'wouter';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { Navigation } from '@/components/Navigation/Navigation';
import { useThemeInitializer } from '@/hooks/useThemeInitializer';
import './App.css';

// Placeholder pages (to be implemented)
function ProductsPage(): JSX.Element {
  return (
    <div className="page">
      <h1>Products</h1>
      <p>Product listings will appear here.</p>
    </div>
  );
}

function ApplicationsPage(): JSX.Element {
  return (
    <div className="page">
      <h1>My Applications</h1>
      <p>Your mortgage applications will appear here.</p>
    </div>
  );
}

function NotFoundPage(): JSX.Element {
  return (
    <div className="page">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

function App(): JSX.Element {
  // Initialize theme from localStorage
  useThemeInitializer();

  return (
    <ErrorBoundary>
      <div className="app">
        <Navigation />
        <main className="main">
          <Switch>
            <Route path="/" component={ProductsPage} />
            <Route path="/applications" component={ApplicationsPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
