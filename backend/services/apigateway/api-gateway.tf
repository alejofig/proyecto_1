terraform {
  backend "s3" {
    region = "us-east-1"
  }
}

provider "aws" {
  # shared_credentials_file = "$HOME/.aws/credentials"
  region = "us-east-1"
}

# random string for apigateway secret-key env variable
resource "random_string" "apigateway-secret-key" {
  length           = 16
  special          = true
  override_special = "/@\" "
}

data "aws_availability_zones" "azs" { }

# create a VPC (Virtual Private Cloud)
resource "aws_vpc" "vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "apigateway-docker-vpc"
  }
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc.id
  tags   = {
    Name = "apigateway-docker-igw"
  }
}

locals {
  subnets = flatten([aws_subnet.public_subnets.*.id])
}

# create a Route Table for the VPC
resource "aws_route_table" "rt_public" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }

  tags = {
    Name = "apigateway-docker-rt-public"
  }
}

resource "aws_default_route_table" "rt_private_default" {
  default_route_table_id = aws_vpc.vpc.default_route_table_id

  tags = {
    Name = "apigateway-docker-rt-private-default"
  }
}

resource "aws_subnet" "public_subnets" {
  count                   = 2
  cidr_block              = "10.0.${2 * (1 - 1) + count.index + 1}.0/24"
  vpc_id                  = aws_vpc.vpc.id
  availability_zone       = data.aws_availability_zones.azs.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "apigateway-docker-tf-public-${count.index + 1}"
  }
}

# create <count> number of private subnets in each availability zone
resource "aws_subnet" "private_subnets" {
  count             = 2
  cidr_block        = "10.0.${2 * (1 - 1) + count.index + 1 + 2}.0/24"
  vpc_id            = aws_vpc.vpc.id
  availability_zone = data.aws_availability_zones.azs.names[count.index]

  tags = {
    Name = "apigateway-docker-tf-private-${count.index + 1}"
  }
}

resource "aws_route_table_association" "public-rt-association" {
  count          = 2
  route_table_id = aws_route_table.rt_public.id
  subnet_id      = aws_subnet.public_subnets.*.id[count.index]
}

# Associate the private subnets with the public route table
resource "aws_route_table_association" "private-rt-association" {
  count          = 2
  route_table_id = aws_route_table.rt_public.id
  subnet_id      = aws_subnet.private_subnets.*.id[count.index]
}

resource "aws_security_group" "public-sg" {
  name        = "public-group-default"
  description = "access to public instances"
  vpc_id      = aws_vpc.vpc.id
}

# create security group for ALB
resource "aws_security_group" "alb_sg" {
  name        = "alb-group"
  description = "control access to the application load balancer"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }
  ingress {
    protocol        = "tcp"
    from_port       = 443
    to_port         = 443
    cidr_blocks     = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }
}

# create security group to access the ecs cluster (traffic to ecs cluster should only come from the ALB)
resource "aws_security_group" "ecs_sg" {
  name        = "ecs-from-alb-group"
  description = "control access to the ecs cluster"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port       = 3001
    to_port         = 3001
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_alb" "alb" {
  load_balancer_type = "application"
  name               = "application-load-balancer-api"
  subnets            = aws_subnet.public_subnets.*.id
  security_groups    = [aws_security_group.alb_sg.id]
}

resource "aws_alb_target_group" "target_group" {
  name        = "ecs-target-group-apigateway"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.vpc.id
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

resource "aws_alb_listener" "fp-alb-listener" {
  load_balancer_arn = aws_alb.alb.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.target_group.arn
    type             = "forward"
  }
}

resource "aws_ecs_cluster" "fp-ecs-cluster" {
  name = "apigateway-app"

  tags = {
    Name = "apigateway-app"
  }
}

data "template_file" "task_definition_template" {
  template = file("task_definition.json.tpl")
  vars     = {
    REPOSITORY_URL = "344488016360.dkr.ecr.us-west-2.amazonaws.com/apigateway-sportsapp:latest"
    FLASK_APP_PORT = "3001"
    AUTH0_DOMAIN   = "dev-s8qwnnguwcupqg2o.us.auth0.com"
    AUTH0_CLIENT_SECRET = "SnUDnO1lL3CnvzeCDFFUwwsFABY-Szfr-lRkFyshOf4uSnCiM6EHMgvCDDVQ8v1u"
    AUTH0_CLIENT_ID = "3H1DJStRDxr7jeKsxyvsPEe2Af8BpUcT"
    AUTH0_API_IDENTIFIER= "https://dev-s8qwnnguwcupqg2o.us.auth0.com/api/v2/"
    SQS_URL = "https://sqs.us-east-1.amazonaws.com/344488016360/users-register-sqs-new5"
    REDIRECT_URI = "https://apigateway.uniandes-sports.com/callback"
    USERS_PATH= "https://users.uniandes-sports.com"
    ENTRENAMIENTOS_PATH = "https://entrenamientos.uniandes-sports.com"
    SERVICIOS_PATH= "https://terceros.uniandes-sports.com"
    PLANES_PATH= "https://planes.uniandes-sports.com"
    EVENTS_PATH= "https://eventos.uniandes-sports.com"
    SQS_URL_NOTIFICATIONS="https://sqs.us-east-1.amazonaws.com/344488016360/emails-register-sqs-new5"
    STRAVA_REDIRECT_URI = "https://apigateway.uniandes-sports.com/strava_callback"
    STRAVA_CLIENT_ID = "125841"
    STRAVA_ACCESS_TOKEN="e535b0ee6be2cf09ac6015efaeb7b6e9d86c2207"
    STRAVA_CLIENT_SECRET="5d2976b1f08f378f086b46e179f5946026bb8d7e"
    STRAVA_TOKEN_REFRESH="278fc804e7ef37104a2fb0d6a02672a6e9c7b962"
    FRONT_URL="https://app.uniandes-sports.com"
  }
}
resource "aws_ecs_task_definition" "task_definition" {
  family                   = "apigateway-app"
  requires_compatibilities = [
    "FARGATE"
  ]
  network_mode          = "awsvpc"
  cpu                   = 256
  memory                = 512
  execution_role_arn    = aws_iam_role.ecs_task_execution_role.arn  
  container_definitions = data.template_file.task_definition_template.rendered
  task_role_arn         = aws_iam_role.ecs_task_role.arn  
}

resource "aws_iam_role" "ecs_task_role" {
  name               = "ecs-task-role-apigateway"
  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "ecs-tasks.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  })
}


resource "aws_iam_policy_attachment" "ecs_task_role_sqs_attachment" {
  name       = "ecs-task-role-sqs-policy-attachment"
  roles      = [aws_iam_role.ecs_task_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonSQSFullAccess"  # ARN de la política de acceso completo a SQS
}

resource "aws_ecs_service" "apigateway-service" {
  name            = "apigateway-app-service"
  cluster         = aws_ecs_cluster.fp-ecs-cluster.id
  task_definition = aws_ecs_task_definition.task_definition.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    security_groups = [
      aws_security_group.ecs_sg.id
    ]
    subnets          = aws_subnet.public_subnets.*.id
    assign_public_ip = true
  }

  load_balancer {
    container_name   = "apigateway-app"
    container_port   = 3001
    target_group_arn = aws_alb_target_group.target_group.id
  }

  depends_on = [
    aws_alb_listener.fp-alb-listener
  ]
}

output "alb-dns-name" {
  value = aws_alb.alb.dns_name
}

resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name              = "/ecs/apigateway-app"  # Nombre del grupo de logs
  retention_in_days = 7  # Retención de los logs en días (ajusta según tus necesidades)
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "ecs-task-execution-role-api-gateway"
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

resource "aws_iam_policy" "ecs_cloudwatch_policy_apigw" {
  name        = "ecs-cloudwatch-policy-apigw"
  description = "Policy to allow ECS to write logs to CloudWatch"

policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
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
          "ecr:BatchGetImage",
          "sqs:ReceiveMessage",
          "sqs:*",
        ],
        "Resource": "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_cloudwatch_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_cloudwatch_policy_apigw.arn
}




resource "aws_alb_listener" "fp-alb-listener-https" {
  load_balancer_arn = aws_alb.alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "arn:aws:acm:us-east-1:344488016360:certificate/2ef926af-6b7c-4a68-ad3d-b6c6e9b59c44"
  default_action {
    target_group_arn = aws_alb_target_group.target_group.arn
    type             = "forward"
  }
}


resource "aws_route53_record" "api-gateway_subdomain" {
  zone_id = "Z0424763335GQXEDQHLWA"
  name    = "apigateway"
  type    = "A"
  alias {
    name                   = aws_alb.alb.dns_name
    zone_id                = aws_alb.alb.zone_id
    evaluate_target_health = true
  }
}

