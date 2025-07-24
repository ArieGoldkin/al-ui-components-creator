import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CategorySelector from "./CategorySelector";
import { componentCategories } from "../../data/componentCategories";

describe("CategorySelector", () => {
  const mockOnCategorySelect = vi.fn();

  beforeEach(() => {
    mockOnCategorySelect.mockClear();
  });

  it("renders header, categories, and handles interactions", () => {
    render(<CategorySelector onCategorySelect={mockOnCategorySelect} />);

    // Test header rendering
    expect(screen.getByText("Choose a Category")).toBeInTheDocument();
    expect(
      screen.getByText("Select a component type to get started")
    ).toBeInTheDocument();

    // Check vertical layout container exists
    const verticalContainer = document.querySelector(".space-y-3");
    expect(verticalContainer).toBeInTheDocument();

    // Test all categories are rendered with names and descriptions
    componentCategories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
      expect(screen.getByText(category.description)).toBeInTheDocument();
    });

    // Test category selection
    const firstCategory = componentCategories[0];
    const firstButton = screen.getByLabelText(
      `Select ${firstCategory.name} category`
    );

    fireEvent.click(firstButton);
    expect(mockOnCategorySelect).toHaveBeenCalledWith(firstCategory);
  });

  it("supports custom className and accessibility", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CategorySelector
        onCategorySelect={mockOnCategorySelect}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass("custom-class");

    // Test ARIA labels and keyboard accessibility
    const firstButton = screen.getByLabelText(
      `Select ${componentCategories[0].name} category`
    );
    expect(firstButton).toHaveClass("group", "border");

    // Test keyboard interaction with userEvent
    await user.keyboard("{Tab}"); // Focus the button
    await user.keyboard("{Enter}"); // Press Enter
    expect(mockOnCategorySelect).toHaveBeenCalledWith(componentCategories[0]);
  });

  it("displays category information in compact format", () => {
    render(<CategorySelector onCategorySelect={mockOnCategorySelect} />);

    const firstCategory = componentCategories[0];

    // Check that category information is directly visible (no tooltips needed)
    expect(screen.getByText(firstCategory.name)).toBeInTheDocument();
    expect(screen.getByText(firstCategory.description)).toBeInTheDocument();

    // Check that descriptions are visible in compact format
    expect(screen.getByText(firstCategory.description)).toBeInTheDocument();

    // Check that the card has proper full-width layout
    const firstButton = screen.getByLabelText(
      `Select ${firstCategory.name} category`
    );
    expect(firstButton).toHaveClass("w-full");
  });
});
