# --- VPC
resource "aws_vpc" "vpc_eventos" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "vpc_eventos"
  }
}

# --- Internet Gateway
resource "aws_internet_gateway" "igw_eventos" {
  vpc_id = aws_vpc.vpc_eventos.id

  tags = {
    Name = "igw_eventos"
  }
}

# --- Route Tables
resource "aws_default_route_table" "default_private_route_table_eventos" {
  default_route_table_id = aws_vpc.vpc_eventos.default_route_table_id

  tags = {
    Name = "default_private_route_table_eventos"
  }
}

resource "aws_route_table" "public_route_table_eventos" {
  vpc_id = aws_vpc.vpc_eventos.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw_eventos.id
  }

  tags = {
    Name = "public_route_table_eventos"
  }
}

# --- Subnets
resource "aws_subnet" "public_subnet_eventos" {
  count                   = 2
  cidr_block              = "10.0.${2 * (1 - 1) + count.index + 1}.0/24"
  vpc_id                  = aws_vpc.vpc_eventos.id
  availability_zone       = data.aws_availability_zones.azs.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "public_subnet_eventos_${count.index + 1}"
  }
}

resource "aws_subnet" "private_subnet_eventos" {
  count             = 2
  cidr_block        = "10.0.${2 * (1 - 1) + count.index + 1 + 2}.0/24"
  vpc_id            = aws_vpc.vpc_eventos.id
  availability_zone = data.aws_availability_zones.azs.names[count.index]

  tags = {
    Name = "private_subnet_eventos_${count.index + 1}"
  }
}

# --- Route Tables Association
resource "aws_route_table_association" "rt_association_public_eventos" {
  count          = 2
  subnet_id      = aws_subnet.public_subnet_eventos.*.id[count.index]
  route_table_id = aws_route_table.public_route_table_eventos.id
}

resource "aws_route_table_association" "rt_association_private_eventos" {
  count          = 2
  subnet_id      = aws_subnet.private_subnet_eventos.*.id[count.index]
  route_table_id = aws_route_table.public_route_table_eventos.id
}

# --- Data Base
resource "aws_db_instance" "db_postgres_eventos" {
  depends_on             = [aws_internet_gateway.igw_eventos]
  identifier             = "db-eventos"
  allocated_storage      = 10
  engine                 = "postgres"
  engine_version         = "12.15"
  instance_class         = "db.t3.micro"
  db_name                = "db_eventos"
  username               = "postgres"
  password               = "postgres"
  publicly_accessible    = true
  vpc_security_group_ids = [aws_security_group.alb_sg_eventos.id]
  db_subnet_group_name   = aws_db_subnet_group.db_postgres_subnet_group_eventos.name
  skip_final_snapshot    = true
  storage_type           = "gp2"
}

resource "aws_db_subnet_group" "db_postgres_subnet_group_eventos" {
  name       = "db_postgres_subnet_group_eventos"
  subnet_ids = [for subnet in aws_subnet.private_subnet_eventos : subnet.id]
}

# --- Load Balancer
resource "aws_alb" "alb_eventos" {
  depends_on         = [aws_internet_gateway.igw_eventos]
  load_balancer_type = "application"
  name               = "app-load-balancer-eventos"
  subnets            = aws_subnet.public_subnet_eventos.*.id
  security_groups    = [aws_security_group.alb_sg_eventos.id]
}

resource "aws_security_group" "alb_sg_eventos" {
  name        = "alb-group-eventos"
  description = "Control access to the application load balancer"
  vpc_id      = aws_vpc.vpc_eventos.id

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

resource "aws_alb_target_group" "alb_target_group_eventos" {
  name        = "ecs-target-group-eventos"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.vpc_eventos.id
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

resource "aws_alb_listener" "fp-alb-listener-http-eventos" {
  load_balancer_arn = aws_alb.alb_eventos.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.alb_target_group_eventos.arn
    type             = "forward"
  }
}

resource "aws_alb_listener" "fp-alb-listener-https-eventos" {
  load_balancer_arn = aws_alb.alb_eventos.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "arn:aws:acm:us-east-1:344488016360:certificate/2ef926af-6b7c-4a68-ad3d-b6c6e9b59c44"
  default_action {
    target_group_arn = aws_alb_target_group.alb_target_group_eventos.arn
    type             = "forward"
  }
}

# --- ECS Cluster
resource "aws_ecs_cluster" "cluster_eventos" {
  name = "cluster_eventos"

  tags = {
    Name = "cluster_eventos"
  }
}

resource "aws_ecs_service" "service_eventos" {
  name            = "service_eventos"
  cluster         = aws_ecs_cluster.cluster_eventos.id
  task_definition = aws_ecs_task_definition.task_definition_eventos.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public_subnet_eventos.*.id
    security_groups  = [aws_security_group.ecs_fargate_sg_eventos.id]
    assign_public_ip = true
  }

  load_balancer {
    container_name   = "eventos-app"
    container_port   = 3001
    target_group_arn = aws_alb_target_group.alb_target_group_eventos.id
  }

  depends_on = [
    aws_alb_listener.fp-alb-listener-http-eventos
  ]
}

resource "aws_security_group" "ecs_fargate_sg_eventos" {
  name        = "sg_fargate_eventos"
  description = "Allow inbound traffic"
  vpc_id      = aws_vpc.vpc_eventos.id

  ingress {
    protocol        = "tcp"
    from_port       = 80
    to_port         = 80
    cidr_blocks     = ["0.0.0.0/0"]
    security_groups = [aws_security_group.alb_sg_eventos.id]
  }

  ingress {
    protocol        = "tcp"
    from_port       = 3001
    to_port         = 3001
    cidr_blocks     = ["0.0.0.0/0"]
    security_groups = [aws_security_group.alb_sg_eventos.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}
data "aws_availability_zones" "azs" {}

data "template_file" "task_definition_template" {
  template = file("task_definition.json.tpl")
  vars = {
    REPOSITORY_URL = "344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-eventos:latest"
    DB_USER        = "postgres"
    DB_PASSWORD    = "postgres"
    DB_NAME        = "postgres"
    DB_PORT        = "5432"
    DB_HOST        = aws_db_instance.db_postgres_eventos.address
  }
}
resource "aws_ecs_task_definition" "task_definition_eventos" {
  family                   = "task_definition_eventos"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  cpu                      = 256
  memory                   = 512
  container_definitions    = data.template_file.task_definition_template.rendered
}

# --- IAM
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecs-task-execution-role-eventos"
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

resource "aws_iam_policy" "ecs_cloudwatch_policy_eventos" {
  name        = "ecs-cloudwatch-policy-eventos"
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

resource "aws_iam_role_policy_attachment" "ecs_cloudwatch_attachment_eventos" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_cloudwatch_policy_eventos.arn
}

# --- Route53
resource "aws_route53_record" "api-gateway_subdomain" {
  zone_id = "Z0424763335GQXEDQHLWA"
  name    = "eventos"
  type    = "A"
  alias {
    name                   = aws_alb.alb_eventos.dns_name
    zone_id                = aws_alb.alb_eventos.zone_id
    evaluate_target_health = true
  }
}

# --- Cloudwatch
resource "aws_cloudwatch_log_group" "ecs_log_group_eventos" {
  name              = "/ecs/log-group-eventos"
  retention_in_days = 7
}