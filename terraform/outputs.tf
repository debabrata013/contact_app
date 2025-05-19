output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.contact_app_vpc.id
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = aws_ecs_cluster.contact_app_cluster.name
}

output "ecs_service_name" {
  description = "The name of the ECS service"
  value       = aws_ecs_service.contact_app_service.name
}

output "ecr_repository_url" {
  description = "The URL of the ECR repository"
  value       = aws_ecr_repository.contact_app_repo.repository_url
}

output "load_balancer_dns" {
  description = "The DNS name of the load balancer"
  value       = aws_lb.contact_app_lb.dns_name
}

output "load_balancer_zone_id" {
  description = "The canonical hosted zone ID of the load balancer"
  value       = aws_lb.contact_app_lb.zone_id
}

output "security_group_id" {
  description = "The ID of the security group"
  value       = aws_security_group.contact_app_sg.id
}

output "public_subnet_ids" {
  description = "The IDs of the public subnets"
  value       = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
}
