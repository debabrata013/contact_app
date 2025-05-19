variable "aws_region" {
  description = "The AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "The environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "app_count" {
  description = "Number of application instances to run"
  type        = number
  default     = 2
}

variable "mongodb_uri_arn" {
  description = "ARN of the MongoDB URI in AWS Secrets Manager"
  type        = string
}

variable "clerk_publishable_key_arn" {
  description = "ARN of the Clerk publishable key in AWS Secrets Manager"
  type        = string
}

variable "clerk_secret_key_arn" {
  description = "ARN of the Clerk secret key in AWS Secrets Manager"
  type        = string
}
