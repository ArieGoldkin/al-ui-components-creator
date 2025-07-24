import React from "react";
import { Bot } from "lucide-react";
import CategorySelector from "../CategorySelector";
import type { ComponentCategory } from "../../types/categories";

interface ChatEmptyStateProps {
  onCategorySelect?: (category: ComponentCategory) => void;
}

const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  onCategorySelect,
}) => {
  return (
    <div className="text-center text-slate-500 mt-8">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg ring-4 ring-blue-50/50">
        <Bot className="h-10 w-10 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-3">
        Let's build your component together! ✨
      </h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed max-w-xs mx-auto">
        I'll help you create beautiful, functional components with modern UI
        libraries and styling
      </p>
      {/* Category Selector */}
      {onCategorySelect && (
        <div className="mt-8 max-w-4xl mx-auto">
          <CategorySelector onCategorySelect={onCategorySelect} />
        </div>
      )}

      {/* Quick Examples */}
      <div className="bg-gradient-to-br from-slate-50/90 to-blue-50/30 rounded-2xl p-5 text-left max-w-sm mx-auto border border-slate-200/40 shadow-sm mt-8">
        <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Or try these quick examples:
        </p>
        <ul className="text-xs text-slate-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">•</span>
            <span>"Create a responsive navbar with dropdown menu"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5">•</span>
            <span>"Build a product card with image and pricing"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-0.5">•</span>
            <span>"Design a success notification toast"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>"Make a contact form with validation"</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChatEmptyState;
