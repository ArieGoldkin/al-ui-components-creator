export interface ComponentCategory {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: {
    primary: string;
    secondary: string;
    background: string;
    border: string;
  };
  examples: string[];
  suggestedPrompt: string;
}

export interface CategorySelectorProps {
  onCategorySelect: (category: ComponentCategory) => void;
  className?: string;
}
