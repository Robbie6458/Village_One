import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback || (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-b from-space to-void", children: _jsxs("div", { className: "text-center p-8", children: [_jsx("h1", { className: "text-2xl font-bold text-neon-cyan mb-4", children: "Village-One Dashboard" }), _jsx("p", { className: "text-gray-400 mb-4", children: "Loading community data..." }), _jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-purple-deep text-white rounded hover:bg-purple-700", children: "Refresh" })] }) }));
        }
        return this.props.children;
    }
}
