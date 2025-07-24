import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  return (
    <div className="p-4 mx-4 mb-4 bg-red-50/80 border border-red-200/60 rounded-xl backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-red-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-red-800 mb-1">Error</div>
          <div className="text-sm text-red-700 leading-relaxed">{error}</div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300/50"
              aria-label="Retry generating component"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
