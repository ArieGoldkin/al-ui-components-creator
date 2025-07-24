import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../test/mocks/server";
import { chatApi } from "./api";
import { createMockChatMessage } from "../test/utils";
import type { ChatMessage } from "../types";

describe("API Service", () => {
  describe("chatApi.sendMessage", () => {
    it("sends messages and returns form schema and code", async () => {
      const messages: ChatMessage[] = [
        createMockChatMessage({ content: "Create a contact form" }),
      ];

      const response = await chatApi.sendMessage(messages);

      expect(response).toHaveProperty("schema");
      expect(response).toHaveProperty("code");
      expect(response.schema).toMatchObject({
        title: "Contact Form",
        description: "A simple contact form",
        fields: expect.arrayContaining([
          expect.objectContaining({
            id: "name",
            type: "text",
            label: "Full Name",
            required: true,
          }),
        ]),
      });
      expect(response.code).toContain("ContactForm");
    });

    it("handles API errors correctly", async () => {
      // Override the default handler for this test
      server.use(
        http.post("http://localhost:5001/api/chat", () => {
          return HttpResponse.json(
            {
              error: {
                type: "api_error",
                message: "Claude API error: Rate limit exceeded",
                retry: true,
              },
            },
            { status: 500 }
          );
        })
      );

      const messages: ChatMessage[] = [
        createMockChatMessage({ content: "Create a form" }),
      ];

      await expect(chatApi.sendMessage(messages)).rejects.toThrow(
        "Claude API error: Rate limit exceeded"
      );
    });

    it("handles validation errors correctly", async () => {
      server.use(
        http.post("http://localhost:5001/api/chat", () => {
          return HttpResponse.json(
            {
              error: {
                type: "validation_error",
                message: "Messages are required",
                retry: false,
              },
            },
            { status: 400 }
          );
        })
      );

      const messages: ChatMessage[] = [];

      await expect(chatApi.sendMessage(messages)).rejects.toThrow(
        "Messages are required"
      );
    });

    it("handles network errors", async () => {
      server.use(
        http.post("http://localhost:5001/api/chat", () => {
          return HttpResponse.error();
        })
      );

      const messages: ChatMessage[] = [
        createMockChatMessage({ content: "Create a form" }),
      ];

      await expect(chatApi.sendMessage(messages)).rejects.toThrow();
    });

    it("handles malformed JSON responses", async () => {
      server.use(
        http.post("http://localhost:5001/api/chat", () => {
          return new HttpResponse("Invalid JSON", {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          });
        })
      );

      const messages: ChatMessage[] = [
        createMockChatMessage({ content: "Create a form" }),
      ];

      await expect(chatApi.sendMessage(messages)).rejects.toThrow();
    });

    it("transforms messages correctly for API", async () => {
      let capturedRequest: unknown = null;

      server.use(
        http.post("http://localhost:5001/api/chat", async ({ request }) => {
          capturedRequest = await request.json();
          return HttpResponse.json({
            schema: { title: "Test", fields: [] },
            code: "test code",
          });
        })
      );

      const messages: ChatMessage[] = [
        createMockChatMessage({
          role: "user",
          content: "Create a form",
          timestamp: new Date("2024-01-01T12:00:00Z"),
        }),
        createMockChatMessage({
          role: "assistant",
          content: "I will create a form",
          timestamp: new Date("2024-01-01T12:01:00Z"),
        }),
      ];

      await chatApi.sendMessage(messages);

      expect(capturedRequest).toEqual({
        messages: [
          {
            role: "user",
            content: "Create a form",
            timestamp: "2024-01-01T12:00:00.000Z",
          },
          {
            role: "assistant",
            content: "I will create a form",
            timestamp: "2024-01-01T12:01:00.000Z",
          },
        ],
      });
    });

    it("handles empty response gracefully", async () => {
      server.use(
        http.post("http://localhost:5001/api/chat", () => {
          return HttpResponse.json({});
        })
      );

      const messages: ChatMessage[] = [
        createMockChatMessage({ content: "Create a form" }),
      ];

      const response = await chatApi.sendMessage(messages);

      expect(response).toEqual({});
    });

    it("handles partial response data", async () => {
      server.use(
        http.post("http://localhost:5001/api/chat", () => {
          return HttpResponse.json({
            schema: { title: "Partial Form", fields: [] },
            // Missing code property
          });
        })
      );

      const messages: ChatMessage[] = [
        createMockChatMessage({ content: "Create a form" }),
      ];

      const response = await chatApi.sendMessage(messages);

      expect(response).toEqual({
        schema: { title: "Partial Form", fields: [] },
      });
    });
  });

  describe("Error handling", () => {
    it("preserves error details for retry logic", async () => {
      server.use(
        http.post("http://localhost:5001/api/chat", () => {
          return HttpResponse.json(
            {
              error: {
                type: "api_error",
                message: "Temporary server error",
                retry: true,
              },
            },
            { status: 503 }
          );
        })
      );

      const messages: ChatMessage[] = [
        createMockChatMessage({ content: "Create a form" }),
      ];

      try {
        await chatApi.sendMessage(messages);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Temporary server error");
      }
    });
  });
});
