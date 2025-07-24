import React from "react";
import { User, Bot } from "lucide-react";
import type { ChatMessage } from "../types";
import { cn } from "../lib/utils";

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 mb-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg ring-2 ring-blue-100">
            <User className="h-4 w-4 text-white" />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-lg ring-2 ring-emerald-100">
            <Bot className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col items-start flex-1 min-w-0 max-w-[85%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Message Label */}
        <div
          className={cn(
            "text-xs font-semibold mb-2 px-1",
            isUser ? "text-blue-600" : "text-emerald-600"
          )}
        >
          {isUser ? "You" : "AI Assistant"}
        </div>

        {/* Message Bubble */}
        <div
          className={cn(
            "relative px-4 py-3 rounded-2xl shadow-sm border backdrop-blur-sm transition-all duration-200 hover:shadow-md",
            isUser
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400/20 rounded-br-md"
              : "bg-gradient-to-br from-white to-slate-50/80 text-slate-800 border-slate-200/60 rounded-bl-md"
          )}
        >
          {/* Message Tail - Perfect gradient matching */}
          <div
            className={cn(
              "absolute w-3 h-3 transform rotate-45 -bottom-1.5",
              isUser
                ? "bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400/20 right-2"
                : "bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 left-2"
            )}
          />

          {/* Message Text */}
          <div
            className={cn(
              "text-sm leading-relaxed whitespace-pre-wrap break-words relative z-10",
              isUser ? "text-white/95" : "text-slate-800"
            )}
          >
            {message.content}
          </div>
        </div>

        {/* Timestamp */}
        {message.timestamp && (
          <div
            className={cn(
              "text-xs text-slate-400 mt-1 px-1",
              isUser ? "text-right" : "text-left"
            )}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageComponent;
