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
SYSTEM_PROMPT = """You are a form builder assistant. When users describe forms they want, you must respond with ONLY a JSON object containing:
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

Respond ONLY with valid JSON. No explanations or additional text."""

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
        
        # Try to parse as JSON
        try:
            parsed_response = json.loads(response_content)
            return jsonify(parsed_response)
        except json.JSONDecodeError:
            # If not valid JSON, return error
            return jsonify({
                'error': {
                    'type': 'parse_error',
                    'message': 'AI response was not valid JSON. Please try again.',
                    'retry': True
                }
            }), 500
            
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
