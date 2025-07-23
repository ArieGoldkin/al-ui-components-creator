import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormSchema } from "../../../types";
import { createValidationSchema } from "../utils";

export const useFormPreview = (formSchema: FormSchema) => {
  const validationSchema = createValidationSchema(formSchema.fields);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, unknown>>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = (data: Record<string, unknown>) => {
    console.log("Form submitted:", data);
    alert("Form submitted successfully! Check console for data.");
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
  };
};
