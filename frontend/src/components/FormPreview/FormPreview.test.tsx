import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../../test/utils";
import FormPreview from "./FormPreview";
import type { FormSchema } from "../../types";

describe("FormPreview", () => {
  describe("Rendering", () => {
    it("renders empty state when no schema provided", () => {
      render(<FormPreview formSchema={null} />);

      expect(screen.getByText("No form to preview")).toBeInTheDocument();
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

      render(<FormPreview formSchema={schema} />);

      expect(screen.getByText("Contact Form")).toBeInTheDocument();
      expect(screen.getByText("Get in touch with us")).toBeInTheDocument();
      expect(screen.getByText("Full Name")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /submit form/i })
      ).toBeInTheDocument();
    });
  });
});
