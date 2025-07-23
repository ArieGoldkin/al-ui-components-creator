"""
Basic tests for the Flask application.
These tests ensure the app starts correctly and basic endpoints work.
"""

import pytest
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    app.config['TESTING'] = True
    app.config['ANTHROPIC_API_KEY'] = 'test_key_for_testing'
    
    with app.test_client() as client:
        with app.app_context():
            yield client


def test_health_endpoint(client):
    """Test the health endpoint returns 200."""
    response = client.get('/health')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data is not None
    assert 'status' in data
    assert data['status'] == 'healthy'


def test_cors_headers(client):
    """Test that CORS headers are properly set."""
    response = client.get('/health')
    assert 'Access-Control-Allow-Origin' in response.headers


def test_chat_endpoint_exists(client):
    """Test that the chat endpoint exists (even if it fails due to missing API key)."""
    response = client.post('/api/chat', 
                          json={'messages': [{'role': 'user', 'content': 'test'}]})
    
    # We expect this to fail in CI due to missing real API key, but endpoint should exist
    # Status could be 400, 401, or 500 - just not 404
    assert response.status_code != 404


def test_app_configuration():
    """Test basic app configuration."""
    assert app is not None
    assert app.config['TESTING'] is True


def test_invalid_endpoint(client):
    """Test that invalid endpoints return 404."""
    response = client.get('/nonexistent-endpoint')
    assert response.status_code == 404


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
