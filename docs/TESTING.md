# Testing Guide

This document provides comprehensive information about the testing setup and practices for the AI Form Creator project.

## 🎯 Test Overview

Our project maintains **100% test coverage** with a comprehensive test suite covering both frontend and backend components.

### Test Statistics
- **Frontend Tests**: 64/64 passing ✅
- **Backend Tests**: 19/19 passing ✅
- **Total Tests**: 83/83 passing ✅

## 🧪 Frontend Testing

### Technology Stack
- **Framework**: [Vitest](https://vitest.dev/) - Fast unit test framework
- **Testing Library**: [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) - Simple and complete testing utilities
- **User Interactions**: [@testing-library/user-event](https://testing-library.com/docs/user-event/intro/) - Fire events the same way the user does

### Test Categories

#### Component Tests
- **LoadingSpinner** (15 tests): Size variants, styling, animations, accessibility
- **ErrorBoundary** (13 tests): Error handling, recovery, logging, accessibility
- **ChatSidebar** (13 tests): Rendering, user interactions, message display, accessibility
- **FormPreview** (2 tests): Empty state, form rendering

#### Hook Tests
- **useResizableSidebar** (12 tests): Initialization, persistence, resize functionality, constraints, cleanup

#### Service Tests
- **API Service** (9 tests): Message sending, error handling, response transformation, network errors

### Running Frontend Tests

```bash
# Run all frontend tests
cd frontend
pnpm run test:run

# Run tests in watch mode (development)
pnpm run test

# Run tests with coverage
pnpm run test:coverage
```

## 🐍 Backend Testing

### Technology Stack
- **Framework**: [pytest](https://pytest.org/) - Mature full-featured Python testing tool
- **Mocking**: [unittest.mock](https://docs.python.org/3/library/unittest.mock.html) - Mock object library
- **Flask Testing**: [Flask test client](https://flask.palletsprojects.com/en/2.3.x/testing/) - Built-in testing utilities

### Test Categories

#### API Endpoint Tests
- **Health Endpoint**: Basic connectivity and CORS
- **Chat Endpoint**: Message processing, validation, error handling, integration flow

#### Error Handling Tests
- **Validation Errors**: Missing messages, empty arrays, invalid JSON
- **API Errors**: Anthropic API failures, network issues, malformed responses
- **Fallback Responses**: Graceful degradation when Claude API fails

### Running Backend Tests

```bash
# Run all backend tests
cd backend
python -m pytest -v

# Run specific test file
python -m pytest test_chat_endpoint.py -v

# Run with short traceback
python -m pytest -v --tb=short
```

## 🚀 Running All Tests

### Local Test Runner
We provide a convenient script to run all tests locally:

```bash
# Run all tests (frontend + backend)
./scripts/run-all-tests.sh
```

This script will:
- ✅ Run all 64 frontend tests
- ✅ Run all 19 backend tests  
- ✅ Provide a comprehensive summary
- ✅ Exit with proper status codes for CI/CD

### Individual Test Commands

```bash
# Frontend only
cd frontend && pnpm run test:run

# Backend only
cd backend && python -m pytest -v
```

## 🔄 Continuous Integration

### GitHub Actions Workflow

Our CI pipeline runs automatically on:
- **Push** to `main` or `feature/ui-ux-modernization` branches
- **Pull Requests** to `main` branch

#### Pipeline Structure

1. **Lint & Build Job**
   - TypeScript type checking
   - ESLint linting
   - Frontend build
   - Backend validation

2. **Test Job** (runs after lint & build)
   - Frontend test suite (64 tests)
   - Backend test suite (19 tests)
   - Test result summary

3. **Status Job** (final status check)
   - Overall CI status
   - Pass/fail determination

### CI Badge
Add this badge to your README to show CI status:

```markdown
![CI Status](https://github.com/ArieGoldkin/al-ui-components-creator/workflows/CI%20Pipeline/badge.svg)
```

## 📊 Test Coverage

### Frontend Coverage
- **Components**: 100% - All React components fully tested
- **Hooks**: 100% - Custom hooks with comprehensive scenarios
- **Services**: 100% - API service with error handling
- **Utils**: 100% - Utility functions and helpers

### Backend Coverage
- **Endpoints**: 100% - All API endpoints tested
- **Error Handling**: 100% - All error scenarios covered
- **Integration**: 100% - End-to-end request/response flow
- **Validation**: 100% - Input validation and sanitization

## 🛠️ Writing Tests

### Frontend Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### Backend Test Example

```python
import pytest
from app import app

class TestMyEndpoint:
    def test_successful_request(self, client):
        response = client.post('/api/my-endpoint', 
                              json={'data': 'test'},
                              content_type='application/json')
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'result' in data
```

## 🔧 Test Configuration

### Frontend Configuration
- **Config File**: `frontend/vitest.config.ts`
- **Setup File**: `frontend/src/test/setup.ts`
- **Test Utils**: `frontend/src/test/utils.tsx`

### Backend Configuration
- **Config File**: `backend/pytest.ini`
- **Fixtures**: `backend/conftest.py`
- **Test Data**: Mock responses and sample data

## 📈 Best Practices

### General
- ✅ Write tests before implementing features (TDD)
- ✅ Test behavior, not implementation details
- ✅ Use descriptive test names
- ✅ Keep tests focused and isolated
- ✅ Mock external dependencies

### Frontend Specific
- ✅ Use `screen` queries from Testing Library
- ✅ Test user interactions with `userEvent`
- ✅ Verify accessibility attributes
- ✅ Test error boundaries and loading states

### Backend Specific
- ✅ Test all HTTP status codes
- ✅ Validate request/response formats
- ✅ Test error handling and edge cases
- ✅ Use proper fixtures and mocks

## 🚨 Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout in test configuration
2. **Mock not working**: Ensure proper import paths and setup
3. **Async tests failing**: Use proper `await` and `waitFor` patterns
4. **CI tests passing locally but failing in CI**: Check environment differences

### Getting Help

- Check test logs for detailed error messages
- Review similar test patterns in the codebase
- Consult framework documentation (Vitest, pytest)
- Ask team members for code review

---

**Happy Testing! 🧪✨**
