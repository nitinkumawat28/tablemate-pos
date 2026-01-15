
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    private handleReset = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full border border-red-100">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="bg-red-100 p-3 rounded-full">
                                <AlertTriangle className="h-10 w-10 text-red-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
                            <p className="text-gray-600">
                                The application encountered an unexpected error.
                            </p>

                            <div className="w-full bg-gray-100 p-4 rounded-md overflow-auto text-left max-h-48 text-xs font-mono border border-gray-200">
                                <p className="font-bold text-red-600 mb-2">{this.state.error?.toString()}</p>
                                <pre className="text-gray-500 whitespace-pre-wrap">
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </div>

                            <div className="flex gap-4 w-full pt-4">
                                <Button variant="outline" className="flex-1" onClick={this.handleReset}>
                                    Clear Cache & Reset
                                </Button>
                                <Button className="flex-1" onClick={this.handleReload}>
                                    Reload Page
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
