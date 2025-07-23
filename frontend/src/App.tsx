import { useState, useCallback } from "react";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import type { AppState, ChatMessage } from "./types";
import { chatApi } from "./services/api";

function App() {
  const [state, setState] = useState<AppState>({
    messages: [],
    currentSchema: null,
    generatedCode: "",
    isLoading: false,
    error: null,
  });

  const handleSendMessage = useCallback(
    async (message: string) => {
      const userMessage: ChatMessage = {
        role: "user",
        content: message,
        timestamp: new Date(),
      };

      // Add user message and set loading state
      const updatedMessages = [...state.messages, userMessage];
      setState((prev) => ({
        ...prev,
        messages: updatedMessages,
        isLoading: true,
        error: null,
      }));

      try {
        // Send complete conversation history to API
        console.log("Sending messages to API:", updatedMessages);
        const response = await chatApi.sendMessage(updatedMessages);
        console.log("Received response:", response);

        // Create assistant message based on response type
        let assistantContent: string;

        if (response.schema && response.code) {
          // Form generation response
          assistantContent = `I've created a form called "${response.schema.title}" with ${response.schema.fields.length} fields. You can see the preview on the right and the generated code below.`;
        } else {
          // Simple chat response (fallback)
          assistantContent =
            "I received your message. Please describe what kind of form you'd like me to create.";
        }

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: assistantContent,
          timestamp: new Date(),
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          currentSchema: response.schema || null,
          generatedCode: response.code || "",
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "An error occurred",
        }));
      }
    },
    [state.messages]
  );

  const handleRetry = useCallback(() => {
    if (state.messages.length > 0) {
      const lastUserMessage = [...state.messages]
        .reverse()
        .find((msg) => msg.role === "user");

      if (lastUserMessage) {
        handleSendMessage(lastUserMessage.content);
      }
    }
  }, [state.messages, handleSendMessage]);

  return (
    <ErrorBoundary>
      <Layout
        state={state}
        onSendMessage={handleSendMessage}
        onRetry={handleRetry}
      />
    </ErrorBoundary>
  );
}

export default App;
