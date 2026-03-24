import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ''
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let displayMessage = 'Something went wrong.';
      
      try {
        const parsedError = JSON.parse(this.state.errorMessage);
        if (parsedError.error && parsedError.error.includes('Missing or insufficient permissions')) {
          displayMessage = 'You do not have permission to perform this action. Please make sure you are logged in as an administrator.';
        } else if (parsedError.error) {
          displayMessage = `Error: ${parsedError.error}`;
        }
      } catch (e) {
        displayMessage = this.state.errorMessage || displayMessage;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-12 text-center bg-[var(--c-bg)]">
          <h2 className="display-font text-2xl font-medium mb-4">Application Error</h2>
          <p className="text-gray-600 mb-8 max-w-md">{displayMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
