export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface FormField {
  id: string;
  type:
    | "text"
    | "email"
    | "number"
    | "textarea"
    | "checkbox"
    | "select"
    | "radio"
    | "password"
    | "tel";
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    patternMessage?: string;
  };
  options?: string[];
}

export interface FormSchema {
  title: string;
  description?: string;
  fields: FormField[];
  // Extended properties for component builder
  type?: string; // Component type (navigation, data_display, feedback, forms, etc.)
  dependencies?: string[]; // Required packages/dependencies
  usage?: string; // Usage example code
}

// Generic component types for the AI Component Builder
export interface ComponentSchema {
  title: string;
  description?: string;
  componentType: string;
  fields?: FormField[]; // For form components
  props?: Record<string, unknown>; // For other component types
}

export interface AppState {
  messages: ChatMessage[];
  currentSchema: FormSchema | null; // Keep for backward compatibility
  generatedCode: string;
  isLoading: boolean;
  error: string | null;
}

// Re-export category types
export type { ComponentCategory, CategorySelectorProps } from "./categories";
