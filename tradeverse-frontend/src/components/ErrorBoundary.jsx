import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-main)"
                }}>
                    <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Something went wrong.</h2>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
                        We apologize for the inconvenience. Please try refreshing the page.
                    </p>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary"
                        >
                            Refresh Page
                        </button>
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            style={{
                                padding: "0.75rem 1.5rem",
                                borderRadius: "var(--radius-md)",
                                border: "1px solid var(--text-secondary)",
                                background: "transparent",
                                color: "var(--text-secondary)",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                    {process.env.NODE_ENV === 'development' && (
                        <pre style={{
                            marginTop: '2rem',
                            background: 'rgba(0,0,0,0.3)',
                            padding: '1rem',
                            borderRadius: '8px',
                            textAlign: 'left',
                            overflow: 'auto',
                            maxWidth: '800px',
                            color: '#ef4444'
                        }}>
                            {this.state.error?.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
