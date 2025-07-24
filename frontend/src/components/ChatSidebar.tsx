import React, { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";
import type { ChatMessage, ComponentCategory } from "../types";
import { cn } from "../lib/utils";
import LoadingSpinner from "./LoadingSpinner";
import ChatMessageComponent from "./ChatMessage";
import ErrorMessage from "./ErrorMessage";
import ChatHeader from "./ChatSidebar/ChatHeader";
import ChatEmptyState from "./ChatSidebar/ChatEmptyState";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea with smooth animation
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 4 * 24; // 4 rows * line height (24px for leading-6)
      const newHeight = Math.min(scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  };

  // Adjust height when input value changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCategorySelect = (category: ComponentCategory) => {
    // Send the message directly when a category is selected
    onSendMessage(category.suggestedPrompt);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white via-slate-50/50 to-slate-100/30 border-r border-slate-200/60 backdrop-blur-xl">
      <ChatHeader />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-4">
          {messages.length === 0 ? (
            <ChatEmptyState onCategorySelect={handleCategorySelect} />
          ) : (
            <div className="space-y-1">
              {messages.map((message, index) => (
                <ChatMessageComponent key={index} message={message} />
              ))}
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="px-4 pb-4">
            <div className="flex items-start gap-3 mb-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              <div className="flex-shrink-0 mt-1">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-emerald-100">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex flex-col items-start flex-1 min-w-0 max-w-[85%]">
                <div className="text-xs font-medium mb-2 px-1 text-emerald-600">
                  AI Assistant
                </div>
                <div className="relative px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border backdrop-blur-sm bg-gradient-to-br from-white to-slate-50/80 border-slate-200/60">
                  <div className="absolute w-3 h-3 transform rotate-45 bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 -bottom-1.5 left-2" />
                  <div className="relative z-10">
                    <LoadingSpinner size="sm" text="Generating component..." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="px-4 pb-4">
            <ErrorMessage error={error} onRetry={onRetry} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200/60 bg-gradient-to-r from-white/98 to-slate-50/98 backdrop-blur-sm">
        <form onSubmit={handleSubmit}>
          <div className="relative bg-white/98 border border-slate-200/60 rounded-2xl shadow-sm transition-all duration-300 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100/50 focus-within:shadow-lg focus-within:bg-white hover:shadow-md">
            <div className="flex items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your component in detail... ✨"
                  className="w-full resize-none bg-transparent px-4 py-3.5 text-sm placeholder-slate-400 border-0 outline-none focus:outline-none focus:ring-0 min-h-[52px] leading-6 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    height: "52px",
                    transition: "height 0.2s ease-out",
                    outline: "none",
                    boxShadow: "none",
                  }}
                  disabled={isLoading}
                />
                {/* Character count indicator */}
                {inputValue.length > 0 && (
                  <div className="absolute bottom-2.5 right-14 text-xs text-slate-400 pointer-events-none bg-white/80 px-2 py-1 rounded-full">
                    {inputValue.length}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 p-2">
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className={cn(
                    "rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 h-[36px] w-[36px] flex items-center justify-center relative overflow-hidden",
                    inputValue.trim() && !isLoading
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg hover:scale-105 ring-2 ring-blue-100/50"
                      : "bg-slate-200/80 text-slate-400 cursor-not-allowed"
                  )}
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Input hint */}
          <div className="flex items-center justify-between mt-3 px-1">
            <p className="text-xs text-slate-500">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono">
                Enter
              </kbd>{" "}
              to send,{" "}
              <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono">
                Shift+Enter
              </kbd>{" "}
              for new line
            </p>
            {messages.length > 0 && (
              <p className="text-xs text-slate-400">
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatSidebar;
