import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Code } from 'lucide-react';
import { cn } from '../lib/utils';

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
      console.error('Failed to copy code:', err);
    }
  };

  if (!code) {
    return (
      <div className={cn('bg-gray-50 border-t border-gray-200', className)}>
        <div className="p-4 text-center text-gray-500">
          <Code className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Generated code will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-gray-50 border-t border-gray-200', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span>Generated React Component</span>
        </button>
        
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      {isExpanded && (
        <div className="p-4">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
              <span className="text-xs text-gray-400 font-mono">
                FormComponent.tsx
              </span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
              <code className="language-typescript">{code}</code>
            </pre>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Usage:</strong> Copy this code and save it as a new React component. 
              Make sure you have the required dependencies installed: react-hook-form, zod, @hookform/resolvers.
            </p>
          </div>
        </div>
      )}

      {/* Collapsed Preview */}
      {!isExpanded && (
        <div className="p-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <pre className="text-xs text-gray-400 overflow-hidden">
              <code className="line-clamp-3">
                {code.split('\n').slice(0, 3).join('\n')}
                {code.split('\n').length > 3 && '\n...'}
              </code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodePanel;
