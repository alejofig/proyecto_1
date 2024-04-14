# --- VPC
resource "aws_vpc" "vpc_planes" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "vpc_planes"
  }
}

# --- Internet Gateway
resource "aws_internet_gateway" "igw_planes" {
  vpc_id = aws_vpc.vpc_planes.id

  tags = {
    Name = "igw_planes"
  }
}

# --- Route Tables
resource "aws_default_route_table" "default_private_route_table_planes" {
  default_route_table_id = aws_vpc.vpc_planes.default_route_table_id

  tags = {
    Name = "default_private_route_table_planes"
  }
}

resource "aws_route_table" "public_route_table_planes" {
  vpc_id = aws_vpc.vpc_planes.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw_planes.id
  }

  tags = {
    Name = "public_route_table_planes"
  }
}

# --- Subnets
resource "aws_subnet" "public_subnet_planes" {
  count                   = 2
  cidr_block              = "10.0.${2 * (1 - 1) + count.index + 1}.0/24"
  vpc_id                  = aws_vpc.vpc_planes.id
  availability_zone       = data.aws_availability_zones.azs.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "public_subnet_planes_${count.index + 1}"
  }
}

resource "aws_subnet" "private_subnet_planes" {
  count             = 2
  cidr_block        = "10.0.${2 * (1 - 1) + count.index + 1 + 2}.0/24"
  vpc_id            = aws_vpc.vpc_planes.id
  availability_zone = data.aws_availability_zones.azs.names[count.index]

  tags = {
    Name = "private_subnet_planes_${count.index + 1}"
  }
}

# --- Route Tables Association
resource "aws_route_table_association" "rt_association_public_planes" {
  count          = 2
  subnet_id      = aws_subnet.public_subnet_planes.*.id[count.index]
  route_table_id = aws_route_table.public_route_table_planes.id
}

resource "aws_route_table_association" "rt_association_private_planes" {
  count          = 2
  subnet_id      = aws_subnet.private_subnet_planes.*.id[count.index]
  route_table_id = aws_route_table.public_route_table_planes.id
}

# --- Data Base
resource "aws_db_instance" "db_postgres_planes" {
  depends_on             = [aws_internet_gateway.igw_planes]
  identifier             = "db-planes"
  allocated_storage      = 10
  engine                 = "postgres"
  engine_version         = "12.12"
  instance_class         = "db.t3.micro"
  db_name                = "db_planes"
  username               = "postgres"
  password               = "postgres"
  publicly_accessible    = true
  vpc_security_group_ids = [aws_security_group.alb_sg_planes.id]
  db_subnet_group_name   = aws_db_subnet_group.db_postgres_subnet_group_planes.name
  skip_final_snapshot    = true
  storage_type           = "gp2"
}

resource "aws_db_subnet_group" "db_postgres_subnet_group_planes" {
  name       = "db_postgres_subnet_group_planes"
  subnet_ids = [for subnet in aws_subnet.private_subnet_planes : subnet.id]
}

# --- Load Balancer
resource "aws_alb" "alb_planes" {
  depends_on         = [aws_internet_gateway.igw_planes]
  load_balancer_type = "application"
  name               = "application-load-balancer-planes"
  subnets            = aws_subnet.public_subnet_planes.*.id
  security_groups    = [aws_security_group.alb_sg_planes.id]
}

resource "aws_security_group" "alb_sg_planes" {
  name        = "alb-group-planes"
  description = "Control access to the application load balancer"
  vpc_id      = aws_vpc.vpc_planes.id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 5432
    to_port     = 5432
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_alb_target_group" "alb_target_group_planes" {
  name        = "ecs-target-group-planes"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.vpc_planes.id
  target_type = "ip"

  health_check {
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 10
    unhealthy_threshold = 2
    healthy_threshold   = 2
  }
}

resource "aws_alb_listener" "fp-alb-listener-http-planes" {
  load_balancer_arn = aws_alb.alb_planes.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.alb_target_group_planes.arn
    type             = "forward"
  }
}

resource "aws_alb_listener" "fp-alb-listener-https-planes" {
  load_balancer_arn = aws_alb.alb_planes.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "arn:aws:acm:us-east-1:344488016360:certificate/2ef926af-6b7c-4a68-ad3d-b6c6e9b59c44"
  default_action {
    target_group_arn = aws_alb_target_group.alb_target_group_planes.arn
    type             = "forward"
  }
}

# --- ECS Cluster
resource "aws_ecs_cluster" "cluster_planes" {
  name = "cluster_planes"

  tags = {
    Name = "cluster_planes"
  }
}

resource "aws_ecs_service" "service_planes" {
  name            = "service_planes"
  cluster         = aws_ecs_cluster.cluster_planes.id
  task_definition = aws_ecs_task_definition.task_definition_planes.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public_subnet_planes.*.id
    security_groups  = [aws_security_group.ecs_fargate_sg_planes.id]
    assign_public_ip = true
  }

  load_balancer {
    container_name   = "planes-app"
    container_port   = 3002
    target_group_arn = aws_alb_target_group.alb_target_group_planes.id
  }

  depends_on = [
    aws_alb_listener.fp-alb-listener-http-planes
  ]
}

resource "aws_security_group" "ecs_fargate_sg_planes" {
  name        = "sg_fargate_planes"
  description = "Allow inbound traffic"
  vpc_id      = aws_vpc.vpc_planes.id

  ingress {
    protocol        = "tcp"
    from_port       = 80
    to_port         = 80
    cidr_blocks     = ["0.0.0.0/0"]
    security_groups = [aws_security_group.alb_sg_planes.id]
  }

  ingress {
    protocol        = "tcp"
    from_port       = 3002
    to_port         = 3002
    cidr_blocks     = ["0.0.0.0/0"]
    security_groups = [aws_security_group.alb_sg_planes.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_task_definition" "task_definition_planes" {
  family                   = "task_definition_planes"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  cpu                      = 256
  memory                   = 512
  container_definitions    = data.template_file.task_definition_template.rendered
}

# --- IAM
resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "ecs-task-execution-role-planes"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "ecs-tasks.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_policy" "ecs_cloudwatch_policy_planes" {
  name        = "ecs-cloudwatch-policy-planes"
  description = "Policy to allow ECS to write logs to CloudWatch"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:GetRepositoryPolicy",
          "ecr:DescribeRepositories",
          "ecr:ListImages",
          "ecr:DescribeImages",
          "ecr:BatchGetImage"
        ],
        "Resource" : "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_cloudwatch_attachment_planes" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_cloudwatch_policy_planes.arn
}

# --- Route53
resource "aws_route53_record" "api-gateway_subdomain" {
  zone_id = "Z0424763335GQXEDQHLWA"
  name    = "planes"
  type    = "A"
  alias {
    name                   = aws_alb.alb_planes.dns_name
    zone_id                = aws_alb.alb_planes.zone_id
    evaluate_target_health = true
  }
}

# --- Cloudwatch
resource "aws_cloudwatch_log_group" "ecs_log_group_planes" {
  name              = "/ecs/log-group-planes"
  retention_in_days = 7
}
#ok