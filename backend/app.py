import os
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from services.ai_service import AIService

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize services
ai_service = AIService()
conversation_service = None  # Will be implemented in next task

logger.info("✅ Services initialized successfully")

def handle_error(error_type, message, status_code=500, retry=True):
    """Centralized error handling function"""
    error_response = {
        "error": {
            "type": error_type,
            "message": message,
            "retry": retry,
        }
    }
    logger.error(f"API Error: {error_type} - {message}")
    return jsonify(error_response), status_code





@app.route("/api/chat", methods=["POST"])
def chat():
    """Handle chat messages and generate component responses"""
    try:
        logger.info("Received chat request")

        # Check if AI service is available
        if not ai_service.is_available():
            return handle_error(
                "api_error",
                "AI service not available. Please check your API key.",
                500,
                False
            )

        try:
            data = request.get_json()
        except Exception as e:
            logger.error(f"JSON parsing error: {e}")
            return handle_error("validation_error", "Invalid JSON format", 400, False)

        if not data or "messages" not in data:
            return handle_error("validation_error", "Messages are required", 400, False)

        messages = data["messages"]

        # Validate messages array is not empty
        if not messages:
            return handle_error("validation_error", "Messages array cannot be empty", 400, False)

        # Use AI service to generate component
        component_response = ai_service.generate_component(messages)
        return jsonify(component_response)

    except Exception as e:
        logger.exception("Unexpected error in chat endpoint")
        return handle_error("api_error", f"Server error: {str(e)}", 500, True)


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    logger.debug("Health check requested")
    return jsonify({"status": "healthy"})


if __name__ == "__main__":
    logger.info("Starting AI Component Builder backend server...")
    app.run(debug=True, host="localhost", port=5001)
