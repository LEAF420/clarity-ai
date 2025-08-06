import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <Card className="shadow-xl max-w-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-800 dark:text-red-200">
                Something went wrong
              </CardTitle>
              <CardDescription className="text-lg">
                An unexpected error occurred during model import
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  Error Details
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                  {error?.message || 'Unknown error occurred'}
                </p>
                {error?.stack && (
                  <details className="text-xs text-red-600 dark:text-red-400">
                    <summary className="cursor-pointer">Show stack trace</summary>
                    <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
                  </details>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={this.handleReset}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Reload Page
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p>If this error persists, please:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Check the browser console for detailed error information</li>
                  <li>Ensure you have sufficient storage space (at least 2GB free)</li>
                  <li>Try using a different browser (Chrome, Edge, Firefox)</li>
                  <li>Check that the file is a valid .gguf model file</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 