import React from "react";

const ChatHeader: React.FC = () => {
  return (
    <div className="p-6 border-b border-slate-200/60 bg-white/95 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-blue-100/50">
          <div className="w-5 h-5 bg-white rounded-md opacity-95 shadow-sm"></div>
        </div>
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            AI Component Builder
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-500 font-medium">Online</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/80 rounded-lg px-3 py-2 border border-slate-200/40">
        💬 Describe the component you want to create
      </p>
    </div>
  );
};

export default ChatHeader;
