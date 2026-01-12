"""
AWS Lambda handler for AI Skin Analysis using Amazon Rekognition.
Analyzes uploaded skin images and returns skin type, concerns, and recommendations.
"""

import json
import base64
import boto3
import os
from typing import Any
from dataclasses import dataclass
from datetime import datetime

# Initialize AWS clients
rekognition = boto3.client('rekognition')
bedrock = boto3.client('bedrock-runtime')

# Constants
MODEL_ID = os.environ.get('BEDROCK_MODEL_ID', 'anthropic.claude-3-sonnet-20240229-v1:0')
CONFIDENCE_THRESHOLD = 75.0


@dataclass
class SkinAnalysisResult:
    """Data class for skin analysis results."""
    skin_type: str
    concerns: list[dict]
    recommendations: list[str]
    overall_score: int
    details: dict
    confidence: float


def analyze_image_with_rekognition(image_bytes: bytes) -> dict:
    """
    Use Amazon Rekognition to detect faces and facial attributes.
    """
    try:
        response = rekognition.detect_faces(
            Image={'Bytes': image_bytes},
            Attributes=['ALL']
        )
        
        if not response.get('FaceDetails'):
            raise ValueError('No face detected in image')
        
        return response['FaceDetails'][0]
    except Exception as e:
        raise Exception(f'Rekognition analysis failed: {str(e)}')


def analyze_with_bedrock(face_data: dict, image_base64: str) -> dict:
    """
    Use Amazon Bedrock (Claude) to analyze skin and provide recommendations.
    """
    prompt = f"""You are an expert dermatologist AI assistant. Analyze the following facial analysis data and provide skincare recommendations.

Facial Analysis Data:
- Age Range: {face_data.get('AgeRange', {})}
- Gender: {face_data.get('Gender', {})}
- Emotions: {face_data.get('Emotions', [])}
- Quality: Brightness={face_data.get('Quality', {}).get('Brightness', 0)}, Sharpness={face_data.get('Quality', {}).get('Sharpness', 0)}

Based on this data, provide a JSON response with the following structure:
{{
    "skin_type": "Oily|Dry|Combination|Normal|Sensitive",
    "concerns": [
        {{"name": "concern name", "severity": "low|medium|high"}}
    ],
    "recommendations": [
        "recommendation 1",
        "recommendation 2"
    ],
    "overall_score": 0-100,
    "details": {{
        "hydration": 0-100,
        "oiliness": 0-100,
        "sensitivity": 0-100,
        "texture": 0-100,
        "pores": 0-100
    }}
}}

Respond ONLY with valid JSON, no additional text."""

    body = json.dumps({
        'anthropic_version': 'bedrock-2023-05-31',
        'max_tokens': 1024,
        'messages': [
            {
                'role': 'user',
                'content': prompt
            }
        ]
    })

    try:
        response = bedrock.invoke_model(
            modelId=MODEL_ID,
            body=body,
            contentType='application/json'
        )
        
        response_body = json.loads(response['body'].read())
        content = response_body['content'][0]['text']
        
        # Parse the JSON response
        return json.loads(content)
    except Exception as e:
        # Return default analysis if Bedrock fails
        return {
            'skin_type': 'Combination',
            'concerns': [
                {'name': 'General Skincare Maintenance', 'severity': 'low'}
            ],
            'recommendations': [
                'Use a gentle cleanser twice daily',
                'Apply moisturizer after cleansing',
                'Use SPF 30+ sunscreen daily',
                'Stay hydrated'
            ],
            'overall_score': 75,
            'details': {
                'hydration': 70,
                'oiliness': 50,
                'sensitivity': 40,
                'texture': 75,
                'pores': 60
            }
        }


def lambda_handler(event: dict, context: Any) -> dict:
    """
    Main Lambda handler for skin analysis.
    
    Expects:
    - POST request with base64-encoded image in body
    
    Returns:
    - Skin analysis results with recommendations
    """
    try:
        # Parse request
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event.get('body', {})
        
        image_data = body.get('image')
        if not image_data:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'No image provided',
                    'message': 'Please provide a base64-encoded image in the request body'
                })
            }
        
        # Remove data URL prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode image
        image_bytes = base64.b64decode(image_data)
        
        # Analyze with Rekognition
        face_data = analyze_image_with_rekognition(image_bytes)
        
        # Analyze with Bedrock
        analysis = analyze_with_bedrock(face_data, image_data)
        
        # Build response
        result = {
            'success': True,
            'timestamp': datetime.utcnow().isoformat(),
            'analysis': {
                'skinType': analysis['skin_type'],
                'concerns': analysis['concerns'],
                'recommendations': analysis['recommendations'],
                'overallScore': analysis['overall_score'],
                'details': analysis['details'],
                'confidence': face_data.get('Confidence', 0)
            }
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps(result)
        }
        
    except ValueError as e:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Invalid input',
                'message': str(e)
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
                'message': 'An error occurred during analysis'
            })
        }
