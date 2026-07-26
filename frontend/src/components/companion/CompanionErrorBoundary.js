import React from "react";

class CompanionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, dismissed: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Companion error:", error);
    }
  }

  render() {
    if (this.state.dismissed) {
      return null;
    }

    if (this.state.hasError) {
      return (
        <aside className="companion-fallback" role="status">
          <p>The learning companion is temporarily unavailable.</p>
          <p>You can continue the lesson normally.</p>
          <button
            type="button"
            onClick={() => this.setState({ dismissed: true })}
            aria-label="Dismiss companion unavailable message"
          >
            Dismiss
          </button>
        </aside>
      );
    }

    return this.props.children;
  }
}

export default CompanionErrorBoundary;
