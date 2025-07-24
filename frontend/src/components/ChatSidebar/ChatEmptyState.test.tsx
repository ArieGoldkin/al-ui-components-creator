import { render, screen, fireEvent } from "@testing-library/react";
import ChatEmptyState from "./ChatEmptyState";
import { componentCategories } from "../../data/componentCategories";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("ChatEmptyState", () => {
  const mockOnCategorySelect = vi.fn();

  beforeEach(() => {
    mockOnCategorySelect.mockClear();
  });

  it("renders the empty state with bot icon and welcome message", () => {
    render(<ChatEmptyState />);

    expect(
      screen.getByText("Let's build your component together! ✨")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I'll help you create beautiful, functional components/)
    ).toBeInTheDocument();
    expect(
      screen.getByText("Or try these quick examples:")
    ).toBeInTheDocument();
  });

  it("renders CategorySelector when onCategorySelect prop is provided", () => {
    render(<ChatEmptyState onCategorySelect={mockOnCategorySelect} />);

    // Check that CategorySelector is rendered by looking for category names
    componentCategories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it("does not render CategorySelector when onCategorySelect prop is not provided", () => {
    render(<ChatEmptyState />);

    // Check that CategorySelector is not rendered
    const firstCategory = componentCategories[0];
    expect(screen.queryByText(firstCategory.name)).not.toBeInTheDocument();
  });

  it("calls onCategorySelect when a category is clicked", () => {
    render(<ChatEmptyState onCategorySelect={mockOnCategorySelect} />);

    const firstCategory = componentCategories[0];
    const categoryButton = screen.getByLabelText(
      `Select ${firstCategory.name} category`
    );

    fireEvent.click(categoryButton);

    expect(mockOnCategorySelect).toHaveBeenCalledWith(firstCategory);
  });

  it("displays quick examples", () => {
    render(<ChatEmptyState />);

    expect(
      screen.getByText('"Create a responsive navbar with dropdown menu"')
    ).toBeInTheDocument();
    expect(
      screen.getByText('"Build a product card with image and pricing"')
    ).toBeInTheDocument();
    expect(
      screen.getByText('"Design a success notification toast"')
    ).toBeInTheDocument();
    expect(
      screen.getByText('"Make a contact form with validation"')
    ).toBeInTheDocument();
  });

  it("has proper styling and layout", () => {
    render(<ChatEmptyState onCategorySelect={mockOnCategorySelect} />);

    // Check for the bot icon container
    const botIconContainer = document.querySelector(
      ".w-20.h-20.bg-gradient-to-br"
    );
    expect(botIconContainer).toBeInTheDocument();

    // Check for the examples container
    const examplesContainer = document.querySelector(
      ".bg-gradient-to-br.from-slate-50\\/90"
    );
    expect(examplesContainer).toBeInTheDocument();
  });
});
