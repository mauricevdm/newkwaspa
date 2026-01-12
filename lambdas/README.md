# Dermastore Lambda Functions

AWS Lambda functions for AI-powered skincare services.

## Functions

### 1. Skin Analysis (`skin-analysis/`)
Analyzes uploaded skin images using Amazon Rekognition and Bedrock to provide:
- Skin type detection
- Concern identification
- Personalized product recommendations

**Trigger**: API Gateway (POST /api/skin-analysis)

### 2. Recommendations (`recommendations/`)
Provides personalized product recommendations using Amazon Personalize:
- User-based recommendations
- Similar product suggestions
- Skin-analysis based recommendations

**Trigger**: API Gateway (GET/POST /api/recommendations)

### 3. Chatbot (`chatbot/`)
AI-powered skincare assistant using Amazon Bedrock (Claude):
- Conversational skincare advice
- Product ingredient explanations
- Routine building assistance

**Trigger**: API Gateway (POST /api/chatbot)

## Deployment

### Prerequisites
- AWS CLI configured
- Python 3.11+
- Terraform (for infrastructure)

### Manual Deployment
```bash
# Package and deploy skin-analysis
cd skin-analysis
pip install -r requirements.txt -t .
zip -r function.zip .
aws lambda update-function-code --function-name dermastore-skin-analysis --zip-file fileb://function.zip

# Repeat for other functions
```

### Via Terraform
The Lambda functions are deployed automatically via the Terraform `lambda` module.

## Environment Variables

Each function requires specific environment variables:

### skin-analysis
- `BEDROCK_MODEL_ID`: Claude model ID for analysis

### recommendations
- `PERSONALIZE_CAMPAIGN_ARN`: Amazon Personalize campaign ARN
- `RECOMMENDATIONS_TABLE`: DynamoDB table for caching

### chatbot
- `BEDROCK_MODEL_ID`: Claude model ID for chat
- `CONVERSATIONS_TABLE`: DynamoDB table for conversation history

## Testing

### Local Testing
```python
# Test skin-analysis locally
from handler import lambda_handler
import base64

with open('test-image.jpg', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode()

event = {
    'body': json.dumps({'image': image_data})
}

result = lambda_handler(event, None)
print(result)
```

### AWS Testing
Use the AWS Console or CLI to invoke functions directly:
```bash
aws lambda invoke \
  --function-name dermastore-chatbot \
  --payload '{"body":"{\"message\":\"What is retinol?\"}"}' \
  response.json
```

## IAM Permissions

Each function requires specific IAM permissions:

### skin-analysis
- `rekognition:DetectFaces`
- `bedrock:InvokeModel`

### recommendations
- `personalize-runtime:GetRecommendations`
- `dynamodb:GetItem`, `dynamodb:PutItem`

### chatbot
- `bedrock:InvokeModel`
- `dynamodb:GetItem`, `dynamodb:PutItem`

## Monitoring

All functions are integrated with CloudWatch for:
- Logs (auto-retained for 30 days)
- Metrics (invocations, errors, duration)
- Alarms (configured via Terraform)

## Cost Optimization

- Functions use 256MB memory by default
- Timeout set to 30 seconds
- Consider Provisioned Concurrency for production
