provider "aws" {
  region = var.aws_region
}

# ECR Repository for Docker images
resource "aws_ecr_repository" "contact_app_repo" {
  name                 = "contact-manager-app"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "contact-manager-app"
    Environment = var.environment
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "contact_app_cluster" {
  name = "contact-manager-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name        = "contact-manager-cluster"
    Environment = var.environment
  }
}

# VPC for the application
resource "aws_vpc" "contact_app_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "contact-manager-vpc"
    Environment = var.environment
  }
}

# Public subnets
resource "aws_subnet" "public_subnet_1" {
  vpc_id                  = aws_vpc.contact_app_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name        = "contact-manager-public-subnet-1"
    Environment = var.environment
  }
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id                  = aws_vpc.contact_app_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name        = "contact-manager-public-subnet-2"
    Environment = var.environment
  }
}

# Internet Gateway
resource "aws_internet_gateway" "contact_app_igw" {
  vpc_id = aws_vpc.contact_app_vpc.id

  tags = {
    Name        = "contact-manager-igw"
    Environment = var.environment
  }
}

# Route table for public subnets
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.contact_app_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.contact_app_igw.id
  }

  tags = {
    Name        = "contact-manager-public-route-table"
    Environment = var.environment
  }
}

# Associate route table with public subnets
resource "aws_route_table_association" "public_subnet_1_association" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "public_subnet_2_association" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.public_route_table.id
}

# Security group for the application
resource "aws_security_group" "contact_app_sg" {
  name        = "contact-manager-sg"
  description = "Security group for Contact Manager App"
  vpc_id      = aws_vpc.contact_app_vpc.id

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "contact-manager-sg"
    Environment = var.environment
  }
}

# ECS Task Execution Role
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "contact-manager-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "contact-manager-ecs-task-execution-role"
    Environment = var.environment
  }
}

# Attach the ECS Task Execution Role policy
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "contact_app_task" {
  family                   = "contact-manager-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "contact-manager-container"
      image     = "${aws_ecr_repository.contact_app_repo.repository_url}:latest"
      essential = true
      
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
      
      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        }
      ]
      
      secrets = [
        {
          name      = "MONGODB_URI"
          valueFrom = var.mongodb_uri_arn
        },
        {
          name      = "CLERK_PUBLISHABLE_KEY"
          valueFrom = var.clerk_publishable_key_arn
        },
        {
          name      = "CLERK_SECRET_KEY"
          valueFrom = var.clerk_secret_key_arn
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/contact-manager"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = {
    Name        = "contact-manager-task"
    Environment = var.environment
  }
}

# ECS Service
resource "aws_ecs_service" "contact_app_service" {
  name            = "contact-manager-service"
  cluster         = aws_ecs_cluster.contact_app_cluster.id
  task_definition = aws_ecs_task_definition.contact_app_task.arn
  desired_count   = var.app_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
    security_groups  = [aws_security_group.contact_app_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.contact_app_tg.arn
    container_name   = "contact-manager-container"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.contact_app_listener]

  tags = {
    Name        = "contact-manager-service"
    Environment = var.environment
  }
}

# Application Load Balancer
resource "aws_lb" "contact_app_lb" {
  name               = "contact-manager-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.contact_app_sg.id]
  subnets            = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]

  tags = {
    Name        = "contact-manager-lb"
    Environment = var.environment
  }
}

# Target Group for ALB
resource "aws_lb_target_group" "contact_app_tg" {
  name        = "contact-manager-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.contact_app_vpc.id
  target_type = "ip"

  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200-299"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }

  tags = {
    Name        = "contact-manager-tg"
    Environment = var.environment
  }
}

# ALB Listener
resource "aws_lb_listener" "contact_app_listener" {
  load_balancer_arn = aws_lb.contact_app_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.contact_app_tg.arn
  }

  tags = {
    Name        = "contact-manager-listener"
    Environment = var.environment
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "contact_app_logs" {
  name              = "/ecs/contact-manager"
  retention_in_days = 30

  tags = {
    Name        = "contact-manager-logs"
    Environment = var.environment
  }
}

# Output the ALB DNS name
output "alb_dns_name" {
  value       = aws_lb.contact_app_lb.dns_name
  description = "The DNS name of the load balancer"
}

# Output the ECR repository URL
output "ecr_repository_url" {
  value       = aws_ecr_repository.contact_app_repo.repository_url
  description = "The URL of the ECR repository"
}
