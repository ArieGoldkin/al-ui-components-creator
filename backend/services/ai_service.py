"""
AI Service Layer for the AI Component Builder backend.

This service handles all interactions with the Anthropic Claude API,
including prompt management, response parsing, and error handling.
"""

import os
import json
import logging
from typing import Dict, Any, Optional, List
import anthropic
from anthropic.types import MessageParam
from utils.prompt_manager import PromptManager, ComponentType

logger = logging.getLogger(__name__)


class AIService:
    """Service class for handling AI interactions with Claude API"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the AI service with Anthropic client and prompt manager

        Args:
            api_key: Optional API key. If not provided, will use environment variable
        """
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self.client: Optional[anthropic.Anthropic] = None
        self.prompt_manager = PromptManager()
        self._initialize_client()
    
    def _initialize_client(self) -> None:
        """Initialize the Anthropic client with error handling"""
        if not self.api_key:
            logger.warning("ANTHROPIC_API_KEY not found in environment variables")
            return
        
        try:
            self.client = anthropic.Anthropic(api_key=self.api_key)
            logger.info("✅ AI Service: Anthropic client initialized successfully")
        except Exception as e:
            logger.error(f"❌ AI Service: Error initializing Anthropic client: {e}")
            self.client = None
    
    def is_available(self) -> bool:
        """Check if the AI service is available for use"""
        return self.client is not None
    
    def generate_component(
        self,
        messages: List[Dict[str, str]],
        component_type: Optional[ComponentType] = None
    ) -> Dict[str, Any]:
        """
        Generate a component from user messages

        Args:
            messages: List of conversation messages
            component_type: Optional specific component type, will auto-detect if not provided

        Returns:
            Dict containing the generated component data

        Raises:
            Exception: If AI service is not available or API call fails
        """
        if not self.is_available():
            raise Exception("AI service not available. Please check your API key.")

        # Validate and prepare messages
        claude_messages = self._prepare_messages(messages)

        # Detect component type if not provided
        if component_type is None:
            user_message = str(claude_messages[-1]["content"]) if claude_messages else ""
            component_type = self.prompt_manager.get_component_type_from_message(user_message)
            logger.info(f"AI Service: Auto-detected component type: {component_type.value}")

        # Get appropriate system prompt for component type
        system_prompt = self.prompt_manager.get_system_prompt(component_type)
        
        logger.info(f"AI Service: Generating {component_type.value} component with {len(claude_messages)} messages")
        
        try:
            # Check if client is available
            if not self.client:
                logger.error("AI Service: Client not initialized")
                return self._create_fallback_response(messages)

            # Call Claude API
            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                temperature=0.1,
                system=system_prompt,
                messages=claude_messages,
            )
            
            # Extract and parse response
            response_content = response.content[0].text
            logger.info(f"AI Service: Received response ({len(response_content)} characters)")

            # Parse and validate response
            parsed_response = self._parse_response(response_content)

            # Validate response format using prompt manager
            if self.prompt_manager.validate_prompt_response(response_content):
                logger.info("AI Service: Successfully parsed and validated response")
            else:
                logger.warning("AI Service: Response validation failed, but proceeding")
            
            return parsed_response
            
        except anthropic.APIError as e:
            logger.error(f"AI Service: Claude API error: {e}")
            raise Exception(f"Claude API error: {str(e)}")
        except json.JSONDecodeError as e:
            logger.error(f"AI Service: JSON parsing error: {e}")
            # Return fallback response instead of raising error
            return self._create_fallback_response(messages)
        except Exception as e:
            logger.error(f"AI Service: Unexpected error: {e}")
            raise Exception(f"AI generation failed: {str(e)}")
    
    def _prepare_messages(self, messages: List[Dict[str, str]]) -> List[MessageParam]:
        """
        Prepare and validate messages for Claude API
        
        Args:
            messages: Raw messages from request
            
        Returns:
            Validated messages for Claude API
        """
        claude_messages: List[MessageParam] = []
        for msg in messages:
            if msg.get("role") in ["user", "assistant"] and msg.get("content"):
                # Cast to MessageParam type
                message_param: MessageParam = {
                    "role": msg["role"],  # type: ignore
                    "content": msg["content"]
                }
                claude_messages.append(message_param)

        if not claude_messages:
            raise Exception("No valid messages found")

        return claude_messages
    
    def _parse_response(self, response_content: str) -> Dict[str, Any]:
        """
        Parse and validate AI response

        Args:
            response_content: Raw response from Claude

        Returns:
            Parsed and validated response in expected format

        Raises:
            json.JSONDecodeError: If response is not valid JSON
        """
        parsed_response = json.loads(response_content)

        # Basic validation of response structure
        if not isinstance(parsed_response, dict):
            raise json.JSONDecodeError("Response is not a JSON object", response_content, 0)

        # Transform new response format to expected format
        if "componentCode" in parsed_response:
            # New enhanced format - transform to expected format
            transformed_response = {
                "code": parsed_response.get("componentCode", ""),
                "schema": {
                    "title": parsed_response.get("componentType", "Component").title() + " Component",
                    "description": parsed_response.get("description", ""),
                    "type": parsed_response.get("componentType", "general"),
                    "dependencies": parsed_response.get("dependencies", []),
                    "usage": parsed_response.get("usage", ""),
                    "fields": []  # Components don't have form fields
                }
            }
            logger.info("AI Service: Transformed enhanced response format to expected format")
            return transformed_response

        # Legacy format - check for expected fields
        if "code" not in parsed_response and "schema" not in parsed_response:
            logger.warning("AI Service: Response missing expected fields (code/schema)")

        return parsed_response
    

    def _create_fallback_response(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Create a fallback response when Claude fails to return valid JSON
        
        Args:
            messages: Original messages for context
            
        Returns:
            Fallback component response
        """
        logger.info("AI Service: Using fallback response due to parsing error")
        
        return {
            "schema": {
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
                    },
                    {
                        "id": "message",
                        "type": "textarea",
                        "label": "Message",
                        "placeholder": "Enter your message",
                        "required": True,
                    },
                ],
            },
            "code": (
                "import React from 'react';\n"
                "import { useForm } from 'react-hook-form';\n\n"
                "export default function ContactForm() {\n"
                "  const { register, handleSubmit } = useForm();\n"
                "  \n"
                "  const onSubmit = (data) => {\n"
                "    console.log(data);\n"
                "  };\n"
                "  \n"
                "  return (\n"
                "    <form onSubmit={handleSubmit(onSubmit)} "
                'className="space-y-4">\n'
                "      <div>\n"
                '        <label className="block text-sm font-medium">'
                "Full Name</label>\n"
                "        <input {...register('name')} "
                'className="w-full p-2 border rounded" />\n'
                "      </div>\n"
                "      <div>\n"
                '        <label className="block text-sm font-medium">'
                "Email</label>\n"
                "        <input {...register('email')} type=\"email\" "
                'className="w-full p-2 border rounded" />\n'
                "      </div>\n"
                "      <div>\n"
                '        <label className="block text-sm font-medium">'
                "Message</label>\n"
                "        <textarea {...register('message')} "
                'className="w-full p-2 border rounded" />\n'
                "      </div>\n"
                "      <button type=\"submit\" "
                'className="bg-blue-500 text-white px-4 py-2 rounded">'
                "Submit</button>\n"
                "    </form>\n"
                "  );\n"
                "}"
            ),
        }
