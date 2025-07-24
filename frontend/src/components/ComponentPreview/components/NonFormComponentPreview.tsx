import React from "react";
import type { FormSchema } from "../../../types";
import { Code2 } from "lucide-react";
import { cn } from "../../../lib/utils";

interface NonFormComponentPreviewProps {
  formSchema: FormSchema;
  className?: string;
}

export const NonFormComponentPreview: React.FC<NonFormComponentPreviewProps> = ({
  formSchema,
  className,
}) => {
  return (
    <div
      className={cn(
        "h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 rounded-2xl",
        className
      )}
    >
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          {/* Component Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Code2 className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {formSchema.title}
            </h2>
            {formSchema.description && (
              <p className="text-slate-600 leading-relaxed">
                {formSchema.description}
              </p>
            )}
          </div>

          {/* Component Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8 space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                Component Generated Successfully
              </h3>
              <p className="text-slate-600 mb-6">
                Your {formSchema.type} component has been generated and is ready to use. 
                Check the code panel to see the implementation.
              </p>
              
              {/* Component Type Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <Code2 className="h-4 w-4" />
                {(formSchema.type || "Component").charAt(0).toUpperCase() +
                  (formSchema.type || "component").slice(1)}{" "}
                Component
              </div>
              
              {/* Dependencies */}
              {formSchema.dependencies && formSchema.dependencies.length > 0 && (
                <div className="mt-6 p-4 bg-slate-50 rounded-2xl">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Dependencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {formSchema.dependencies.map((dep: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white text-slate-600 rounded-lg text-xs border"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Usage Example */}
              {formSchema.usage && (
                <div className="mt-6 p-4 bg-slate-50 rounded-2xl text-left">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Usage Example</h4>
                  <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono">
                    {formSchema.usage}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
