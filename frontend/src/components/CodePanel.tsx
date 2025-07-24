import React, { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check, Code } from "lucide-react";
import { cn } from "../lib/utils";

interface CodePanelProps {
  code: string;
  className?: string;
}

const CodePanel: React.FC<CodePanelProps> = ({ code, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  if (!code) {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/30 rounded-2xl",
          className
        )}
      >
        <div className="p-8 text-center text-slate-500 h-full flex items-center justify-center">
          <div>
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Code className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Generated code will appear here
            </h3>
            <p className="text-slate-500 text-sm">
              React component code will be displayed once a component is
              generated
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/30 rounded-2xl",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 text-slate-700 hover:text-slate-900 transition-colors duration-200"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <Code className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-lg">
            Generated React Component
          </span>
          <div className="ml-2">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-slate-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-500" />
            )}
          </div>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/90 hover:bg-white border border-slate-200/60 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-slate-600" />
              <span className="text-slate-700">Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      {isExpanded && (
        <div className="p-6">
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
            <div className="flex items-center justify-between px-6 py-3 bg-slate-800/80 backdrop-blur-sm">
              <span className="text-sm text-slate-300 font-mono font-medium">
                Component.tsx
              </span>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
              </div>
            </div>
            <pre className="p-6 text-sm text-slate-100 overflow-x-auto leading-relaxed">
              <code className="language-typescript">{code}</code>
            </pre>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong className="font-semibold">Usage:</strong> Copy this
                  code and save it as a new React component. Make sure you have
                  the required dependencies installed. Check the component
                  preview for specific dependency requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Preview */}
      {!isExpanded && (
        <div className="p-6">
          <div className="bg-slate-900 rounded-2xl p-4 shadow-lg border border-slate-700/50">
            <pre className="text-xs text-slate-400 overflow-hidden leading-relaxed">
              <code className="line-clamp-3">
                {code.split("\n").slice(0, 3).join("\n")}
                {code.split("\n").length > 3 && "\n..."}
              </code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodePanel;
