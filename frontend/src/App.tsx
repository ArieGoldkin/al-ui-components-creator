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

  const isModificationRequest = useCallback(
    (message: string): boolean => {
      return Boolean(
        state.currentSchema &&
          (message.toLowerCase().includes("add") ||
            message.toLowerCase().includes("remove") ||
            message.toLowerCase().includes("change") ||
            message.toLowerCase().includes("modify") ||
            message.toLowerCase().includes("update") ||
            message.toLowerCase().includes("edit"))
      );
    },
    [state.currentSchema]
  );

  const buildConversationMessages = useCallback(
    (userMessage: ChatMessage, message: string) => {
      const isModification = isModificationRequest(message);

      if (isModification) {
        const schemaContextMessage: ChatMessage = {
          role: "assistant",
          content: `Current form schema: ${JSON.stringify(
            state.currentSchema,
            null,
            2
          )}`,
          timestamp: new Date(),
        };

        console.log(
          "Including current schema context for modification request"
        );
        return [...state.messages, schemaContextMessage, userMessage];
      }

      return [...state.messages, userMessage];
    },
    [state.messages, state.currentSchema, isModificationRequest]
  );

  const createAssistantContent = useCallback(
    (
      response: {
        schema?: { title: string; fields: unknown[] } | null;
        code?: string;
      },
      isModification: boolean
    ) => {
      if (response.schema && response.code) {
        if (isModification) {
          return `I've updated the "${response.schema.title}" form. It now has ${response.schema.fields.length} fields. You can see the updated preview on the right.`;
        } else {
          return `I've created a form called "${response.schema.title}" with ${response.schema.fields.length} fields. You can see the preview on the right and the generated code below.`;
        }
      }
      return "I received your message. Please describe what kind of form you'd like me to create.";
    },
    []
  );

  const handleSendMessage = useCallback(
    async (message: string) => {
      const userMessage: ChatMessage = {
        role: "user",
        content: message,
        timestamp: new Date(),
      };

      const conversationMessages = buildConversationMessages(
        userMessage,
        message
      );
      const isModification = isModificationRequest(message);

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
      }));

      try {
        console.log("Sending messages to API:", conversationMessages);
        const response = await chatApi.sendMessage(conversationMessages);
        console.log("Received response:", response);

        const assistantContent = createAssistantContent(
          response,
          isModification
        );
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
    [buildConversationMessages, isModificationRequest, createAssistantContent]
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
