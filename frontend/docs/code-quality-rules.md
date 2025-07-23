# Code Quality Rules & Guidelines

This document provides essential guidance for maintaining clean, readable code and fixing ESLint violations in our TypeScript/React project.

## 🎯 Core Quality Limits

| Rule                      | Limit     | Fix Strategy                                                   |
| ------------------------- | --------- | -------------------------------------------------------------- |
| **Cyclomatic Complexity** | 12        | Extract conditions into named functions, use early returns     |
| **File Size**             | 200 lines | Split into focused components (see refactoring template below) |
| **Function Length**       | 50 lines  | Break into smaller, focused functions                          |
| **Function Statements**   | 20        | Extract groups of related statements into helpers              |
| **Nesting Depth**         | 4         | Use early returns and guard clauses                            |

### Quick Fix Examples

**High Complexity** → Extract helper functions:

```typescript
// ❌ Complex (15+ complexity)
if (user && user.email && isValidEmail(user.email) && options.validateEmail) { ... }

// ✅ Simple (4 complexity)
if (!isValidUser(user)) return null;
if (!isValidEmail(user, options)) return null;
```

**Large File** → Use component composition:

```typescript
// ❌ 300+ lines in one file
export const Dashboard = () => {
  // 100+ lines of state, handlers, JSX
};

// ✅ Split into focused components
export const Dashboard = () => (
  <div>
    <DashboardHeader />
    <DashboardContent />
    <DashboardFooter />
  </div>
);
```

## 📁 File Structure Template for Component Refactoring

When components exceed 200 lines, refactor using this folder structure:

### Refactoring Pattern

**Before** (Single file):

```
src/components/FormField.tsx    # 250+ lines - TOO LARGE
```

**After** (Folder structure):

```
src/components/FormField/
├── index.ts                    # Clean exports
├── FormField.tsx              # Main component (< 50 lines)
├── components/                # Sub-components
│   ├── InputRenderer.tsx      # Input rendering logic
│   ├── ValidationDisplay.tsx  # Error display
│   └── index.ts               # Component exports
├── hooks/                     # Custom hooks
│   ├── useFieldValidation.ts  # Validation logic
│   └── index.ts               # Hook exports
├── utils/                     # Utilities
│   ├── fieldHelpers.ts        # Field utilities
│   └── index.ts               # Utility exports
├── types/                     # Local types
│   └── FormField.types.ts     # Component types
└── constants/                 # Constants
    └── fieldTypes.ts          # Field constants
```

### Key Refactoring Steps

1. **Create folder structure**: `mkdir FormField/{components,hooks,utils,types,constants}`
2. **Extract sub-components**: Move complex rendering logic to separate components
3. **Extract hooks**: Move state and effect logic to custom hooks
4. **Extract utilities**: Move pure functions to utility files
5. **Set up clean exports**: Use index.ts files for clean imports

### Main Component After Refactoring

```typescript
// FormField/FormField.tsx (< 50 lines)
import { InputRenderer, ValidationDisplay, FieldLabel } from "./components";
import { useFieldValidation, useInputHandlers } from "./hooks";

export const FormField: React.FC<FormFieldProps> = ({
  field,
  register,
  errors,
}) => {
  const { isValid, validationMessage } = useFieldValidation(field, errors);
  const { handleChange, handleBlur } = useInputHandlers(field, register);

  return (
    <div className="form-field">
      <FieldLabel field={field} />
      <InputRenderer
        field={field}
        register={register}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <ValidationDisplay isValid={isValid} message={validationMessage} />
    </div>
  );
};
```

### Clean Export Interface

```typescript
// FormField/index.ts
export { default } from "./FormField";
export type { FormFieldProps } from "./FormField";
export type * from "./types";
```

**Result**: External imports remain unchanged!

```typescript
// Still works exactly the same
import FormField from "./components/FormField";
```

## 🏷️ Naming Conventions

| Type                  | Pattern              | Example                                        |
| --------------------- | -------------------- | ---------------------------------------------- |
| **Component Folders** | PascalCase           | `FormField/`, `UserDashboard/`                 |
| **Component Files**   | PascalCase.tsx       | `FormField.tsx`, `InputRenderer.tsx`           |
| **Utility Folders**   | lowercase            | `hooks/`, `utils/`, `types/`, `constants/`     |
| **Hook Files**        | camelCase with 'use' | `useFieldValidation.ts`, `useInputHandlers.ts` |
| **Utility Files**     | camelCase            | `fieldHelpers.ts`, `validationHelpers.ts`      |
| **Type Files**        | PascalCase.types.ts  | `FormField.types.ts`, `User.types.ts`          |
| **Constant Files**    | camelCase            | `fieldTypes.ts`, `apiEndpoints.ts`             |

### Function Naming

```typescript
// ✅ Good
export const FormField = () => { ... };           // Components: PascalCase
export const useFieldValidation = () => { ... };  // Hooks: camelCase + 'use'
export const formatFieldValue = () => { ... };    // Utils: camelCase
export const FIELD_TYPES = { ... };               // Constants: SCREAMING_SNAKE_CASE

// ❌ Bad
export const formField = () => { ... };           // Should be PascalCase
export const fieldValidation = () => { ... };     // Hook missing 'use' prefix
export const FIELD_TYPES = { ... };               // Constant should be camelCase for file
```

## 📦 Import/Export Patterns

### Clean External Interface

```typescript
// FormField/index.ts - Maintains same import experience
export { default } from "./FormField";
export type { FormFieldProps } from "./FormField";

// External usage remains unchanged after refactoring
import FormField from "./components/FormField"; // Still works!
```

### Internal Organization

```typescript
// FormField/FormField.tsx - Organized imports
import { InputRenderer, ValidationDisplay } from "./components"; // Sub-components
import { useFieldValidation, useInputHandlers } from "./hooks"; // Hooks
import { formatFieldValue } from "./utils"; // Utilities
import { FIELD_TYPES } from "./constants"; // Constants
import type { FormFieldType } from "./types"; // Types
```

## ✅ Quick Reference Checklists

### When ESLint Reports File Size Violation (200+ lines):

- [ ] Create component folder with subfolders: `components/`, `hooks/`, `utils/`, `types/`, `constants/`
- [ ] Extract complex rendering into sub-components (< 100 lines each)
- [ ] Move state/effect logic into custom hooks (< 80 lines each)
- [ ] Extract pure functions into utilities (< 150 lines each)
- [ ] Set up clean exports in index.ts files
- [ ] Verify external imports still work unchanged

### When ESLint Reports High Complexity (12+):

- [ ] Extract complex conditions into named functions
- [ ] Use early returns to reduce nesting
- [ ] Break function into smaller, focused functions
- [ ] Consider strategy pattern for complex conditionals

### When ESLint Reports Long Functions (50+ lines):

- [ ] Extract setup/initialization code
- [ ] Extract validation logic
- [ ] Extract transformation logic
- [ ] Extract side effects into separate functions

## 📊 Success Metrics

| Metric             | Target      | Good          | Acceptable    |
| ------------------ | ----------- | ------------- | ------------- |
| **File Size**      | < 100 lines | 100-150 lines | 150-200 lines |
| **Function Size**  | < 20 lines  | 20-35 lines   | 35-50 lines   |
| **Complexity**     | 1-4         | 5-7           | 8-12          |
| **Main Component** | < 50 lines  | 50-80 lines   | 80-100 lines  |

### Well-Refactored Component Indicators:

- ✅ Main component focuses on composition (< 50 lines)
- ✅ Each sub-component has single responsibility (< 100 lines)
- ✅ Hooks contain only related logic (< 80 lines)
- ✅ External imports remain unchanged after refactoring
- ✅ No ESLint violations
- ✅ Easy to test components in isolation

Remember: These are guidelines to maintain code quality. Document any necessary exceptions with ESLint disable comments and clear reasoning.

---

**Goal**: Sustainable development velocity through maintainable code architecture.
