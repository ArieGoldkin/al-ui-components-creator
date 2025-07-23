import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "../lib/utils";
import ChatSidebar from "./ChatSidebar";
import FormPreview from "./FormPreview";
import CodePanel from "./CodePanel";
import type { AppState } from "../types";

interface LayoutProps {
  state: AppState;
  onSendMessage: (message: string) => void;
  onRetry?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ state, onSendMessage, onRetry }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ChatSidebar
          messages={state.messages}
          isLoading={state.isLoading}
          error={state.error}
          onSendMessage={onSendMessage}
          onRetry={onRetry}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">
              AI Form Builder
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col">
          {/* Form preview */}
          <div className="flex-1">
            <FormPreview schema={state.currentSchema} />
          </div>

          {/* Code panel */}
          <div className="h-64 lg:h-80">
            <CodePanel code={state.generatedCode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
