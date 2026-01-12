# Lambda Module Outputs

output "lambda_role_arn" {
  description = "Lambda IAM role ARN"
  value       = aws_iam_role.lambda.arn
}

output "lambda_role_name" {
  description = "Lambda IAM role name"
  value       = aws_iam_role.lambda.name
}

output "api_gateway_url" {
  description = "API Gateway URL"
  value       = aws_apigatewayv2_stage.main.invoke_url
}

output "api_gateway_id" {
  description = "API Gateway ID"
  value       = aws_apigatewayv2_api.main.id
}

output "skin_analysis_function_name" {
  description = "Skin analysis Lambda function name"
  value       = aws_lambda_function.skin_analysis.function_name
}

output "skin_analysis_function_arn" {
  description = "Skin analysis Lambda function ARN"
  value       = aws_lambda_function.skin_analysis.arn
}

output "recommendations_function_name" {
  description = "Recommendations Lambda function name"
  value       = aws_lambda_function.recommendations.function_name
}

output "recommendations_function_arn" {
  description = "Recommendations Lambda function ARN"
  value       = aws_lambda_function.recommendations.arn
}

output "chatbot_function_name" {
  description = "Chatbot Lambda function name"
  value       = aws_lambda_function.chatbot.function_name
}

output "chatbot_function_arn" {
  description = "Chatbot Lambda function ARN"
  value       = aws_lambda_function.chatbot.arn
}
