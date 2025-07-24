import type { ComponentCategory } from "../types/categories";

export const componentCategories: ComponentCategory[] = [
  {
    id: "forms",
    name: "Forms & Inputs",
    description: "Interactive forms, inputs, and data collection components",
    icon: "FileText",
    color: {
      primary: "text-blue-600",
      secondary: "text-blue-500",
      background: "bg-blue-50",
      border: "border-blue-200",
    },
    examples: [
      "Contact form with validation",
      "User registration form",
      "Newsletter signup",
      "Search bar with filters",
    ],
    suggestedPrompt: "Create a contact form with name, email, and message fields with validation",
  },
  {
    id: "navigation",
    name: "Navigation",
    description: "Navigation menus, sidebars, and wayfinding components",
    icon: "Menu",
    color: {
      primary: "text-green-600",
      secondary: "text-green-500",
      background: "bg-green-50",
      border: "border-green-200",
    },
    examples: [
      "Responsive navbar with dropdown",
      "Sidebar navigation",
      "Breadcrumb trail",
      "Tab navigation",
    ],
    suggestedPrompt: "Create a responsive navbar with logo, menu items, and mobile hamburger menu",
  },
  {
    id: "data-display",
    name: "Data Display",
    description: "Tables, cards, lists, and data presentation components",
    icon: "Grid3x3",
    color: {
      primary: "text-purple-600",
      secondary: "text-purple-500",
      background: "bg-purple-50",
      border: "border-purple-200",
    },
    examples: [
      "Data table with sorting",
      "Product card grid",
      "User profile cards",
      "Statistics dashboard",
    ],
    suggestedPrompt: "Create a data table with sorting, filtering, and pagination for user management",
  },
  {
    id: "feedback",
    name: "Feedback",
    description: "Modals, alerts, notifications, and user feedback components",
    icon: "MessageCircle",
    color: {
      primary: "text-orange-600",
      secondary: "text-orange-500",
      background: "bg-orange-50",
      border: "border-orange-200",
    },
    examples: [
      "Confirmation modal",
      "Success notification",
      "Error alert banner",
      "Loading spinner",
    ],
    suggestedPrompt: "Create a confirmation modal with cancel and confirm buttons for deleting items",
  },
  {
    id: "layout",
    name: "Layout",
    description: "Page sections, layouts, and structural components",
    icon: "Layout",
    color: {
      primary: "text-indigo-600",
      secondary: "text-indigo-500",
      background: "bg-indigo-50",
      border: "border-indigo-200",
    },
    examples: [
      "Hero section with CTA",
      "Footer with links",
      "Two-column layout",
      "Card-based dashboard",
    ],
    suggestedPrompt: "Create a hero section with heading, description, and call-to-action button",
  },
];
