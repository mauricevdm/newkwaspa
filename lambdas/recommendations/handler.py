"""
AWS Lambda handler for AI-powered product recommendations using Amazon Personalize.
Provides personalized product recommendations based on user behavior and preferences.
"""

import json
import boto3
import os
from typing import Any, Optional
from datetime import datetime

# Initialize AWS clients
personalize_runtime = boto3.client('personalize-runtime')
dynamodb = boto3.resource('dynamodb')

# Configuration
CAMPAIGN_ARN = os.environ.get('PERSONALIZE_CAMPAIGN_ARN', '')
RECOMMENDATIONS_TABLE = os.environ.get('RECOMMENDATIONS_TABLE', 'dermastore-recommendations')


def get_personalized_recommendations(
    user_id: str,
    num_results: int = 10,
    filter_arn: Optional[str] = None
) -> list[dict]:
    """
    Get personalized recommendations for a user from Amazon Personalize.
    """
    try:
        params = {
            'campaignArn': CAMPAIGN_ARN,
            'userId': user_id,
            'numResults': num_results
        }
        
        if filter_arn:
            params['filterArn'] = filter_arn
        
        response = personalize_runtime.get_recommendations(**params)
        
        return [
            {
                'itemId': item['itemId'],
                'score': item.get('score', 0)
            }
            for item in response.get('itemList', [])
        ]
    except Exception as e:
        print(f'Personalize error: {str(e)}')
        return []


def get_similar_items(
    item_id: str,
    num_results: int = 10
) -> list[dict]:
    """
    Get similar items based on a given product.
    """
    try:
        response = personalize_runtime.get_recommendations(
            campaignArn=CAMPAIGN_ARN,
            itemId=item_id,
            numResults=num_results
        )
        
        return [
            {
                'itemId': item['itemId'],
                'score': item.get('score', 0)
            }
            for item in response.get('itemList', [])
        ]
    except Exception as e:
        print(f'Similar items error: {str(e)}')
        return []


def get_skin_based_recommendations(
    skin_type: str,
    concerns: list[str],
    num_results: int = 10
) -> list[dict]:
    """
    Get recommendations based on skin analysis results.
    Uses rule-based filtering combined with Personalize.
    """
    # Map skin concerns to product categories/tags
    concern_mappings = {
        'acne': ['acne', 'blemish', 'oil-control', 'salicylic-acid'],
        'aging': ['anti-aging', 'retinol', 'collagen', 'peptides'],
        'hyperpigmentation': ['brightening', 'vitamin-c', 'niacinamide'],
        'dryness': ['hydrating', 'hyaluronic-acid', 'moisturizing'],
        'sensitivity': ['gentle', 'calming', 'fragrance-free', 'centella'],
        'oiliness': ['oil-control', 'mattifying', 'clay'],
    }
    
    # Build filter criteria
    tags = []
    for concern in concerns:
        concern_lower = concern.lower()
        for key, values in concern_mappings.items():
            if key in concern_lower:
                tags.extend(values)
    
    # Default recommendations based on skin type
    skin_type_products = {
        'oily': ['lightweight-moisturizer', 'gel-cleanser', 'oil-free-sunscreen'],
        'dry': ['rich-moisturizer', 'cream-cleanser', 'hydrating-serum'],
        'combination': ['balanced-moisturizer', 'gentle-cleanser', 'niacinamide-serum'],
        'normal': ['daily-moisturizer', 'foam-cleanser', 'vitamin-c-serum'],
        'sensitive': ['gentle-moisturizer', 'micellar-water', 'centella-serum'],
    }
    
    base_products = skin_type_products.get(skin_type.lower(), [])
    
    # Return mock recommendations (in production, query Personalize with filters)
    return [
        {'itemId': product, 'score': 0.9 - (i * 0.05), 'reason': f'Recommended for {skin_type} skin'}
        for i, product in enumerate(base_products[:num_results])
    ]


def lambda_handler(event: dict, context: Any) -> dict:
    """
    Main Lambda handler for product recommendations.
    
    Endpoints:
    - GET /recommendations?userId=xxx - Get personalized recommendations
    - GET /recommendations/similar?itemId=xxx - Get similar products
    - POST /recommendations/skin-analysis - Get recommendations based on skin analysis
    """
    try:
        # Parse request
        http_method = event.get('requestContext', {}).get('http', {}).get('method', 'GET')
        path = event.get('rawPath', event.get('path', ''))
        query_params = event.get('queryStringParameters', {}) or {}
        
        if http_method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                'body': ''
            }
        
        # Route to appropriate handler
        if 'similar' in path:
            # Similar items endpoint
            item_id = query_params.get('itemId')
            if not item_id:
                return error_response(400, 'itemId parameter required')
            
            num_results = int(query_params.get('limit', 10))
            recommendations = get_similar_items(item_id, num_results)
            
        elif 'skin-analysis' in path and http_method == 'POST':
            # Skin-based recommendations
            body = json.loads(event.get('body', '{}'))
            skin_type = body.get('skinType', 'normal')
            concerns = body.get('concerns', [])
            num_results = body.get('limit', 10)
            
            recommendations = get_skin_based_recommendations(
                skin_type, concerns, num_results
            )
            
        else:
            # Default personalized recommendations
            user_id = query_params.get('userId', 'anonymous')
            num_results = int(query_params.get('limit', 10))
            recommendations = get_personalized_recommendations(user_id, num_results)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'timestamp': datetime.utcnow().isoformat(),
                'recommendations': recommendations,
                'count': len(recommendations)
            })
        }
        
    except Exception as e:
        print(f'Error: {str(e)}')
        return error_response(500, 'Internal server error')


def error_response(status_code: int, message: str) -> dict:
    """Generate error response."""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': False,
            'error': message
        })
    }
