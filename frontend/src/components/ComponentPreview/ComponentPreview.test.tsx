import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../../test/utils";
import ComponentPreview from "./ComponentPreview";
import type { FormSchema } from "../../types";

describe("ComponentPreview", () => {
  describe("Rendering", () => {
    it("renders empty state when no schema provided", () => {
      render(<ComponentPreview formSchema={null} />);

      expect(screen.getByText("No component to preview")).toBeInTheDocument();
    });

    it("renders form when schema is provided", () => {
      const schema: FormSchema = {
        title: "Contact Form",
        description: "Get in touch with us",
        fields: [
          {
            id: "name",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your name",
            required: true,
          },
        ],
      };

      render(<ComponentPreview formSchema={schema} />);

      expect(screen.getByText("Contact Form")).toBeInTheDocument();
      expect(screen.getByText("Get in touch with us")).toBeInTheDocument();
      expect(screen.getByText("Full Name")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /submit/i })
      ).toBeInTheDocument();
    });

    it("renders component preview for non-form components", () => {
      const schema: FormSchema = {
        title: "Navigation Component",
        description: "A responsive navigation bar",
        fields: [],
        type: "navigation",
        dependencies: ["@shadcn/ui", "lucide-react"],
        usage: "import NavigationBar from './NavigationBar';",
      };

      render(<ComponentPreview formSchema={schema} />);

      // Check for the main title (h2)
      expect(
        screen.getByRole("heading", { level: 2, name: "Navigation Component" })
      ).toBeInTheDocument();
      expect(
        screen.getByText("A responsive navigation bar")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Component Generated Successfully")
      ).toBeInTheDocument();
      expect(screen.getByText("Dependencies")).toBeInTheDocument();
      expect(screen.getByText("@shadcn/ui")).toBeInTheDocument();
      expect(screen.getByText("Usage Example")).toBeInTheDocument();
      expect(
        screen.getByText("import NavigationBar from './NavigationBar';")
      ).toBeInTheDocument();
    });

    it("renders empty state for form components with no fields", () => {
      const schema: FormSchema = {
        title: "Empty Form",
        description: "A form with no fields",
        fields: [],
        type: "forms",
      };

      render(<ComponentPreview formSchema={schema} />);

      expect(
        screen.getByText("No component fields generated")
      ).toBeInTheDocument();
    });
  });
});
