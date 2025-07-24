import React, { useState, useEffect } from "react";
import { Menu, X, GripVertical } from "lucide-react";
import { cn } from "../lib/utils";
import ChatSidebar from "./ChatSidebar";
import ComponentPreview from "./ComponentPreview";
import CodePanel from "./CodePanel";
import { useResizableSidebar } from "../hooks/useResizableSidebar";
import type { AppState } from "../types";

interface LayoutProps {
  state: AppState;
  onSendMessage: (message: string) => void;
  onRetry?: () => void;
}

// Enhanced resize handle component
const ResizeHandle: React.FC<{
  isResizing: boolean;
  sidebarWidth: number;
  resizeRef: React.RefObject<HTMLDivElement | null>;
  handleResizeStart: (e: React.MouseEvent) => void;
}> = ({ isResizing, sidebarWidth, resizeRef, handleResizeStart }) => (
  <div
    ref={resizeRef}
    className={cn(
      "absolute top-0 right-0 w-2 h-full cursor-col-resize group transition-all duration-300 z-10",
      isResizing ? "bg-blue-400/30 w-3" : "hover:bg-blue-400/20"
    )}
    onMouseDown={handleResizeStart}
  >
    {/* Resize handle grip */}
    <div
      className={cn(
        "absolute top-1/2 -translate-y-1/2 -right-1.5 w-4 h-16 bg-gradient-to-r from-slate-300/80 to-slate-400/80 hover:from-blue-400/80 hover:to-blue-500/80 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 backdrop-blur-sm",
        isResizing
          ? "opacity-100 scale-110 from-blue-500/90 to-blue-600/90 shadow-blue-200/50"
          : "opacity-0 group-hover:opacity-100 hover:scale-105"
      )}
    >
      <GripVertical
        className={cn(
          "h-4 w-4 transition-colors duration-200",
          isResizing ? "text-white" : "text-slate-600 group-hover:text-white"
        )}
      />
    </div>

    {/* Enhanced width indicator when resizing */}
    {isResizing && (
      <div className="absolute top-6 -right-20 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm px-3 py-2 rounded-xl shadow-2xl border border-slate-700/50 backdrop-blur-sm animate-in fade-in-0 slide-in-from-left-2 duration-200">
        <div className="font-mono font-semibold">{sidebarWidth}px</div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-slate-800"></div>
      </div>
    )}

    {/* Resize guide line */}
    {isResizing && (
      <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 shadow-lg animate-pulse"></div>
    )}
  </div>
);

const Layout: React.FC<LayoutProps> = ({ state, onSendMessage, onRetry }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { sidebarWidth, isResizing, resizeRef, handleResizeStart } =
    useResizableSidebar();

  // Check if we're on desktop
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  return (
    <div
      className={cn(
        "h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20",
        isResizing && "select-none"
      )}
    >
      {/* Resize overlay */}
      {isResizing && <div className="fixed inset-0 z-50 cursor-col-resize" />}

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-out lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          width: isDesktop ? `${sidebarWidth}px` : "320px",
        }}
      >
        <ChatSidebar
          messages={state.messages}
          isLoading={state.isLoading}
          error={state.error}
          onSendMessage={onSendMessage}
          onRetry={onRetry}
        />

        {/* Enhanced Resize handle - only visible and functional on desktop */}
        {isDesktop && (
          <ResizeHandle
            isResizing={isResizing}
            sidebarWidth={sidebarWidth}
            resizeRef={resizeRef}
            handleResizeStart={handleResizeStart}
          />
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-white rounded-sm opacity-90"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                AI Component Builder
              </h1>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200 active:scale-95"
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Content area - Scrollable with smooth behavior */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
          <div className="min-h-full flex flex-col gap-2 p-2 lg:p-3">
            {/* Component preview */}
            <div className="flex-1 min-h-[400px] backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 transition-all duration-300 hover:shadow-2xl overflow-hidden">
              <ComponentPreview formSchema={state.currentSchema} />
            </div>

            {/* Code panel */}
            <div className="min-h-[16rem] lg:min-h-[20rem] backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 transition-all duration-300 hover:shadow-2xl overflow-hidden">
              <CodePanel code={state.generatedCode} />
            </div>

            {/* Bottom padding for better scrolling experience */}
            <div className="h-6 lg:h-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
