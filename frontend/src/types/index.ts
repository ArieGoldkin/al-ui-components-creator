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
}

export interface AppState {
  messages: ChatMessage[];
  currentSchema: FormSchema | null;
  generatedCode: string;
  isLoading: boolean;
  error: string | null;
}
