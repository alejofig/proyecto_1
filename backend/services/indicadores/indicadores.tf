# --- VPC
resource "aws_vpc" "vpc_indicadores" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "vpc_indicadores"
  }
}

# --- Internet Gateway
resource "aws_internet_gateway" "igw_indicadores" {
  vpc_id = aws_vpc.vpc_indicadores.id

  tags = {
    Name = "igw_indicadores"
  }
}

# --- Route Tables
resource "aws_default_route_table" "default_private_route_table_indicadores" {
  default_route_table_id = aws_vpc.vpc_indicadores.default_route_table_id

  tags = {
    Name = "default_private_route_table_indicadores"
  }
}

resource "aws_route_table" "public_route_table_indicadores" {
  vpc_id = aws_vpc.vpc_indicadores.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw_indicadores.id
  }

  tags = {
    Name = "public_route_table_indicadores"
  }
}

# --- Subnets
resource "aws_subnet" "public_subnet_indicadores" {
  count                   = 2
  cidr_block              = "10.0.${2 * (1 - 1) + count.index + 1}.0/24"
  vpc_id                  = aws_vpc.vpc_indicadores.id
  availability_zone       = data.aws_availability_zones.azs.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "public_subnet_indicadores_${count.index + 1}"
  }
}

resource "aws_subnet" "private_subnet_indicadores" {
  count             = 2
  cidr_block        = "10.0.${2 * (1 - 1) + count.index + 1 + 2}.0/24"
  vpc_id            = aws_vpc.vpc_indicadores.id
  availability_zone = data.aws_availability_zones.azs.names[count.index]

  tags = {
    Name = "private_subnet_indicadores_${count.index + 1}"
  }
}

# --- Route Tables Association
resource "aws_route_table_association" "rt_association_public_indicadores" {
  count          = 2
  subnet_id      = aws_subnet.public_subnet_indicadores.*.id[count.index]
  route_table_id = aws_route_table.public_route_table_indicadores.id
}

resource "aws_route_table_association" "rt_association_private_indicadores" {
  count          = 2
  subnet_id      = aws_subnet.private_subnet_indicadores.*.id[count.index]
  route_table_id = aws_route_table.public_route_table_indicadores.id
}

# --- Data Base
resource "aws_db_instance" "db_postgres_indicadores" {
  depends_on             = [aws_internet_gateway.igw_indicadores]
  identifier             = "db-indicadores"
  allocated_storage      = 10
  engine                 = "postgres"
  engine_version         = "12.15"
  instance_class         = "db.t3.micro"
  db_name                = "db_indicadores"
  username               = "postgres"
  password               = "postgres"
  publicly_accessible    = true
  vpc_security_group_ids = [aws_security_group.alb_sg_indicadores.id]
  db_subnet_group_name   = aws_db_subnet_group.db_postgres_subnet_group_indicadores.name
  skip_final_snapshot    = true
  storage_type           = "gp2"
}

resource "aws_db_subnet_group" "db_postgres_subnet_group_indicadores" {
  name       = "db_postgres_subnet_group_indicadores"
  subnet_ids = [for subnet in aws_subnet.private_subnet_indicadores : subnet.id]
}

# --- Load Balancer
resource "aws_alb" "alb_indicadores" {
  depends_on         = [aws_internet_gateway.igw_indicadores]
  load_balancer_type = "application"
  name               = "app-load-balancer-indicadores"
  subnets            = aws_subnet.public_subnet_indicadores.*.id
  security_groups    = [aws_security_group.alb_sg_indicadores.id]
}

resource "aws_security_group" "alb_sg_indicadores" {
  name        = "alb-group-indicadores"
  description = "Control access to the application load balancer"
  vpc_id      = aws_vpc.vpc_indicadores.id

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

resource "aws_alb_target_group" "alb_target_group_indicadores" {
  name        = "ecs-target-group-indicadores"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.vpc_indicadores.id
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

resource "aws_alb_listener" "fp-alb-listener-http-indicadores" {
  load_balancer_arn = aws_alb.alb_indicadores.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.alb_target_group_indicadores.arn
    type             = "forward"
  }
}

resource "aws_alb_listener" "fp-alb-listener-https-indicadores" {
  load_balancer_arn = aws_alb.alb_indicadores.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "arn:aws:acm:us-east-1:344488016360:certificate/2ef926af-6b7c-4a68-ad3d-b6c6e9b59c44"
  default_action {
    target_group_arn = aws_alb_target_group.alb_target_group_indicadores.arn
    type             = "forward"
  }
}

# --- ECS Cluster
resource "aws_ecs_cluster" "cluster_indicadores" {
  name = "cluster_indicadores"

  tags = {
    Name = "cluster_indicadores"
  }
}

resource "aws_ecs_service" "service_indicadores" {
  name            = "service_indicadores"
  cluster         = aws_ecs_cluster.cluster_indicadores.id
  task_definition = aws_ecs_task_definition.task_definition_indicadores.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public_subnet_indicadores.*.id
    security_groups  = [aws_security_group.ecs_fargate_sg_indicadores.id]
    assign_public_ip = true
  }

  load_balancer {
    container_name   = "indicadores-app"
    container_port   = 3009
    target_group_arn = aws_alb_target_group.alb_target_group_indicadores.id
  }

  depends_on = [
    aws_alb_listener.fp-alb-listener-http-indicadores
  ]
}

resource "aws_security_group" "ecs_fargate_sg_indicadores" {
  name        = "sg_fargate_indicadores"
  description = "Allow inbound traffic"
  vpc_id      = aws_vpc.vpc_indicadores.id

  ingress {
    protocol        = "tcp"
    from_port       = 80
    to_port         = 80
    cidr_blocks     = ["0.0.0.0/0"]
    security_groups = [aws_security_group.alb_sg_indicadores.id]
  }

  ingress {
    protocol        = "tcp"
    from_port       = 3009
    to_port         = 3009
    cidr_blocks     = ["0.0.0.0/0"]
    security_groups = [aws_security_group.alb_sg_indicadores.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_task_definition" "task_definition_indicadores" {
  family                   = "task_definition_indicadores"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  cpu                      = 256
  memory                   = 512
  container_definitions    = data.template_file.task_definition_template.rendered
}

# --- IAM
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecs-task-execution-role-indicadores"
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

resource "aws_iam_policy" "ecs_cloudwatch_policy_indicadores" {
  name        = "ecs-cloudwatch-policy-indicadores"
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

resource "aws_iam_role_policy_attachment" "ecs_cloudwatch_attachment_indicadores" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_cloudwatch_policy_indicadores.arn
}

# --- Route53
resource "aws_route53_record" "api-gateway_subdomain" {
  zone_id = "Z0424763335GQXEDQHLWA"
  name    = "indicadores"
  type    = "A"
  alias {
    name                   = aws_alb.alb_indicadores.dns_name
    zone_id                = aws_alb.alb_indicadores.zone_id
    evaluate_target_health = true
  }
}

# --- Cloudwatch
resource "aws_cloudwatch_log_group" "ecs_log_group_indicadores" {
  name              = "/ecs/log-group-indicadores"
  retention_in_days = 7
}
