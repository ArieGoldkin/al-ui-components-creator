import React from "react";
import { FileText } from "lucide-react";
import { cn } from "../../../lib/utils";

interface EmptyStateProps {
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "h-full flex items-center justify-center bg-gradient-to-br from-yellow-50/80 via-orange-50/40 to-amber-50/30 rounded-2xl",
        className
      )}
    >
      <div className="text-center">
        <FileText className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-yellow-900 mb-2">
          No component fields generated
        </h3>
        <p className="text-yellow-600 max-w-sm">
          The component was generated but contains no fields. Try being more
          specific about what you need.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
