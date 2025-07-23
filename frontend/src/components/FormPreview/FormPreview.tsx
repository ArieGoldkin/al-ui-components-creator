import React from "react";
import type { FormSchema } from "../../types";
import { CheckCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { FormField, EmptyState } from "./components";
import { useFormPreview } from "./hooks";

interface FormPreviewProps {
  formSchema: FormSchema | null;
  className?: string;
}

export const FormPreview: React.FC<FormPreviewProps> = ({
  formSchema,
  className,
}) => {
  // Create a dummy schema for the hook when formSchema is null
  const dummySchema = { title: "", fields: [] };
  const { register, handleSubmit, errors } = useFormPreview(
    formSchema || dummySchema
  );

  if (!formSchema) {
    return (
      <div
        className={cn(
          "h-full flex items-center justify-center bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/30 rounded-2xl",
          className
        )}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-600 mb-2">
            No form to preview
          </h3>
          <p className="text-slate-500 max-w-sm">
            Generate a form using the chat interface to see a live preview here.
          </p>
        </div>
      </div>
    );
  }

  if (!formSchema.fields || formSchema.fields.length === 0) {
    return <EmptyState className={className} />;
  }

  return (
    <div
      className={cn(
        "h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 rounded-2xl",
        className
      )}
    >
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {formSchema.title}
            </h2>
            {formSchema.description && (
              <p className="text-slate-600 leading-relaxed">
                {formSchema.description}
              </p>
            )}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8 space-y-6"
          >
            {formSchema.fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                register={register}
                errors={errors}
              />
            ))}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-300/50 flex items-center justify-center gap-3"
              >
                <CheckCircle className="h-5 w-5" />
                Submit Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
