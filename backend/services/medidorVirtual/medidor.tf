# --- VPC
resource "aws_vpc" "vpc_medidor" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "vpc_medidor"
  }
}

# --- Internet Gateway
resource "aws_internet_gateway" "igw_medidor" {
  vpc_id = aws_vpc.vpc_medidor.id

  tags = {
    Name = "igw_medidor"
  }
}

# --- Route Tables
resource "aws_default_route_table" "default_private_route_table_medidor" {
  default_route_table_id = aws_vpc.vpc_medidor.default_route_table_id

  tags = {
    Name = "default_private_route_table_medidor"
  }
}

resource "aws_route_table" "public_route_table_medidor" {
  vpc_id = aws_vpc.vpc_medidor.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw_medidor.id
  }

  tags = {
    Name = "public_route_table_medidor"
  }
}

# --- Subnets
resource "aws_subnet" "public_subnet_medidor" {
  count                   = 2
  cidr_block              = "10.0.${2 * (1 - 1) + count.index + 1}.0/24"
  vpc_id                  = aws_vpc.vpc_medidor.id
  availability_zone       = data.aws_availability_zones.azs.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "public_subnet_medidor_${count.index + 1}"
  }
}

resource "aws_subnet" "private_subnet_medidor" {
  count             = 2
  cidr_block        = "10.0.${2 * (1 - 1) + count.index + 1 + 2}.0/24"
  vpc_id            = aws_vpc.vpc_medidor.id
  availability_zone = data.aws_availability_zones.azs.names[count.index]

  tags = {
    Name = "private_subnet_medidor_${count.index + 1}"
  }
}

# --- Route Tables Association
resource "aws_route_table_association" "rt_association_public_medidor" {
  count          = 2
  subnet_id      = aws_subnet.public_subnet_medidor.*.id[count.index]
  route_table_id = aws_route_table.public_route_table_medidor.id
}

resource "aws_route_table_association" "rt_association_private_medidor" {
  count          = 2
  subnet_id      = aws_subnet.private_subnet_medidor.*.id[count.index]
  route_table_id = aws_route_table.public_route_table_medidor.id
}

# --- Data Base
resource "aws_db_instance" "db_postgres_medidor" {
  depends_on             = [aws_internet_gateway.igw_medidor]
  identifier             = "db-medidor-v2"
  allocated_storage      = 10
  engine                 = "postgres"
  engine_version         = "12.12"
  instance_class         = "db.t3.micro"
  db_name                = "db_medidor"
  username               = "postgres"
  password               = "postgres"
  publicly_accessible    = true
  vpc_security_group_ids = [aws_security_group.alb_sg_medidor.id]
  db_subnet_group_name   = aws_db_subnet_group.db_postgres_subnet_group_medidor.name
  skip_final_snapshot    = true
  storage_type           = "gp2"
}

resource "aws_db_subnet_group" "db_postgres_subnet_group_medidor" {
  name       = "db_postgres_subnet_group_medidor"
  subnet_ids = [for subnet in aws_subnet.private_subnet_medidor : subnet.id]
}

# --- Load Balancer
resource "aws_alb" "alb_medidor" {
  depends_on         = [aws_internet_gateway.igw_medidor]
  load_balancer_type = "application"
  name               = "app-load-balancer-medidor"
  subnets            = aws_subnet.public_subnet_medidor.*.id
  security_groups    = [aws_security_group.alb_sg_medidor.id]
}

resource "aws_security_group" "alb_sg_medidor" {
  name        = "alb-group-medidor"
  description = "Control access to the application load balancer"
  vpc_id      = aws_vpc.vpc_medidor.id

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

resource "aws_alb_target_group" "alb_target_group_medidor" {
  name        = "ecs-target-group-medidor"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.vpc_medidor.id
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

resource "aws_alb_listener" "fp-alb-listener-http-medidor" {
  load_balancer_arn = aws_alb.alb_medidor.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.alb_target_group_medidor.arn
    type             = "forward"
  }
}

resource "aws_alb_listener" "fp-alb-listener-https-medidor" {
  load_balancer_arn = aws_alb.alb_medidor.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "arn:aws:acm:us-east-1:344488016360:certificate/2ef926af-6b7c-4a68-ad3d-b6c6e9b59c44"
  default_action {
    target_group_arn = aws_alb_target_group.alb_target_group_medidor.arn
    type             = "forward"
  }
}

# --- ECS Cluster
resource "aws_ecs_cluster" "cluster_medidor" {
  name = "cluster_medidor"

  tags = {
    Name = "cluster_medidor"
  }
}

resource "aws_ecs_service" "service_medidor" {
  name            = "service_medidor"
  cluster         = aws_ecs_cluster.cluster_medidor.id
  task_definition = aws_ecs_task_definition.task_definition_medidor.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public_subnet_medidor.*.id
    security_groups  = [aws_security_group.ecs_fargate_sg_medidor.id]
    assign_public_ip = true
  }

  load_balancer {
    container_name   = "medidor-app"
    container_port   = 3001
    target_group_arn = aws_alb_target_group.alb_target_group_medidor.id
  }

  depends_on = [
    aws_alb_listener.fp-alb-listener-http-medidor
  ]
}

resource "aws_security_group" "ecs_fargate_sg_medidor" {
  name        = "sg_fargate_medidor"
  description = "Allow inbound traffic"
  vpc_id      = aws_vpc.vpc_medidor.id

  ingress {
    protocol        = "tcp"
    from_port       = 80
    to_port         = 80
    cidr_blocks     = ["0.0.0.0/0"]
    security_groups = [aws_security_group.alb_sg_medidor.id]
  }

  ingress {
    protocol        = "tcp"
    from_port       = 3001
    to_port         = 3001
    cidr_blocks     = ["0.0.0.0/0"]
    security_groups = [aws_security_group.alb_sg_medidor.id]
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
  vars     = {
    REPOSITORY_URL = "344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-medidor:latest"
    DB_USER        = "postgres"
    DB_PASSWORD    = "postgres"
    DB_NAME        = "postgres"
    DB_PORT        = "5432"
    DB_HOST        = aws_db_instance.db_postgres_medidor.address
  }
}
resource "aws_ecs_task_definition" "task_definition_medidor" {
  family                   = "task_definition_medidor"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  cpu                      = 256
  memory                   = 512
  container_definitions    = data.template_file.task_definition_template.rendered
}

# --- IAM
resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "ecs-task-execution-role-medidor"
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

resource "aws_iam_policy" "ecs_cloudwatch_policy_medidor" {
  name        = "ecs-cloudwatch-policy-medidor"
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

resource "aws_iam_role_policy_attachment" "ecs_cloudwatch_attachment_medidor" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_cloudwatch_policy_medidor.arn
}

# --- Route53
resource "aws_route53_record" "api-gateway_subdomain" {
  zone_id = "Z0424763335GQXEDQHLWA"
  name    = "medidor"
  type    = "A"
  alias {
    name                   = aws_alb.alb_medidor.dns_name
    zone_id                = aws_alb.alb_medidor.zone_id
    evaluate_target_health = true
  }
}

# --- Cloudwatch
resource "aws_cloudwatch_log_group" "ecs_log_group_medidor" {
  name              = "/ecs/log-group-medidor"
  retention_in_days = 7
}