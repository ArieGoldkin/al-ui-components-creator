import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "../../lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  className?: string;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 300,
  className,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculateBasePosition = useCallback(
    (triggerRect: DOMRect, tooltipRect: DOMRect) => {
      const positions = {
        top: {
          x: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
          y: triggerRect.top - tooltipRect.height - 8,
        },
        bottom: {
          x: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
          y: triggerRect.bottom + 8,
        },
        left: {
          x: triggerRect.left - tooltipRect.width - 8,
          y: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        },
        right: {
          x: triggerRect.right + 8,
          y: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        },
      };
      return positions[side];
    },
    [side]
  );

  const adjustForAlignment = useCallback(
    (
      position: { x: number; y: number },
      triggerRect: DOMRect,
      tooltipRect: DOMRect
    ) => {
      if (side === "top" || side === "bottom") {
        if (align === "start") position.x = triggerRect.left;
        if (align === "end") position.x = triggerRect.right - tooltipRect.width;
      } else {
        if (align === "start") position.y = triggerRect.top;
        if (align === "end")
          position.y = triggerRect.bottom - tooltipRect.height;
      }
      return position;
    },
    [side, align]
  );

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    let position = calculateBasePosition(triggerRect, tooltipRect);
    position = adjustForAlignment(position, triggerRect, tooltipRect);

    // Keep tooltip within viewport
    position.x = Math.max(
      8,
      Math.min(position.x, viewport.width - tooltipRect.width - 8)
    );
    position.y = Math.max(
      8,
      Math.min(position.y, viewport.height - tooltipRect.height - 8)
    );

    setPosition(position);
  }, [calculateBasePosition, adjustForAlignment]);

  const showTooltip = useCallback(() => {
    if (disabled) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delayDuration);
  }, [disabled, delayDuration, updatePosition]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (isVisible) {
      updatePosition();
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, updatePosition]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onTouchStart={showTooltip}
        onTouchEnd={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            "fixed z-50 px-3 py-2 text-sm text-white bg-slate-900 rounded-lg shadow-lg",
            "max-w-xs break-words pointer-events-none",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            className
          )}
          style={{
            left: position.x,
            top: position.y,
          }}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </>
  );
};

export default Tooltip;
