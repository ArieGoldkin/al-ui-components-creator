import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import type { AppState, FormSchema, ChatMessage } from "../types";

// Mock app state for testing
export const createMockAppState = (
  overrides: Partial<AppState> = {}
): AppState => ({
  messages: [],
  currentSchema: null,
  generatedCode: "",
  isLoading: false,
  error: null,
  ...overrides,
});

// Mock form schema for testing
export const createMockFormSchema = (
  overrides: Partial<FormSchema> = {}
): FormSchema => ({
  title: "Test Form",
  description: "A test form",
  fields: [
    {
      id: "testField",
      type: "text",
      label: "Test Field",
      placeholder: "Enter test value",
      required: true,
    },
  ],
  ...overrides,
});

// Mock chat message for testing
export const createMockChatMessage = (
  overrides: Partial<ChatMessage> = {}
): ChatMessage => ({
  role: "user",
  content: "Test message",
  timestamp: new Date("2024-01-01T12:00:00Z"),
  ...overrides,
});

// Custom render function that includes common providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };

// Common test helpers
export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => setTimeout(resolve, 0));
};

// Mock functions for common props
export const mockFunctions = {
  onSendMessage: vi.fn(),
  onRetry: vi.fn(),
  onClick: vi.fn(),
  onChange: vi.fn(),
  onSubmit: vi.fn(),
};

// Reset all mocks
export const resetMocks = () => {
  Object.values(mockFunctions).forEach((mock) => mock.mockReset());
};

// Accessibility testing helper
export const expectToBeAccessible = async (container: HTMLElement) => {
  // Basic accessibility checks
  const buttons = container.querySelectorAll("button");
  buttons.forEach((button) => {
    expect(button).toHaveAttribute("type");
  });

  const inputs = container.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    const id = input.getAttribute("id");
    const ariaLabel = input.getAttribute("aria-label");
    const ariaLabelledBy = input.getAttribute("aria-labelledby");

    // Each input should have either an id with corresponding label, aria-label, or aria-labelledby
    if (id) {
      const label = container.querySelector(`label[for="${id}"]`);
      expect(label || ariaLabel || ariaLabelledBy).toBeTruthy();
    } else {
      expect(ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });
};
