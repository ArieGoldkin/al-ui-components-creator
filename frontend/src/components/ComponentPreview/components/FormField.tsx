import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { FormField as FormFieldType } from "../../../types";
import { cn } from "../../../lib/utils";

interface FormFieldProps {
  field: FormFieldType;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors<Record<string, unknown>>;
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  register,
  errors,
}) => {
  const fieldError = errors[field.id];

  const baseInputClasses = cn(
    "w-full rounded-2xl border px-4 py-3 text-sm transition-all duration-200 shadow-sm",
    "focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:shadow-md",
    "placeholder-slate-400",
    fieldError
      ? "border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100/50"
      : "border-slate-200/60 bg-white/90 hover:border-slate-300"
  );

  const renderInput = () => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            {...register(field.id)}
            placeholder={field.placeholder}
            className={cn(baseInputClasses, "resize-none")}
            rows={4}
          />
        );

      case "select":
        return (
          <select {...register(field.id)} className={baseInputClasses}>
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              {...register(field.id)}
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">{field.label}</label>
          </div>
        );

      case "radio":
        return (
          <div className="space-y-3">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center gap-3">
                <input
                  {...register(field.id)}
                  type="radio"
                  value={option}
                  className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-slate-700">{option}</span>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <input
            {...register(field.id)}
            type={field.type}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {field.type !== "checkbox" && (
        <label className="block text-sm font-medium text-slate-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {fieldError && (
        <p className="text-sm text-red-600 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {fieldError.message as string}
        </p>
      )}
    </div>
  );
};

export default FormField;
