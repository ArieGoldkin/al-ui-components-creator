import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import anthropic

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Anthropic client
api_key = os.getenv('ANTHROPIC_API_KEY')
if not api_key:
    print("Warning: ANTHROPIC_API_KEY not found in environment variables")
    client = None
else:
    try:
        client = anthropic.Anthropic(api_key=api_key)
        print("✅ Anthropic client initialized successfully")
    except Exception as e:
        print(f"❌ Error initializing Anthropic client: {e}")
        client = None

# System prompt for form generation
SYSTEM_PROMPT = """You are a form builder assistant. You MUST respond with ONLY valid JSON - no markdown, no explanations, no additional text.

Your response must be a JSON object with this exact structure:
{
  "schema": {
    "title": "Form Title",
    "description": "Optional form description",
    "fields": [
      {
        "id": "unique_field_id",
        "type": "text|email|number|textarea|checkbox|select|radio",
        "label": "Field Label",
        "placeholder": "Optional placeholder",
        "required": true,
        "options": ["option1", "option2"]
      }
    ]
  },
  "code": "Complete React component code as a string"
}

CRITICAL RULES:
1. Start your response with { and end with }
2. Use double quotes for all strings
3. Escape quotes inside strings with backslash
4. No trailing commas
5. No comments in JSON
6. The code field must contain the complete React component as a single string

Generate React components using React Hook Form, Zod validation, and Tailwind CSS.

RESPOND ONLY WITH VALID JSON - NO OTHER TEXT."""

def create_fallback_response(user_message):
    """Create a fallback response when Claude fails to return valid JSON"""
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
                    "required": True
                },
                {
                    "id": "email",
                    "type": "email",
                    "label": "Email Address",
                    "placeholder": "Enter your email",
                    "required": True
                },
                {
                    "id": "message",
                    "type": "textarea",
                    "label": "Message",
                    "placeholder": "Enter your message",
                    "required": True
                }
            ]
        },
        "code": "import React from 'react';\nimport { useForm } from 'react-hook-form';\n\nexport default function ContactForm() {\n  const { register, handleSubmit } = useForm();\n  \n  const onSubmit = (data) => {\n    console.log(data);\n  };\n  \n  return (\n    <form onSubmit={handleSubmit(onSubmit)} className=\"space-y-4\">\n      <div>\n        <label className=\"block text-sm font-medium\">Full Name</label>\n        <input {...register('name')} className=\"w-full p-2 border rounded\" />\n      </div>\n      <div>\n        <label className=\"block text-sm font-medium\">Email</label>\n        <input {...register('email')} type=\"email\" className=\"w-full p-2 border rounded\" />\n      </div>\n      <div>\n        <label className=\"block text-sm font-medium\">Message</label>\n        <textarea {...register('message')} className=\"w-full p-2 border rounded\" />\n      </div>\n      <button type=\"submit\" className=\"bg-blue-500 text-white px-4 py-2 rounded\">Submit</button>\n    </form>\n  );\n}"
    }

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # Check if client is initialized
        if client is None:
            return jsonify({
                'error': {
                    'type': 'api_error',
                    'message': 'Anthropic client not initialized. Please check your API key.',
                    'retry': False
                }
            }), 500

        data = request.get_json()

        if not data or 'messages' not in data:
            return jsonify({'error': {'type': 'validation_error', 'message': 'Messages are required', 'retry': False}}), 400

        messages = data['messages']
        
        # Prepare messages for Claude API
        claude_messages = []
        for msg in messages:
            if msg['role'] in ['user', 'assistant']:
                claude_messages.append({
                    'role': msg['role'],
                    'content': msg['content']
                })
        
        # Call Claude API
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4000,
            temperature=0.1,
            system=SYSTEM_PROMPT,
            messages=claude_messages
        )
        
        # Extract the response content
        response_content = response.content[0].text

        # Log the raw response for debugging
        print(f"🔍 Raw Claude response: {response_content[:500]}...")

        # Try to parse as JSON
        try:
            parsed_response = json.loads(response_content)
            return jsonify(parsed_response)
        except json.JSONDecodeError as e:
            # Log the parsing error details
            print(f"❌ JSON parsing error: {e}")
            print(f"❌ Raw response that failed to parse: {response_content}")

            # Use fallback response instead of returning error
            print("🔄 Using fallback response due to JSON parsing error")
            user_message = messages[-1]['content'] if messages else "contact form"
            fallback_response = create_fallback_response(user_message)
            return jsonify(fallback_response)
            
    except anthropic.APIError as e:
        return jsonify({
            'error': {
                'type': 'api_error',
                'message': f'Claude API error: {str(e)}',
                'retry': True
            }
        }), 500
    except Exception as e:
        return jsonify({
            'error': {
                'type': 'api_error',
                'message': f'Server error: {str(e)}',
                'retry': True
            }
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5001)
