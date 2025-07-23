import axios, { AxiosError } from "axios";

const API_BASE_URL = "http://localhost:5001";

// Development mode flag - set to true to use mock responses when API credits are unavailable
const USE_MOCK_RESPONSES = false;

// Mock response for development/testing
const createMockResponse = (userMessage: string): ChatResponse => {
  const isFormRequest =
    userMessage.toLowerCase().includes("form") ||
    userMessage.toLowerCase().includes("create") ||
    userMessage.toLowerCase().includes("contact") ||
    userMessage.toLowerCase().includes("signup");

  if (isFormRequest) {
    return {
      schema: {
        title: "Contact Form",
        fields: [
          {
            id: "name",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
          },
          {
            id: "email",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
          },
          {
            id: "message",
            type: "textarea",
            label: "Message",
            placeholder: "Enter your message",
            required: true,
          },
        ],
      },
      code: `import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required'),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input {...register('name')} className="mt-1 block w-full rounded-md border-gray-300" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email Address</label>
        <input {...register('email')} type="email" className="mt-1 block w-full rounded-md border-gray-300" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <textarea {...register('message')} rows={4} className="mt-1 block w-full rounded-md border-gray-300" />
        {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
}`,
    };
  } else {
    // For non-form requests, return empty response
    return {
      schema: null,
      code: "",
    };
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface FormField {
  id: string;
  type: "text" | "email" | "number" | "textarea" | "checkbox" | "select";
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: Record<string, unknown>;
  options?: string[];
}

export interface FormSchema {
  title: string;
  fields: FormField[];
}

export interface ChatResponse {
  schema: FormSchema | null;
  code: string;
}

export interface ApiError {
  type: string;
  message: string;
  retry: boolean;
}

export interface ApiErrorResponse {
  error: ApiError;
}

const getLastUserMessage = (messages: ChatMessage[]): string => {
  const lastUserMessage = messages.filter((m) => m.role === "user").pop();
  return lastUserMessage?.content || "";
};

const handleApiError = async (
  errorMessage: string,
  messages: ChatMessage[]
): Promise<ChatResponse> => {
  if (errorMessage.includes("credit balance is too low")) {
    const mockResponse = createMockResponse(getLastUserMessage(messages));
    console.warn("API credits unavailable, using mock response");
    return mockResponse;
  } else if (errorMessage.includes("API key")) {
    throw new Error("AI service configuration issue. Please contact support.");
  } else {
    throw new Error(errorMessage);
  }
};

const handleAxiosError = async (
  error: AxiosError,
  messages: ChatMessage[]
): Promise<ChatResponse> => {
  if (error.code === "ECONNREFUSED") {
    throw new Error(
      "Unable to connect to the backend server. Please make sure it's running on port 5001."
    );
  }

  const errorData = error.response?.data as ApiErrorResponse;
  if (errorData?.error) {
    return handleApiError(errorData.error.message, messages);
  }

  throw new Error(`Connection error: ${error.message}`);
};

export const chatApi = {
  async sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
    if (USE_MOCK_RESPONSES) {
      const mockResponse = createMockResponse(getLastUserMessage(messages));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockResponse;
    }

    try {
      const response = await api.post<ChatResponse | ApiErrorResponse>(
        "/api/chat",
        { messages }
      );

      if ("error" in response.data) {
        return handleApiError(response.data.error.message, messages);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return handleAxiosError(error, messages);
      }
      throw error;
    }
  },

  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch {
      throw new Error("Backend server is not responding");
    }
  },
};

export default api;
