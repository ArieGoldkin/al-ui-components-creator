# Testing Guide for AI Form Creator

This document outlines the testing strategy, setup, and best practices for the AI Form Creator project.

## Overview

Our testing approach ensures reliability and maintainability through comprehensive test coverage:

- **Frontend**: Vitest + React Testing Library (80-90% coverage target)
- **Backend**: pytest with Flask testing utilities (80-90% coverage target)
- **Integration**: End-to-end API testing

## Quick Start

```bash
# Run all tests
pnpm test

# Frontend tests only
pnpm test:frontend

# Backend tests only  
pnpm test:backend

# Watch mode for development
pnpm test:frontend:watch

# Coverage reports
pnpm test:frontend:coverage
pnpm test:backend:coverage
```

## Frontend Testing

### Setup

The frontend uses **Vitest** as the test runner with **React Testing Library** for component testing.

**Key Dependencies:**
- `vitest` - Fast test runner with Vite integration
- `@testing-library/react` - Component testing utilities
- `@testing-library/user-event` - User interaction simulation
- `@testing-library/jest-dom` - Additional matchers
- `msw` - API mocking
- `jsdom` - DOM environment for tests

### Test File Structure

```
frontend/src/
├── components/
│   ├── ChatSidebar.tsx
│   ├── ChatSidebar.test.tsx          # Component tests
│   └── FormPreview/
│       ├── FormPreview.tsx
│       └── FormPreview.test.tsx
├── hooks/
│   ├── useResizableSidebar.ts
│   └── useResizableSidebar.test.ts   # Hook tests
├── services/
│   ├── api.ts
│   └── api.test.ts                   # Service tests
└── test/
    ├── setup.ts                      # Test configuration
    ├── utils.tsx                     # Test utilities
    └── mocks/
        ├── server.ts                 # MSW server setup
        └── handlers.ts               # API mock handlers
```

### Writing Component Tests

**Example: Testing a React Component**

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render, createMockAppState } from '../test/utils'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  const defaultProps = {
    onAction: vi.fn(),
    data: createMockAppState(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<MyComponent {...defaultProps} />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('handles click events', async () => {
      const user = userEvent.setup()
      render(<MyComponent {...defaultProps} />)
      
      await user.click(screen.getByRole('button'))
      expect(defaultProps.onAction).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<MyComponent {...defaultProps} />)
      expect(screen.getByRole('button')).toHaveAttribute('aria-label')
    })
  })
})
```

### Testing Patterns

**1. Component Rendering**
```typescript
it('renders with different props', () => {
  render(<Component prop1="value1" prop2={true} />)
  expect(screen.getByText('Expected Text')).toBeInTheDocument()
})
```

**2. User Interactions**
```typescript
it('handles form submission', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  
  render(<Form onSubmit={onSubmit} />)
  
  await user.type(screen.getByLabelText('Name'), 'John Doe')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  expect(onSubmit).toHaveBeenCalledWith({ name: 'John Doe' })
})
```

**3. Async Operations**
```typescript
it('handles loading states', async () => {
  render(<AsyncComponent />)
  
  expect(screen.getByText('Loading...')).toBeInTheDocument()
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
})
```

**4. Error Handling**
```typescript
it('displays error messages', () => {
  render(<Component error="Something went wrong" />)
  expect(screen.getByText('Something went wrong')).toBeInTheDocument()
})
```

### API Mocking

We use **MSW (Mock Service Worker)** for API mocking:

```typescript
// In test file
import { server } from '../test/mocks/server'
import { http, HttpResponse } from 'msw'

it('handles API errors', async () => {
  server.use(
    http.post('/api/chat', () => {
      return HttpResponse.json({ error: 'API Error' }, { status: 500 })
    })
  )
  
  // Test component behavior with API error
})
```

## Backend Testing

### Setup

The backend uses **pytest** with Flask testing utilities.

**Key Dependencies:**
- `pytest` - Test framework
- `pytest-flask` - Flask-specific testing utilities
- `pytest-mock` - Mocking utilities
- `pytest-cov` - Coverage reporting
- `requests-mock` - HTTP request mocking

### Test File Structure

```
backend/
├── app.py
├── conftest.py                       # pytest configuration
├── test_app.py                       # Basic app tests
├── test_chat_endpoint.py             # Chat endpoint tests
└── tests/
    ├── test_validation.py            # Input validation tests
    ├── test_error_handling.py        # Error handling tests
    └── test_integration.py           # Integration tests
```

### Writing Backend Tests

**Example: Testing Flask Endpoints**

```python
import pytest
from unittest.mock import patch, Mock

class TestChatEndpoint:
    def test_successful_request(self, client, mock_anthropic_client):
        """Test successful chat request."""
        response = client.post('/api/chat', 
                              json={'messages': [{'role': 'user', 'content': 'test'}]})
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'schema' in data
        assert 'code' in data

    def test_validation_error(self, client):
        """Test request validation."""
        response = client.post('/api/chat', json={})
        
        assert response.status_code == 400
        data = response.get_json()
        assert data['error']['type'] == 'validation_error'

    @patch('app.client')
    def test_api_error_handling(self, mock_client, client):
        """Test API error handling."""
        mock_client.messages.create.side_effect = Exception("API Error")
        
        response = client.post('/api/chat', 
                              json={'messages': [{'role': 'user', 'content': 'test'}]})
        
        assert response.status_code == 500
        assert 'error' in response.get_json()
```

### Testing Patterns

**1. Endpoint Testing**
```python
def test_endpoint_success(client):
    response = client.get('/api/endpoint')
    assert response.status_code == 200
    assert response.get_json()['status'] == 'success'
```

**2. Input Validation**
```python
@pytest.mark.parametrize("invalid_input", [
    {},
    {'messages': []},
    {'messages': [{'invalid': 'data'}]},
])
def test_input_validation(client, invalid_input):
    response = client.post('/api/chat', json=invalid_input)
    assert response.status_code == 400
```

**3. Error Handling**
```python
def test_external_api_error(client, mock_anthropic_client):
    mock_anthropic_client.messages.create.side_effect = APIError("Rate limit")
    
    response = client.post('/api/chat', json={'messages': [...]})
    
    assert response.status_code == 500
    assert 'Rate limit' in response.get_json()['error']['message']
```

## Coverage Requirements

### Minimum Coverage Targets

- **Overall**: 80-90% line coverage
- **Critical paths**: 95%+ coverage
- **New code**: 90%+ coverage

### Coverage Exclusions

**Frontend:**
- Configuration files (`*.config.*`)
- Type definitions (`*.d.ts`)
- Entry points (`main.tsx`)
- Test utilities

**Backend:**
- Configuration files
- Environment setup
- Third-party integrations (mocked)

### Generating Coverage Reports

```bash
# Frontend coverage
pnpm test:frontend:coverage

# Backend coverage  
pnpm test:backend:coverage

# View HTML reports
open frontend/coverage/index.html
open backend/htmlcov/index.html
```

## Continuous Integration

### Pre-commit Checks

```bash
# Run before committing
pnpm test:all
pnpm lint
pnpm type-check
```

### CI Pipeline

The CI pipeline should run:

1. **Linting**: ESLint, TypeScript checks
2. **Unit Tests**: Frontend and backend tests
3. **Coverage**: Generate and validate coverage reports
4. **Integration Tests**: End-to-end API tests

## Best Practices

### General Guidelines

1. **Test Naming**: Use descriptive test names that explain the scenario
2. **Test Structure**: Follow Arrange-Act-Assert pattern
3. **Test Isolation**: Each test should be independent
4. **Mock External Dependencies**: Don't rely on external services
5. **Test Edge Cases**: Include error scenarios and boundary conditions

### Component Testing

1. **Test User Behavior**: Focus on what users see and do
2. **Avoid Implementation Details**: Test the interface, not the implementation
3. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
4. **Test Accessibility**: Ensure components are accessible

### API Testing

1. **Test All HTTP Methods**: GET, POST, PUT, DELETE
2. **Validate Response Structure**: Check status codes and response format
3. **Test Error Scenarios**: Network errors, validation errors, server errors
4. **Mock External APIs**: Use consistent mock data

### Performance Testing

1. **Test Rendering Performance**: Use React DevTools Profiler
2. **Test Memory Leaks**: Monitor component cleanup
3. **Test Large Data Sets**: Ensure components handle large amounts of data

## Troubleshooting

### Common Issues

**Frontend:**
- **Tests timing out**: Increase timeout or check for infinite loops
- **Mock not working**: Verify MSW handlers are correctly configured
- **Component not rendering**: Check for missing providers or props

**Backend:**
- **Import errors**: Verify Python path configuration
- **Mock not applied**: Check patch decorators and fixture scope
- **Database issues**: Use test database or mock database calls

### Debug Tips

```bash
# Run specific test
pnpm test:frontend -- ChatSidebar.test.tsx

# Run with debug output
pnpm test:backend:verbose

# Run single test method
cd backend && python -m pytest test_chat_endpoint.py::TestChatEndpoint::test_successful_request -v
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [pytest Documentation](https://docs.pytest.org/)
- [Flask Testing](https://flask.palletsprojects.com/en/2.3.x/testing/)
