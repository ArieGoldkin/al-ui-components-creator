import React, { useState } from "react";
import { Send, User, Bot, AlertCircle } from "lucide-react";
import type { ChatMessage } from "../types";
import { cn } from "../lib/utils";
import LoadingSpinner from "./LoadingSpinner";

interface ChatSidebarProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string) => void;
  onRetry?: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  isLoading,
  error,
  onSendMessage,
  onRetry,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">AI Form Builder</h2>
        <p className="text-sm text-gray-600 mt-1">
          Describe the form you want to create
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm">
              Start by describing the form you'd like to create.
            </p>
            <p className="text-xs mt-2 text-gray-400">
              Example: "Create a contact form with name, email, and message
              fields"
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start space-x-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                {message.content}
              </div>
              {message.role === "user" && (
                <div className="flex-shrink-0">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-lg px-3 py-2">
              <LoadingSpinner size="sm" text="Generating form..." />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex-1">
              <p className="text-sm text-red-800">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your form..."
            className="flex-1 resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={2}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={cn(
              "flex-shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              inputValue.trim() && !isLoading
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSidebar;
