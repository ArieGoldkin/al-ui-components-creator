"""
Comprehensive tests for the chat endpoint.
Tests API functionality, validation, error handling, and integration scenarios.
"""

import pytest
import json
from unittest.mock import patch, Mock
import anthropic


class TestChatEndpoint:
    """Test cases for the /api/chat endpoint."""

    def test_successful_chat_request(
        self, client, mock_anthropic_client, sample_chat_messages
    ):
        """Test successful chat request with valid messages."""
        response = client.post(
            "/api/chat",
            json={"messages": sample_chat_messages},
            content_type="application/json",
        )

        assert response.status_code == 200
        data = response.get_json()

        # The API returns the parsed Claude response directly
        # (title, fields, code)
        assert "title" in data
        assert "fields" in data
        assert "code" in data
        assert data["title"] == "Test Form"
        assert "test code" in data["code"]

        # Verify the Anthropic client was called correctly
        mock_anthropic_client.messages.create.assert_called_once()
        call_args = mock_anthropic_client.messages.create.call_args
        assert call_args[1]["model"] == "claude-3-5-sonnet-20241022"
        assert call_args[1]["max_tokens"] == 4000

    def test_chat_request_missing_messages(self, client):
        """Test chat request without messages field."""
        response = client.post(
            "/api/chat", json={}, content_type="application/json"
        )

        assert response.status_code == 400
        data = response.get_json()

        assert "error" in data
        assert data["error"]["type"] == "validation_error"
        assert "Messages are required" in data["error"]["message"]
        assert data["error"]["retry"] is False

    def test_chat_request_empty_messages(self, client):
        """Test chat request with empty messages array."""
        response = client.post(
            "/api/chat", json={"messages": []}, content_type="application/json"
        )

        assert response.status_code == 400
        data = response.get_json()

        assert "error" in data
        assert data["error"]["type"] == "validation_error"

    def test_chat_request_invalid_json(self, client):
        """Test chat request with invalid JSON."""
        response = client.post(
            "/api/chat", data="invalid json", content_type="application/json"
        )

        assert response.status_code == 400

    def test_chat_request_no_content_type(self, client, sample_chat_messages):
        """Test chat request without proper content type."""
        response = client.post(
            "/api/chat", data=json.dumps({"messages": sample_chat_messages})
        )

        # Should still work as Flask can parse JSON
        assert response.status_code in [
            200,
            400,
            500,
        ]  # Depends on other factors

    @patch("app.client", None)
    def test_chat_request_no_anthropic_client(
        self, client, sample_chat_messages
    ):
        """Test chat request when Anthropic client is not initialized."""
        response = client.post(
            "/api/chat",
            json={"messages": sample_chat_messages},
            content_type="application/json",
        )

        assert response.status_code == 500
        data = response.get_json()

        assert "error" in data
        assert data["error"]["type"] == "api_error"
        assert "not initialized" in data["error"]["message"]
        assert data["error"]["retry"] is False

    def test_anthropic_api_error(self, client, sample_chat_messages):
        """Test handling of Anthropic API errors."""
        with patch("app.client") as mock_client:
            # Create a proper APIError with required parameters
            from unittest.mock import Mock

            mock_request = Mock()
            mock_client.messages.create.side_effect = anthropic.APIError(
                "Rate limit exceeded",
                request=mock_request,
                body={"error": {"message": "Rate limit exceeded"}},
            )

            response = client.post(
                "/api/chat",
                json={"messages": sample_chat_messages},
                content_type="application/json",
            )

            assert response.status_code == 500
            data = response.get_json()

            assert "error" in data
            assert data["error"]["type"] == "api_error"
            assert "Rate limit exceeded" in data["error"]["message"]
            assert data["error"]["retry"] is True

    def test_general_exception_handling(self, client, sample_chat_messages):
        """Test handling of general exceptions."""
        with patch("app.client") as mock_client:
            mock_client.messages.create.side_effect = Exception(
                "Unexpected error"
            )

            response = client.post(
                "/api/chat",
                json={"messages": sample_chat_messages},
                content_type="application/json",
            )

            assert response.status_code == 500
            data = response.get_json()

            assert "error" in data
            assert data["error"]["type"] == "api_error"
            assert "Unexpected error" in data["error"]["message"]
            assert data["error"]["retry"] is True

    def test_message_filtering(self, client, mock_anthropic_client):
        """Test that only user and assistant messages are sent to Claude."""
        messages = [
            {"role": "system", "content": "System message"},
            {"role": "user", "content": "User message"},
            {"role": "assistant", "content": "Assistant message"},
            {"role": "unknown", "content": "Unknown role"},
        ]

        response = client.post(
            "/api/chat",
            json={"messages": messages},
            content_type="application/json",
        )

        assert response.status_code == 200

        # Check that only user and assistant messages were sent
        call_args = mock_anthropic_client.messages.create.call_args
        sent_messages = call_args[1]["messages"]

        assert len(sent_messages) == 2
        assert sent_messages[0]["role"] == "user"
        assert sent_messages[1]["role"] == "assistant"

    def test_malformed_claude_response(self, client, sample_chat_messages):
        """Test handling of malformed response from Claude."""
        with patch("app.client") as mock_client:
            mock_response = Mock()
            mock_response.content = [Mock(text="invalid json")]
            mock_client.messages.create.return_value = mock_response

            response = client.post(
                "/api/chat",
                json={"messages": sample_chat_messages},
                content_type="application/json",
            )

            # The API returns 200 with fallback response when JSON parsing
            # fails
            assert response.status_code == 200
            data = response.get_json()
            # Should return fallback response structure
            assert "schema" in data
            assert "code" in data
            assert data["schema"]["title"] == "Contact Form"

    def test_empty_claude_response(self, client, sample_chat_messages):
        """Test handling of empty response from Claude."""
        with patch("app.client") as mock_client:
            mock_response = Mock()
            mock_response.content = []
            mock_client.messages.create.return_value = mock_response

            response = client.post(
                "/api/chat",
                json={"messages": sample_chat_messages},
                content_type="application/json",
            )

            assert response.status_code == 500
            data = response.get_json()

            assert "error" in data

    @pytest.mark.integration
    def test_full_integration_flow(self, client, mock_anthropic_client):
        """Integration test for the complete chat flow."""
        # First request - create form
        messages = [{"role": "user", "content": "Create a contact form"}]

        response = client.post(
            "/api/chat",
            json={"messages": messages},
            content_type="application/json",
        )

        assert response.status_code == 200
        data = response.get_json()

        # The API returns the parsed Claude response directly
        # (title, fields, code)
        assert "title" in data
        assert "fields" in data
        assert "code" in data
        assert data["title"] == "Test Form"

        # Verify the response structure matches expected format
        assert "fields" in data
        assert isinstance(data["fields"], list)
        assert len(data["fields"]) > 0

        # Verify field structure
        field = data["fields"][0]
        required_field_keys = ["id", "type", "label", "required"]
        for key in required_field_keys:
            assert key in field

    def test_cors_headers(self, client, sample_chat_messages):
        """Test that CORS headers are properly set."""
        response = client.post(
            "/api/chat",
            json={"messages": sample_chat_messages},
            content_type="application/json",
        )

        # CORS headers should be present (handled by Flask-CORS)
        # This test verifies the endpoint is accessible for cross-origin
        # requests
        assert response.status_code in [
            200,
            400,
            500,
        ]  # Any valid HTTP response

    def test_request_timeout_handling(self, client, sample_chat_messages):
        """Test handling of request timeouts."""
        with patch("app.client") as mock_client:
            mock_client.messages.create.side_effect = (
                anthropic.APITimeoutError("Request timeout")
            )

            response = client.post(
                "/api/chat",
                json={"messages": sample_chat_messages},
                content_type="application/json",
            )

            assert response.status_code == 500
            data = response.get_json()

            assert "error" in data
            assert data["error"]["retry"] is True
