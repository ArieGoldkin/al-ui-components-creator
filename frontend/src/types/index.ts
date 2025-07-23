export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'checkbox' | 'select';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: Record<string, any>;
  options?: string[];
}

export interface FormSchema {
  title: string;
  fields: FormField[];
}

export interface AppState {
  messages: ChatMessage[];
  currentSchema: FormSchema | null;
  generatedCode: string;
  isLoading: boolean;
  error: string | null;
}
