output "elastic_ip" {
  value       = aws_eip.backend.public_ip
  description = "Elastic IP for the backend instance"
}

output "backend_health_url" {
  value       = "http://${aws_eip.backend.public_ip}/"
  description = "Backend health URL (served by ECS task)"
}

output "wake_url" {
  value       = "${aws_apigatewayv2_stage.dev.invoke_url}/wake"
  description = "Wake endpoint (requires Basic Auth)"
}

output "status_url" {
  value       = "${aws_apigatewayv2_stage.dev.invoke_url}/status"
  description = "Status endpoint (public)"
}

output "magento_graphql_proxy_url" {
  value       = "${aws_apigatewayv2_stage.dev.invoke_url}/magento/graphql"
  description = "GraphQL proxy endpoint (public; returns 503 if backend asleep)"
}
