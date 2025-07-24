import React from "react";
import {
  FileText,
  Menu,
  Grid3x3,
  MessageCircle,
  Layout,
  ArrowRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import type {
  ComponentCategory,
  CategorySelectorProps,
} from "../../types/categories";
import { componentCategories } from "../../data/componentCategories";

// Icon mapping for dynamic icon rendering
const iconMap = {
  FileText,
  Menu,
  Grid3x3,
  MessageCircle,
  Layout,
} as const;

const CategoryCard: React.FC<{
  category: ComponentCategory;
  onSelect: (category: ComponentCategory) => void;
}> = ({ category, onSelect }) => {
  const IconComponent = iconMap[category.icon as keyof typeof iconMap];

  return (
    <button
      onClick={() => onSelect(category)}
      className={cn(
        "group relative transition-all duration-200",
        "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-blue-400/50",
        "text-left w-full",
        // Compact row layout
        "p-3 rounded-lg border",
        "flex items-center gap-3",
        "bg-white/80 hover:bg-white border-slate-200/60",
        "hover:border-slate-300/80 backdrop-blur-sm"
      )}
      aria-label={`Select ${category.name} category`}
    >
      {/* Icon */}
      <div
        className={cn(
          "rounded-lg flex items-center justify-center flex-shrink-0",
          "group-hover:scale-105 transition-transform duration-200",
          "w-10 h-10",
          category.color.background === "bg-blue-50"
            ? "bg-blue-100/80"
            : category.color.background === "bg-green-50"
            ? "bg-green-100/80"
            : category.color.background === "bg-purple-50"
            ? "bg-purple-100/80"
            : category.color.background === "bg-orange-50"
            ? "bg-orange-100/80"
            : "bg-indigo-100/80"
        )}
      >
        <IconComponent className={cn("h-5 w-5", category.color.primary)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Category Name */}
        <h3 className={cn("font-semibold text-sm", category.color.primary)}>
          {category.name}
        </h3>

        {/* Description - Compact */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-1">
          {category.description}
        </p>
      </div>

      {/* Arrow indicator */}
      <div
        className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          "flex-shrink-0"
        )}
      >
        <ArrowRight className={cn("h-4 w-4", category.color.secondary)} />
      </div>
    </button>
  );
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  onCategorySelect,
  className,
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-800">
          Choose a Category
        </h2>
        <p className="text-xs text-slate-600">
          Select a component type to get started
        </p>
      </div>

      {/* Vertical Categories List */}
      <div className="space-y-2">
        {componentCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onSelect={onCategorySelect}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
