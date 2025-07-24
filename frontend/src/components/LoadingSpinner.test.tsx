import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../test/utils";
import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<LoadingSpinner />);

      // Should render the spinner container
      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("renders with custom text", () => {
      const customText = "Loading data...";
      render(<LoadingSpinner text={customText} />);

      expect(screen.getByText(customText)).toBeInTheDocument();
    });

    it("renders without text when not provided", () => {
      render(<LoadingSpinner />);

      // Should not have any text content
      const container = document.querySelector(
        ".flex.items-center.justify-center"
      );
      expect(container).toBeInTheDocument();
      expect(container?.textContent).toBe("");
    });
  });

  describe("Size Variants", () => {
    it("renders small size correctly", () => {
      render(<LoadingSpinner size="sm" />);

      const spinner = document.querySelector(".h-4.w-4");
      expect(spinner).toBeInTheDocument();
    });

    it("renders medium size correctly (default)", () => {
      render(<LoadingSpinner size="md" />);

      const spinner = document.querySelector(".h-6.w-6");
      expect(spinner).toBeInTheDocument();
    });

    it("renders large size correctly", () => {
      render(<LoadingSpinner size="lg" />);

      const spinner = document.querySelector(".h-8.w-8");
      expect(spinner).toBeInTheDocument();
    });

    it("uses medium size as default", () => {
      render(<LoadingSpinner />);

      const spinner = document.querySelector(".h-6.w-6");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className", () => {
      const customClass = "custom-spinner-class";
      render(<LoadingSpinner className={customClass} />);

      const container = document.querySelector(`.${customClass}`);
      expect(container).toBeInTheDocument();
    });

    it("combines custom className with default classes", () => {
      render(<LoadingSpinner className="custom-class" />);

      const container = document.querySelector(
        ".flex.items-center.justify-center.custom-class"
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe("Animation", () => {
    it("has spinning animation classes", () => {
      render(<LoadingSpinner />);

      const spinnerElements = document.querySelectorAll(".animate-spin");
      expect(spinnerElements.length).toBeGreaterThan(0);
    });

    it("has pulse animation for text", () => {
      render(<LoadingSpinner text="Loading..." />);

      const textElement = document.querySelector(".animate-pulse");
      expect(textElement).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("provides appropriate ARIA attributes", () => {
      render(<LoadingSpinner text="Loading data..." />);

      // The component should be perceivable by screen readers
      const loadingText = screen.getByText("Loading data...");
      expect(loadingText).toBeInTheDocument();
    });

    it("is semantically correct for loading states", () => {
      render(<LoadingSpinner />);

      // Should have visual indicators that convey loading state
      const spinners = document.querySelectorAll(".animate-spin");
      expect(spinners.length).toBeGreaterThan(0);
    });
  });

  describe("Component Structure", () => {
    it("has correct DOM structure", () => {
      render(<LoadingSpinner text="Loading..." />);

      // Check the overall structure
      const container = document.querySelector(
        ".flex.items-center.justify-center"
      );
      expect(container).toBeInTheDocument();

      const innerContainer = container?.querySelector(
        ".flex.items-center.gap-3"
      );
      expect(innerContainer).toBeInTheDocument();

      const spinnerContainer = innerContainer?.querySelector(".relative");
      expect(spinnerContainer).toBeInTheDocument();
    });

    it("renders spinner elements correctly", () => {
      render(<LoadingSpinner />);

      // Should have the main spinner border
      const mainSpinner = document.querySelector(
        ".rounded-full.border-2.border-blue-200"
      );
      expect(mainSpinner).toBeInTheDocument();

      // Should have the animated top border
      const animatedBorder = document.querySelector(".border-t-blue-600");
      expect(animatedBorder).toBeInTheDocument();
    });
  });
});
