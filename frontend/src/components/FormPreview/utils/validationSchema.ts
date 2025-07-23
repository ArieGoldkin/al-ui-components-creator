import { z } from "zod";
import type { FormField as FormFieldType } from "../../../types";

const createBaseSchema = (fieldType: string): z.ZodTypeAny => {
  switch (fieldType) {
    case "email":
      return z.string().email("Invalid email address");
    case "number":
      return z.coerce.number();
    case "tel":
      return z
        .string()
        .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, {
          message: "Invalid phone number format",
        });
    case "password":
      return z
        .string()
        .min(8, { message: "Password must be at least 8 characters" });
    case "checkbox":
      return z.boolean();
    default:
      return z.string();
  }
};

const applyRequiredValidation = (
  schema: z.ZodTypeAny,
  field: FormFieldType
): z.ZodTypeAny => {
  if (!field.required) return schema;

  if (field.type === "number") {
    return (schema as z.ZodNumber).refine(
      (val) => val !== undefined && val !== null,
      { message: `${field.label} is required` }
    );
  }

  if (field.type !== "checkbox") {
    return (schema as z.ZodString).min(1, {
      message: `${field.label} is required`,
    });
  }

  return schema;
};

const applyLengthValidations = (
  schema: z.ZodString,
  field: FormFieldType
): z.ZodString => {
  let stringSchema = schema;

  if (field.validation?.minLength) {
    stringSchema = stringSchema.min(field.validation.minLength, {
      message: `${field.label} must be at least ${field.validation.minLength} characters`,
    });
  }

  if (field.validation?.maxLength) {
    stringSchema = stringSchema.max(field.validation.maxLength, {
      message: `${field.label} must be at most ${field.validation.maxLength} characters`,
    });
  }

  return stringSchema;
};

const applyPatternValidation = (
  schema: z.ZodString,
  field: FormFieldType
): z.ZodString => {
  if (!field.validation?.pattern) return schema;

  try {
    const pattern = new RegExp(field.validation.pattern);
    return schema.regex(pattern, {
      message:
        field.validation.patternMessage || `Invalid format for ${field.label}`,
    });
  } catch {
    console.error("Invalid regex pattern:", field.validation.pattern);
    return schema;
  }
};

const applyStringValidations = (
  schema: z.ZodTypeAny,
  field: FormFieldType
): z.ZodTypeAny => {
  if (!field.validation) return schema;

  const isStringField = [
    "text",
    "email",
    "password",
    "tel",
    "textarea",
  ].includes(field.type);
  if (!isStringField) return schema;

  let stringSchema = schema as z.ZodString;
  stringSchema = applyLengthValidations(stringSchema, field);
  stringSchema = applyPatternValidation(stringSchema, field);

  return stringSchema;
};

export const createValidationSchema = (fields: FormFieldType[]) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema = createBaseSchema(field.type);
    fieldSchema = applyRequiredValidation(fieldSchema, field);
    fieldSchema = applyStringValidations(fieldSchema, field);
    schemaObject[field.id] = fieldSchema;
  });

  return z.object(schemaObject);
};
