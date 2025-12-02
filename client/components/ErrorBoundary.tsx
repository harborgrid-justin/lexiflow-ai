import * as React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      this.props.resetKeys.some((key, index) => key !== prevProps.resetKeys![index])
    ) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-2xl w-full">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-destructive/10">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Something went wrong</CardTitle>
                    <CardDescription>
                      An unexpected error occurred in the application
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-foreground">
                        Error Message:
                      </h4>
                      <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20">
                        <code className="text-sm text-destructive font-mono">
                          {this.state.error.message}
                        </code>
                      </div>
                    </div>

                    {this.state.error.stack && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-foreground">
                          Stack Trace:
                        </h4>
                        <div className="p-4 rounded-md bg-muted border border-border max-h-64 overflow-auto">
                          <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      </div>
                    )}

                    {this.state.errorInfo && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-foreground">
                          Component Stack:
                        </h4>
                        <div className="p-4 rounded-md bg-muted border border-border max-h-64 overflow-auto">
                          <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {process.env.NODE_ENV === 'production' && (
                  <p className="text-sm text-muted-foreground">
                    We apologize for the inconvenience. Our team has been notified and is
                    working to fix the issue. Please try refreshing the page or contact
                    support if the problem persists.
                  </p>
                )}
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button onClick={this.reset} leftIcon={<RefreshCw className="h-4 w-4" />}>
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export type { ErrorBoundaryProps };
