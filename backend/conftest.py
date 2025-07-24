"""
Pytest configuration and fixtures for the Flask backend.
"""

import pytest
import sys
import os
from unittest.mock import Mock, patch

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import after path setup
from app import app  # noqa: E402


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config["TESTING"] = True
    app.config["ANTHROPIC_API_KEY"] = "test_key_for_testing"

    with app.test_client() as client:
        with app.app_context():
            yield client


@pytest.fixture
def mock_anthropic_client():
    """Mock the AI service for testing."""
    with patch("app.ai_service") as mock_ai_service:
        # Configure the mock to return a successful response
        mock_ai_service.generate_component.return_value = {
            "schema": {
                "title": "Test Form",
                "fields": [
                    {
                        "id": "test",
                        "type": "text",
                        "label": "Test Field",
                        "required": True
                    }
                ]
            },
            "code": "test code"
        }
        yield mock_ai_service


@pytest.fixture
def sample_chat_messages():
    """Sample chat messages for testing."""
    return [
        {"role": "user", "content": "Create a contact form"},
        {
            "role": "assistant",
            "content": "I'll create a contact form for you.",
        },
    ]


@pytest.fixture
def sample_form_schema():
    """Sample form schema for testing."""
    return {
        "title": "Contact Form",
        "description": "A simple contact form",
        "fields": [
            {
                "id": "name",
                "type": "text",
                "label": "Full Name",
                "placeholder": "Enter your full name",
                "required": True,
            },
            {
                "id": "email",
                "type": "email",
                "label": "Email Address",
                "placeholder": "Enter your email",
                "required": True,
                "validation": {
                    "pattern": "^[^@]+@[^@]+\\.[^@]+$",
                    "patternMessage": "Please enter a valid email address",
                },
            },
        ],
    }


@pytest.fixture
def mock_successful_api_response(sample_form_schema):
    """Mock a successful API response from Claude."""
    return {
        "schema": sample_form_schema,
        "code": "const ContactForm = () => { return <form>...</form>; };",
    }


@pytest.fixture
def mock_api_error_response():
    """Mock an API error response."""
    return {
        "error": {
            "type": "api_error",
            "message": "Claude API error: Rate limit exceeded",
            "retry": True,
        }
    }


@pytest.fixture
def mock_validation_error_response():
    """Mock a validation error response."""
    return {
        "error": {
            "type": "validation_error",
            "message": "Messages are required",
            "retry": False,
        }
    }


# Test configuration
def pytest_configure(config):
    """Configure pytest with custom markers."""
    config.addinivalue_line(
        "markers", "integration: mark test as integration test"
    )
    config.addinivalue_line("markers", "unit: mark test as unit test")
    config.addinivalue_line("markers", "slow: mark test as slow running")
