"""
Prompt Management System for the AI Component Builder backend.

This module handles all AI prompts, including system prompts for different
component types and prompt templates for various use cases.
"""

import logging
from typing import Dict, Any, Optional
from enum import Enum

logger = logging.getLogger(__name__)


class ComponentType(Enum):
    """Enumeration of supported component types"""
    FORM = "form"
    NAVIGATION = "navigation"
    DATA_DISPLAY = "data_display"
    FEEDBACK = "feedback"
    GENERAL = "general"


class PromptManager:
    """Manages AI prompts for different component types and use cases"""
    
    def __init__(self):
        """Initialize the prompt manager with default prompts"""
        self._system_prompts = self._initialize_system_prompts()
        self._component_instructions = self._initialize_component_instructions()
        logger.info("Prompt Manager initialized with component-specific prompts")
    
    def get_system_prompt(self, component_type: Optional[ComponentType] = None) -> str:
        """
        Get the appropriate system prompt for a component type
        
        Args:
            component_type: The type of component to generate
            
        Returns:
            Formatted system prompt string
        """
        if component_type is None:
            component_type = ComponentType.GENERAL
        
        base_prompt = self._system_prompts.get("base", "")
        component_instructions = self._component_instructions.get(component_type.value, "")
        
        # Combine base prompt with component-specific instructions
        full_prompt = f"{base_prompt}\n\n{component_instructions}".strip()
        
        logger.debug(f"Generated system prompt for component type: {component_type.value}")
        return full_prompt
    
    def get_component_type_from_message(self, message: str) -> ComponentType:
        """
        Detect component type from user message
        
        Args:
            message: User's message content
            
        Returns:
            Detected component type
        """
        message_lower = message.lower()
        
        # Navigation keywords
        if any(keyword in message_lower for keyword in [
            "navbar", "navigation", "menu", "header", "sidebar", "breadcrumb", "tabs"
        ]):
            return ComponentType.NAVIGATION
        
        # Data display keywords
        elif any(keyword in message_lower for keyword in [
            "table", "list", "card", "grid", "chart", "dashboard", "stats", "display data"
        ]):
            return ComponentType.DATA_DISPLAY
        
        # Feedback keywords
        elif any(keyword in message_lower for keyword in [
            "modal", "dialog", "toast", "alert", "notification", "popup", "loading", "spinner"
        ]):
            return ComponentType.FEEDBACK
        
        # Form keywords (default for now to maintain compatibility)
        elif any(keyword in message_lower for keyword in [
            "form", "input", "field", "submit", "login", "register", "contact", "signup"
        ]):
            return ComponentType.FORM
        
        # Default to general
        else:
            return ComponentType.GENERAL
    
    def _initialize_system_prompts(self) -> Dict[str, str]:
        """Initialize base system prompts"""
        return {
            "base": """You are an expert React component generator for the AI Component Builder, specializing in creating production-ready UI components.

TECHNOLOGY STACK:
- React 19.1.0 with TypeScript
- shadcn/ui + Radix UI components
- Tailwind CSS for styling
- Lucide React for icons
- Modern React patterns (hooks, composition)

COMPONENT CATEGORIES:
- Forms & Inputs: Contact forms, search bars, user registration
- Navigation: Navbars, sidebars, breadcrumbs, tabs
- Data Display: Tables, cards, lists, dashboards
- Feedback: Modals, toasts, alerts, loading states
- Layout: Grids, containers, responsive layouts

RESPONSE FORMAT:
Always respond with valid JSON containing:
{
  "componentCode": "string - Complete React component code",
  "componentType": "string - Category of component",
  "dependencies": ["array of required npm packages"],
  "description": "string - Brief component description",
  "usage": "string - Example usage code"
}

REQUIREMENTS:
- Use TypeScript interfaces for all props with proper typing
- Include comprehensive accessibility (ARIA labels, keyboard navigation, focus management)
- Follow shadcn/ui design patterns and component composition
- Include responsive design with mobile-first approach
- Add proper error handling and loading states
- Use semantic HTML elements
- Include hover, focus, and active states
- Add JSDoc comments for complex functions
- Ensure components are self-contained and production-ready

STYLING GUIDELINES:
- Use Tailwind CSS utility classes
- Follow consistent spacing (p-4, m-2, gap-4)
- Use semantic color classes (bg-primary, text-muted-foreground)
- Include dark mode support where appropriate
- Add smooth transitions and animations

CRITICAL RULES:
1. Start your response with { and end with }
2. Use double quotes for all strings
3. Escape quotes inside strings with backslash
4. No trailing commas
5. No comments in JSON
6. The componentCode field must contain the complete React component as a single string

RESPOND ONLY WITH VALID JSON - NO OTHER TEXT."""
        }
    
    def _initialize_component_instructions(self) -> Dict[str, str]:
        """Initialize component-specific instructions"""
        return {
            "form": """FORMS & INPUTS COMPONENT INSTRUCTIONS:
- Use React Hook Form for robust form management
- Include Zod validation schema with comprehensive rules
- Add real-time validation with clear, helpful error messages
- Include loading states during form submission with disabled inputs
- Use shadcn/ui form components (Input, Button, Label, Textarea, Select)
- Add proper form accessibility with ARIA labels and descriptions
- Include form reset functionality and success feedback
- Add password strength indicators for password fields
- Include file upload with drag-and-drop support where needed
- Use proper input types (email, tel, url) for better UX

Example structure:
- Import useForm, zodResolver from react-hook-form
- Define comprehensive Zod schema for validation
- Include proper TypeScript interfaces for form data
- Add error handling and user-friendly error display
- Use Tailwind for responsive styling and focus states
- Include proper keyboard navigation and tab order""",

            "navigation": """NAVIGATION COMPONENT INSTRUCTIONS:
- Create responsive navigation components with mobile-first approach
- Use Lucide React icons for navigation items and interactive elements
- Include mobile menu functionality with smooth animations
- Add proper ARIA labels, roles, and keyboard navigation support
- Use shadcn/ui navigation components (NavigationMenu, Sheet for mobile)
- Include active state styling with clear visual indicators
- Support multi-level dropdown menus with proper focus management
- Add search functionality in navigation where appropriate
- Include user profile/account sections in navigation
- Use proper semantic HTML (nav, ul, li elements)

Component types to consider:
- Responsive navbar with logo, menu items, and mobile hamburger
- Sidebar navigation with collapsible sections
- Breadcrumb navigation with proper hierarchy
- Tab navigation with keyboard arrow key support
- Mega menus for complex navigation structures
- Sticky/fixed navigation with scroll behavior""",

            "data_display": """DATA DISPLAY COMPONENT INSTRUCTIONS:
- Create components for displaying structured data with excellent UX
- Use shadcn/ui Table, Card, Badge, and Avatar components
- Include comprehensive sorting, filtering, and search capabilities
- Add loading states with skeleton screens and empty states with helpful messages
- Use proper TypeScript interfaces for data with generic types where appropriate
- Include responsive design that adapts gracefully to mobile screens
- Add pagination with page size options for large datasets
- Include data export functionality where relevant
- Add row selection and bulk actions for tables
- Use virtualization for very large datasets

Component types to consider:
- Advanced data tables with sorting, filtering, and row actions
- Product/item card grids with hover effects and quick actions
- List components with avatars, metadata, and action buttons
- Statistics dashboards with metrics and trend indicators
- Chart components with Chart.js or Recharts integration
- Timeline components for displaying chronological data
- Comparison tables for feature/pricing comparisons""",

            "feedback": """FEEDBACK COMPONENT INSTRUCTIONS:
- Create user feedback and interaction components with excellent UX
- Use shadcn/ui Dialog, Alert, Toast, and Progress components
- Include smooth animations and transitions with proper timing
- Add comprehensive keyboard navigation and focus management
- Include close/dismiss functionality with multiple methods (X, Escape, outside click)
- Use appropriate icons from Lucide React for visual context
- Add proper ARIA attributes, live regions, and screen reader support
- Include auto-dismiss timers for non-critical notifications
- Add action buttons with clear labels and proper spacing
- Use semantic colors (success, warning, error, info) consistently

Component types to consider:
- Modal dialogs with primary/secondary actions and proper focus trapping
- Toast notifications with different severity levels and auto-dismiss
- Alert banners with inline actions and dismissal options
- Loading spinners, skeleton screens, and progress bars
- Step-by-step progress indicators for multi-step processes
- Confirmation dialogs with clear consequences and cancel options
- Tooltip components with proper positioning and timing""",

            "general": """GENERAL COMPONENT INSTRUCTIONS:
- Create flexible, reusable React components with excellent developer experience
- Use appropriate shadcn/ui components following their design system
- Include comprehensive TypeScript typing with proper interfaces and generics
- Add responsive design with mobile-first approach and proper breakpoints
- Include comprehensive accessibility features (ARIA, keyboard navigation, focus management)
- Use Tailwind CSS for styling with consistent design tokens
- Add proper JSDoc documentation for complex components and functions
- Include error boundaries and proper error handling
- Use React best practices (hooks, composition, performance optimization)

Focus on:
- Clean, maintainable, and well-documented code
- Proper component composition and separation of concerns
- Reusable design patterns and consistent API design
- Modern React best practices (hooks, context, suspense)
- Performance optimization (memo, useMemo, useCallback where appropriate)
- Accessibility-first development approach
- Responsive design that works across all devices
- Proper state management and side effect handling"""
        }
    
    def update_component_instructions(self, component_type: ComponentType, instructions: str) -> None:
        """
        Update instructions for a specific component type
        
        Args:
            component_type: The component type to update
            instructions: New instructions for the component type
        """
        self._component_instructions[component_type.value] = instructions
        logger.info(f"Updated instructions for component type: {component_type.value}")
    
    def get_available_component_types(self) -> list[str]:
        """Get list of available component types"""
        return [component_type.value for component_type in ComponentType]
    
    def validate_prompt_response(self, response: str) -> bool:
        """
        Validate that a response follows the expected format
        
        Args:
            response: The AI response to validate
            
        Returns:
            True if response appears to be valid JSON with required fields
        """
        try:
            import json
            parsed = json.loads(response)
            
            # Check for required fields
            required_fields = ["componentCode", "componentType", "description"]
            for field in required_fields:
                if field not in parsed:
                    logger.warning(f"Response missing required field: {field}")
                    return False
            
            return True
        except json.JSONDecodeError:
            logger.warning("Response is not valid JSON")
            return False
        except Exception as e:
            logger.error(f"Error validating response: {e}")
            return False
