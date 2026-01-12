"""
AWS Lambda handler for AI Chatbot using Amazon Bedrock (Claude).
Provides skincare advice and product recommendations through conversational AI.
"""

import json
import boto3
import os
from typing import Any, Optional
from datetime import datetime
from dataclasses import dataclass, asdict

# Initialize AWS clients
bedrock = boto3.client('bedrock-runtime')
dynamodb = boto3.resource('dynamodb')

# Configuration
MODEL_ID = os.environ.get('BEDROCK_MODEL_ID', 'anthropic.claude-3-sonnet-20240229-v1:0')
CONVERSATIONS_TABLE = os.environ.get('CONVERSATIONS_TABLE', 'dermastore-conversations')
MAX_TOKENS = 1024

# System prompt for the skincare assistant
SYSTEM_PROMPT = """You are Derma, an expert AI skincare assistant for Dermastore, South Africa's leading online skincare retailer. Your role is to:

1. Provide expert skincare advice based on skin types and concerns
2. Recommend appropriate products from our catalog
3. Explain skincare ingredients and their benefits
4. Help customers build effective skincare routines
5. Answer questions about product usage and compatibility

Guidelines:
- Be friendly, professional, and empathetic
- Provide evidence-based skincare advice
- Recommend products available at Dermastore (Environ, Lamelle, Heliocare, SkinCeuticals, Dermalogica)
- Always recommend sunscreen as part of any routine
- Suggest patch testing for sensitive skin
- Remind users that severe skin conditions should be seen by a dermatologist

Respond in a conversational but informative tone. Keep responses concise but helpful. 
Use ZAR (South African Rand) for any price mentions.
"""


@dataclass
class ConversationMessage:
    role: str
    content: str
    timestamp: str


def get_conversation_history(session_id: str) -> list[dict]:
    """Retrieve conversation history from DynamoDB."""
    try:
        table = dynamodb.Table(CONVERSATIONS_TABLE)
        response = table.get_item(Key={'session_id': session_id})
        
        if 'Item' in response:
            return response['Item'].get('messages', [])
        return []
    except Exception as e:
        print(f'DynamoDB error: {str(e)}')
        return []


def save_conversation(session_id: str, messages: list[dict]):
    """Save conversation history to DynamoDB."""
    try:
        table = dynamodb.Table(CONVERSATIONS_TABLE)
        table.put_item(Item={
            'session_id': session_id,
            'messages': messages,
            'updated_at': datetime.utcnow().isoformat(),
            'ttl': int(datetime.utcnow().timestamp()) + (7 * 24 * 60 * 60)  # 7 days
        })
    except Exception as e:
        print(f'DynamoDB save error: {str(e)}')


def generate_response(
    user_message: str,
    conversation_history: list[dict],
    context: Optional[dict] = None
) -> str:
    """Generate a response using Amazon Bedrock (Claude)."""
    
    # Build messages array
    messages = []
    
    # Add conversation history (last 10 messages for context)
    for msg in conversation_history[-10:]:
        messages.append({
            'role': msg['role'],
            'content': msg['content']
        })
    
    # Add current user message
    messages.append({
        'role': 'user',
        'content': user_message
    })
    
    # Build request body
    body = json.dumps({
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': MAX_TOKENS,
        'system': SYSTEM_PROMPT,
        'messages': messages
    })
    
    try:
        response = bedrock.invoke_model(
            modelId=MODEL_ID,
            body=body,
            contentType='application/json'
        )
        
        response_body = json.loads(response['body'].read())
        return response_body['content'][0]['text']
        
    except Exception as e:
        print(f'Bedrock error: {str(e)}')
        return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or contact our customer support team for assistance."


def lambda_handler(event: dict, context: Any) -> dict:
    """
    Main Lambda handler for chatbot.
    
    Expects:
    - POST request with message and optional sessionId
    
    Returns:
    - AI-generated response
    """
    try:
        # Handle CORS preflight
        if event.get('requestContext', {}).get('http', {}).get('method') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                'body': ''
            }
        
        # Parse request body
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event.get('body', {})
        
        message = body.get('message', '').strip()
        session_id = body.get('sessionId', 'default')
        user_context = body.get('context', {})  # Optional skin profile, etc.
        
        if not message:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Message is required'
                })
            }
        
        # Get conversation history
        history = get_conversation_history(session_id)
        
        # Generate response
        ai_response = generate_response(message, history, user_context)
        
        # Update conversation history
        timestamp = datetime.utcnow().isoformat()
        history.append({
            'role': 'user',
            'content': message,
            'timestamp': timestamp
        })
        history.append({
            'role': 'assistant',
            'content': ai_response,
            'timestamp': timestamp
        })
        
        # Save updated history
        save_conversation(session_id, history)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({
                'success': True,
                'response': ai_response,
                'sessionId': session_id,
                'timestamp': timestamp
            })
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Invalid JSON in request body'
            })
        }
    except Exception as e:
        print(f'Error: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': 'An unexpected error occurred'
            })
        }
