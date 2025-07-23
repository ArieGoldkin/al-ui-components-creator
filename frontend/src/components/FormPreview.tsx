import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { FormSchema, FormField } from "../types";
import { FileText, CheckCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface FormPreviewProps {
  schema: FormSchema | null;
  className?: string;
}

const FormPreview: React.FC<FormPreviewProps> = ({ schema, className }) => {
  // Create Zod schema from form fields
  const createValidationSchema = (fields: FormField[]) => {
    const schemaObject: Record<string, z.ZodTypeAny> = {};

    fields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny;

      switch (field.type) {
        case "email":
          fieldSchema = z.string().email("Invalid email address");
          break;
        case "number":
          fieldSchema = z.coerce.number();
          break;
        case "checkbox":
          fieldSchema = z.boolean();
          break;
        default:
          fieldSchema = z.string();
      }

      if (field.required && field.type !== "checkbox") {
        if (fieldSchema instanceof z.ZodString) {
          fieldSchema = fieldSchema.min(1, `${field.label} is required`);
        }
      }

      schemaObject[field.id] = fieldSchema;
    });

    return z.object(schemaObject);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: schema
      ? zodResolver(createValidationSchema(schema.fields))
      : undefined,
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    alert("Form submitted successfully! Check console for data.");
  };

  if (!schema) {
    return (
      <div
        className={cn(
          "h-full flex items-center justify-center bg-gray-50",
          className
        )}
      >
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No form generated yet
          </h3>
          <p className="text-gray-600 max-w-sm">
            Start a conversation in the chat to generate your form. Describe
            what kind of form you need and I'll create it for you.
          </p>
        </div>
      </div>
    );
  }

  const renderField = (field: FormField) => {
    const fieldError = errors[field.id];

    const baseInputClasses = cn(
      "w-full rounded-md border px-3 py-2 text-sm transition-colors",
      "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
      fieldError ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
    );

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
    <div className={cn("h-full overflow-y-auto bg-white", className)}>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {schema.title}
            </h2>
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Form generated successfully
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {schema.fields.map((field) => (
              <div key={field.id}>
                {field.type !== "checkbox" && (
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                )}

                {renderField(field)}

                {errors[field.id] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[field.id]?.message as string}
                  </p>
                )}
              </div>
            ))}

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
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
