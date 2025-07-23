import React from "react";
import { Bot } from "lucide-react";

const ChatEmptyState: React.FC = () => {
  return (
    <div className="text-center text-slate-500 mt-8">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg ring-4 ring-blue-50/50">
        <Bot className="h-10 w-10 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-3">
        Let's build your form together! ✨
      </h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed max-w-xs mx-auto">
        I'll help you create beautiful, functional forms with validation and
        modern styling
      </p>
      <div className="bg-gradient-to-br from-slate-50/90 to-blue-50/30 rounded-2xl p-5 text-left max-w-sm mx-auto border border-slate-200/40 shadow-sm">
        <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Try these examples:
        </p>
        <ul className="text-xs text-slate-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>"Create a contact form with name, email, and message"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>"Make a signup form with password validation"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>"Build a registration form with dropdown options"</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatEmptyState;
