import { useState, useEffect, useCallback, useRef } from "react";

const SIDEBAR_MIN_WIDTH = 280;
const SIDEBAR_MAX_WIDTH = 500;
const SIDEBAR_DEFAULT_WIDTH = 320;

export const useResizableSidebar = () => {
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);
  const isResizingRef = useRef<boolean>(false);

  // Load sidebar width from localStorage on mount
  useEffect(() => {
    const savedWidth = localStorage.getItem("sidebar-width");
    if (savedWidth) {
      const width = parseInt(savedWidth, 10);
      if (width >= SIDEBAR_MIN_WIDTH && width <= SIDEBAR_MAX_WIDTH) {
        setSidebarWidth(width);
      }
    }
  }, []);

  // Save sidebar width to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebar-width", sidebarWidth.toString());
  }, [sidebarWidth]);

  // Handle resize move with immediate response
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current) return;

    e.preventDefault();
    const deltaX = e.clientX - startXRef.current;
    const newWidth = Math.min(
      Math.max(startWidthRef.current + deltaX, SIDEBAR_MIN_WIDTH),
      SIDEBAR_MAX_WIDTH
    );

    setSidebarWidth(newWidth);
  }, []);

  // Handle resize end with immediate cleanup
  const handleResizeEnd = useCallback(() => {
    if (!isResizingRef.current) return;

    isResizingRef.current = false;
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    document.body.style.transition = "";

    // Remove event listeners immediately
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
    document.removeEventListener("mouseleave", handleResizeEnd);

    // Add a subtle haptic feedback effect (if supported)
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  }, [handleResizeMove]);

  // Handle resize start with immediate event listener attachment
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Set refs immediately for instant response
      isResizingRef.current = true;
      startXRef.current = e.clientX;
      startWidthRef.current = sidebarWidth;

      // Set state for UI feedback
      setIsResizing(true);

      // Apply cursor and selection styles immediately
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.body.style.transition = "cursor 0.1s ease";

      // Attach event listeners immediately - don't wait for state update
      document.addEventListener("mousemove", handleResizeMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleResizeEnd, { once: true });
      document.addEventListener("mouseleave", handleResizeEnd, { once: true });
    },
    [sidebarWidth, handleResizeMove, handleResizeEnd]
  );

  return {
    sidebarWidth,
    isResizing,
    resizeRef,
    handleResizeStart,
  };
};
