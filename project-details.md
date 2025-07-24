# Vibe Code UI Components Builder — AI Instruction Blueprint

<env>
- before running any terminal commands, activate the virtual env "augment": `source augment/bin/activate`
- all dependencies must be installed within the virtual env "augment"
- Flask app runs on localhost:5001 (port 5000 conflicts with Apple AirTunes)
- Virtual environment created with: `python3 -m venv augment`
</env>

## Project Goal

Build a simple local web application that lets the user create and modify web forms in real time using natural language through a chat interface. The application should take the user’s chat input, send it to an AI, receive a complete form schema in response, and render that schema as a live, interactive form in the UI, and give us the code for us to copy

---

## What Already Exists

- ✅ **Virtual Environment "augment"**: Created and configured with all dependencies
- ✅ **Backend Foundation Complete**: Flask app with CORS, python-dotenv, and Anthropic SDK
- ✅ **POST /api/chat endpoint** implemented and responding correctly
- ✅ **Environment variable loading** configured (.env file created)
- ✅ **Health endpoint** working for basic connectivity testing
- ✅ **Error handling** implemented for missing API key
- ✅ **Flask app running on localhost:5001** (changed from 5000 due to port conflict)
- ✅ **Anthropic client integration** working correctly (SDK compatibility resolved)
- ✅ **Claude AI API calls** functional (limited by API credits)
- ❌ Frontend folder not yet created
- No hosting, no database, and no deployment is required—everything runs on localhost.

## Current Status & Checkpoints

### ✅ Checkpoint 1: Backend Foundation (COMPLETE)

- Virtual environment "augment" created and activated
- Flask app running on localhost:5001 within virtual environment
- POST route '/api/chat' implemented with proper error handling
- Environment variables configured
- Basic API connectivity tested and working
- **Activation**: `source augment/bin/activate && cd backend && python app.py`
- **Test**: `curl http://localhost:5001/health` returns `{"status": "healthy"}`
- **Test**: `curl /api/chat` with dummy message returns proper error response

### ✅ Checkpoint 2: Claude AI Integration (COMPLETE)

- ✅ **Anthropic SDK compatibility resolved** (downgraded to v0.25.0 with httpx v0.24.1)
- ✅ **Client initialization working** successfully
- ✅ **API key integration** functional
- ✅ **Error handling** for API credit limits and other errors
- ✅ **Full chat endpoint** ready for production use

### 🔄 Next: React Frontend Setup (IN PROGRESS)

- Create frontend folder with Vite + React + TypeScript
- Install and configure shadcn/ui, Tailwind CSS, React Hook Form, Zod
- Set up development environment for frontend

## Development Setup Commands

### Quick Start

```bash
# Start full-stack development environment
./start-fullstack.sh

# Or start backend only
./start-dev.sh
```

### Testing Commands

```bash
# Run all tests
pnpm test

# Frontend tests with watch mode
pnpm test:frontend:watch

# Backend tests with coverage
pnpm test:backend:coverage

# Integration tests
pnpm test:integration
```

### Manual Setup

```bash
# Activate virtual environment
source augment/bin/activate

# Start backend
cd backend && python app.py

# Backend will run on http://localhost:5001

# In a new terminal, start frontend
cd frontend && pnpm run dev

# Frontend will run on http://localhost:3000
```

### Package Management

```bash
# Frontend uses pnpm for better performance
cd frontend && pnpm install    # Install dependencies
cd frontend && pnpm run dev    # Start development server
cd frontend && pnpm run build  # Build for production

# Backend uses pip in virtual environment
source augment/bin/activate
pip install -r backend/requirements.txt
```

### Testing Commands

```bash
# Test health endpoint
curl http://localhost:5001/health

# Test chat endpoint (will show API key error - expected)
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Create a simple contact form"}]}'
```

### Environment Verification

```bash
# Check virtual environment is active
which python  # Should show path with 'augment'

# Check installed packages
pip list | grep -E "(flask|anthropic)"

# Check Flask app structure
ls -la backend/
```

### Troubleshooting

- **Port 5000 conflict**: App uses port 5001 due to Apple AirTunes on 5000
- **Anthropic client error**: Expected until API key is configured
- **Virtual environment**: Always activate with `source augment/bin/activate`
- **Dependencies**: Reinstall with `pip install -r backend/requirements.txt`

## ✅ Development Environment Complete

### Backend Environment

The "augment" virtual environment has been successfully created and configured with:

- **Python 3.9.6** in isolated environment
- **pip 25.1.1** (latest version)
- **Flask 2.3.3** with CORS support
- **Anthropic 0.25.0** SDK for Claude AI integration (compatibility resolved)
- **httpx 0.24.1** (compatible version for Anthropic SDK)
- **python-dotenv 1.0.0** for environment variable management
- **All dependencies** installed and verified

### Frontend Environment

The frontend has been optimized with pnpm package manager:

- **pnpm 10.13.1** (latest version for better performance)
- **React 19.1.0** with TypeScript support
- **Vite 4.5.14** (Node 16 compatible version)
- **Tailwind CSS 3.4.17** with proper PostCSS configuration
- **React Hook Form + Zod** for form handling and validation
- **All dependencies** installed via pnpm with lock file
- **Comprehensive .gitignore** covering all environments

**Full-stack development environment ready!** 🚀

---

## What we need to do

- Generate a backend that accepts a sequence of chat messages and sends them to the ClaudeAI chat API.
- Maintain a system prompt that instructs the AI to return a full JSON schema representing a form.
- On every user message, send the full history of the conversation to the ClaudeAI API.
- Always return the complete, updated schema—never partial edits.
- Parse the schema on the frontend, validate it, and render it as a form dynamically.
- Handle invalid or malformed JSON with a retry option or error message.
- Keep the interface minimal and responsive

---

## AI Development Flow

1. **Backend Setup**

- Create a POST endpoint that receives chat messages.
- Prepare and include a consistent system prompt.
- Call the ClaudeAI API with the full chat history including the system and assistant messages.
- Return the AI's response to the frontend.

2. **Chat System**

- Build a chat interface on the left side of the screen.
- Maintain a history of messages from the user and the assistant.
- Trigger the backend call when the user sends a new message.

3. **Form Schema Handling**

- Expect the AI to return a JSON schema with a title and a list of fields.
- Parse the schema on the frontend and store it as the current form schema.
- Validate the schema format before rendering.

4. **Dynamic Form Rendering**

- Build a component that takes the form schema and renders input elements.
- Each field will have a type (text, number, email, checkbox, etc.), a label, and a required flag.
- The form should update instantly when a new schema is received.

5. **User Feedback & Error Handling**

- If parsing fails, show an error bubble in the chat.
- Include a retry option that re-sends the last message.
- Provide visual feedback when loading or waiting for a response.

6. **Design and Layout**

- Use a two-column layout: narrow chat sidebar and wide form panel.
- Use basic inline styles or minimal CSS to make it clean but not complex.
- Avoid external styling frameworks unless absolutely necessary.
  Two-column layout: narrow chat sidebar (30%) and wide form panel (70%)
  Responsive: single column on mobile with collapsible sidebar

UI Framework

Component Library: shadcn/ui (React + Tailwind CSS + Radix UI)
Forms: React Hook Form with Zod validation
Styling: Tailwind CSS utility classes only
Icons: Lucide React

Key Components to Use

Layout: Card, Sheet, Separator, ScrollArea
Forms: Form, FormField, Input, Textarea, Select, Button
Feedback: Alert, Toast, Badge

Code Generation Guidelines

Copy-paste shadcn/ui components as individual files
Use Tailwind classes for all styling
Follow shadcn/ui component composition patterns
Ensure all components are accessible via Radix UI primitives

## Testing Requirements (MANDATORY)

### When Adding New Components

**Frontend Components:**

- Create `ComponentName.test.tsx` alongside component file
- Test rendering, props, user interactions, and error states
- Achieve minimum 80% test coverage
- Include accessibility tests

**Backend Endpoints:**

- Create `test_endpoint_name.py` for new API endpoints
- Test success cases, validation, error handling
- Mock external dependencies (Anthropic API)
- Achieve minimum 80% test coverage

### Test File Naming Convention

```
frontend/src/components/ComponentName.test.tsx
frontend/src/hooks/useHookName.test.ts
frontend/src/services/serviceName.test.ts
backend/test_endpoint_name.py
backend/test_feature_name.py
```

### Minimum Test Requirements

**Every new component must include tests for:**

1. **Rendering**: Component renders without crashing
2. **Props**: Different prop combinations work correctly
3. **User Interactions**: Click, type, submit events
4. **Error States**: Error handling and display
5. **Accessibility**: ARIA labels, keyboard navigation

**Every new API endpoint must include tests for:**

1. **Success Cases**: Valid requests return expected responses
2. **Validation**: Invalid inputs return proper error messages
3. **Error Handling**: External API failures are handled gracefully
4. **Authentication**: Protected endpoints require proper auth
5. **Edge Cases**: Boundary conditions and unusual inputs

### Coverage Thresholds

- **New Code**: 90% minimum coverage
- **Overall Project**: 80-90% target coverage
- **Critical Paths**: 95% minimum coverage

### Running Tests Before Commit

```bash
# Required before any commit
pnpm test:all
pnpm lint
pnpm type-check
```

---

## Technical Specifications

### API Endpoint

```
POST /api/chat
Content-Type: application/json

Request Body:
{
  "messages": [
    {"role": "user", "content": "Create a contact form"}
  ]
}

Response:
{
  "schema": {
    "title": "Contact Form",
    "fields": [...]
  },
  "code": "// Generated React component code"
}
```

### Form Schema Structure

```json
{
  "title": "Form Title",
  "fields": [
    {
      "id": "field_1",
      "type": "text|email|number|textarea|checkbox|select",
      "label": "Field Label",
      "placeholder": "Optional placeholder",
      "required": true,
      "validation": {
        "pattern": "regex pattern (optional)",
        "min": "number/length",
        "max": "number/length"
      },
      "options": ["Option 1", "Option 2"] // For select fields
    }
  ]
}
```

### Error Response Format

```json
{
  "error": {
    "type": "parse_error|api_error|validation_error",
    "message": "Human-readable error message",
    "retry": true
  }
}
```

---

## System Prompt Example

```
You are a form builder assistant. When users describe forms they want, you must respond with ONLY a JSON object containing:
1. A "schema" object with the form structure
2. A "code" string with the complete React component

Schema format:
{
  "schema": {
    "title": "Form Title",
    "fields": [
      {
        "id": "unique_field_id",
        "type": "text|email|number|textarea|checkbox|select",
        "label": "Field Label",
        "placeholder": "Optional",
        "required": true/false,
        "validation": { /* optional validation rules */ },
        "options": [] // only for select type
      }
    ]
  },
  "code": "// Complete React component code here"
}

Generate production-ready React components using:
- TypeScript
- React Hook Form
- Zod validation
- shadcn/ui components
- Tailwind CSS

Respond ONLY with valid JSON. No explanations or additional text.
```

## Prompt Strategy for ClaudeAI

- The system prompt should describe the exact schema format expected.
- The assistant is expected to always return only a JSON object.
- Avoid additional text, explanation, or commentary.
- Keep temperature low for predictable structure (0.0–0.2).
- Include the most recent schema as context to ensure continuity.

---

## Code Generation and Output

### Generated Code Format

The AI will generate two types of output:

1. **Form Schema**: JSON structure for dynamic rendering
2. **React Component Code**: Ready-to-use shadcn/ui components with:
   - Full TypeScript interfaces
   - React Hook Form integration
   - Zod validation schemas
   - Tailwind styling
   - Copy button for easy code extraction

### Example Generated Component

```tsx
// The AI will generate complete, copyable React components
// with all imports, types, and logic included
```

---

## User Flow and Experience

### Creating Forms

1. User types natural language request (e.g., "Create a user registration form")
2. AI responds with form schema and live preview updates
3. Generated code appears in a collapsible panel with syntax highlighting
4. Copy button allows instant code extraction

### Modifying Forms

- User can request changes: "Add a phone number field"
- AI regenerates complete schema maintaining previous fields
- Form preview updates instantly
- New component code reflects all changes

### Chat Management

- Chat history persists during session
- "New Form" button clears chat and form
- Previous forms accessible through chat history
- Export chat history as markdown (optional)

---

## Final Notes

The purpose is to create a project that will help build larger projects requiring various UI components, providing code snippets for immediate use. This is a local tool that generates production-ready components without requiring third-party services or deployment infrastructure.
