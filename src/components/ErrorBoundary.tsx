import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#f3ece3] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#d7c7b7] p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-[#4b2e23] mb-4">
              Щось пішло не так
            </h1>
            <p className="text-[#7a6a5d] mb-6">
              Вибачте за незручності. Спробуйте оновити сторінку або повернутися
              на головну.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <p className="text-sm font-mono text-red-800">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                onClick={this.handleReset}
                className="bg-[#5e3d2b] hover:bg-[#4a2f21] text-white rounded-full"
              >
                Оновити сторінку
              </Button>

              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="rounded-full border-[#c0a894]"
              >
                На головну
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
