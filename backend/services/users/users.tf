provider "aws" {
  # shared_credentials_file = "$HOME/.aws/credentials"
  region = "us-east-1"
}


# random string for users secret-key env variable
resource "random_string" "users-secret-key" {
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
    Name = "users-docker-vpc"
  }
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc.id
  tags   = {
    Name = "users-docker-igw"
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
    Name = "users-docker-rt-public"
  }
}

resource "aws_default_route_table" "rt_private_default" {
  default_route_table_id = aws_vpc.vpc.default_route_table_id

  tags = {
    Name = "users-docker-rt-private-default"
  }
}

resource "aws_subnet" "public_subnets" {
  count                   = 2
  cidr_block              = "10.0.${2 * (1 - 1) + count.index + 1}.0/24"
  vpc_id                  = aws_vpc.vpc.id
  availability_zone       = data.aws_availability_zones.azs.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "users-docker-tf-public-${count.index + 1}"
  }
}

# create <count> number of private subnets in each availability zone
resource "aws_subnet" "private_subnets" {
  count             = 2
  cidr_block        = "10.0.${2 * (1 - 1) + count.index + 1 + 2}.0/24"
  vpc_id            = aws_vpc.vpc.id
  availability_zone = data.aws_availability_zones.azs.names[count.index]

  tags = {
    Name = "users-docker-tf-private-${count.index + 1}"
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
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
    security_groups = [aws_security_group.alb_sg.id]
  }
    ingress {
    from_port       = 5432
    to_port         = 5432
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
  name               = "application-load-balancer-users"
  subnets            = aws_subnet.public_subnets.*.id
  security_groups    = [aws_security_group.alb_sg.id]
}

resource "aws_alb_target_group" "target_group" {
  name        = "ecs-target-group-users"
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
  name = "users-app"

  tags = {
    Name = "users-app"
  }
}

data "template_file" "task_definition_template" {
  template = file("task_definition.json.tpl")
  vars = {
    REPOSITORY_URL        = "344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-users"
    DB_USER               = "users"
    DB_PASSWORD           = "userspassword"
    DB_NAME               = "postgres"
    DB_PORT               = "5432"
    DB_HOST               = local.rds_endpoint_without_port
  }
}
resource "aws_ecs_task_definition" "task_definition" {
  family                   = "users-app"
  requires_compatibilities = [
    "FARGATE"
  ]
  network_mode          = "awsvpc"
  cpu                   = 256
  memory                = 512
  execution_role_arn    = aws_iam_role.ecs_task_execution_role.arn  
  container_definitions = data.template_file.task_definition_template.rendered
}

resource "aws_ecs_service" "users-service" {
  name            = "users-app-service"
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
    container_name   = "users-app"
    container_port   = 80
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
  name              = "/ecs/users-app"  # Nombre del grupo de logs
  retention_in_days = 7  # Retención de los logs en días (ajusta según tus necesidades)
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "ecs-task-execution-role-users"
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

resource "aws_iam_policy" "ecs_cloudwatch_policy_users" {
  name        = "ecs-cloudwatch-policy-users"
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
          "ecr:BatchGetImage"
        ],
        "Resource": "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_cloudwatch_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_cloudwatch_policy_users.arn
}


resource "aws_route53_record" "api-gateway_subdomain" {
  zone_id = "Z0424763335GQXEDQHLWA"
  name    = "users"
  type    = "A"
  alias {
    name                   = aws_alb.alb.dns_name
    zone_id                = aws_alb.alb.zone_id
    evaluate_target_health = true
  }
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

resource "aws_db_instance" "users_rds" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version         = "12.14"
  instance_class         = "db.t3.micro"
  identifier           = "users-db"
  username             = "users"
  password             = "userspassword"
  parameter_group_name = "default.postgres12"
  vpc_security_group_ids = [aws_security_group.ecs_sg.id ]
  publicly_accessible = true
}

resource "aws_db_subnet_group" "my_db_subnet_group" {
  name       = "my-db-subnet-group"
  subnet_ids = [for subnet in aws_subnet.private_subnets : subnet.id]
}

output "rds_endpoint" {
  value = aws_db_instance.users_rds.endpoint
}
locals {
  rds_endpoint_without_port = "${split(":", aws_db_instance.users_rds.endpoint)[0]}"
}

output "rds_endpoint_without_port" {
  value = local.rds_endpoint_without_port
}


###### Lambda registro

resource "aws_iam_role" "lambda_exec" {
  name = "lambda-exec-role-users"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_policy" "lambda_sqs_policy" {
  name        = "lambda-sqs-policy"
  description = "Policy to allow Lambda to receive messages from SQS"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Action    = [
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes"
      ],
      Resource  = aws_sqs_queue.users_register_sqs.arn
    }]
  })
}

resource "aws_iam_policy" "lambda_kms_policy" {
  name        = "lambda-kms-policy"
  description = "Policy to allow Lambda to use KMS"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Action    = [
        "kms:Encrypt",
        "kms:Decrypt"
      ],
      Resource  = "arn:aws:kms:us-east-1:344488016360:key/4f22f451-61d2-4f5c-bdd8-6e3f4a739632"
    }]
  })
}
resource "aws_iam_policy" "lambda_cloudwatch_logs_policy" {
  name        = "lambda-cloudwatch-logs-policy"
  description = "Policy to allow Lambda to write logs to CloudWatch Logs"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Action    = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      Resource  = "arn:aws:logs:*:*:*"  
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_cloudwatch_logs_attachment" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_cloudwatch_logs_policy.arn
}
resource "aws_iam_role_policy_attachment" "lambda_sqs_attachment" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_sqs_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_kms_attachment" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_kms_policy.arn
}

resource "aws_lambda_function" "users_register" {
  function_name = "users-register"
  role          = aws_iam_role.lambda_exec.arn
  package_type  = "Image"
  image_uri     = "344488016360.dkr.ecr.us-east-1.amazonaws.com/users-register-lambda:latest"

  environment {
    variables = {
          DB_USER               = "users"
          DB_PASSWORD           = "userspassword"
          DB_NAME               = "postgres"
          DB_PORT               = "5432"
          DB_HOST               = local.rds_endpoint_without_port
          AUTH0_DOMAIN          ="dev-s8qwnnguwcupqg2o.us.auth0.com"
          AUTH0_CLIENT_SECRET   ="SnUDnO1lL3CnvzeCDFFUwwsFABY-Szfr-lRkFyshOf4uSnCiM6EHMgvCDDVQ8v1u"
          AUTH0_CLIENT_ID       ="3H1DJStRDxr7jeKsxyvsPEe2Af8BpUcT"
          AUTH0_API_IDENTIFIER  ="https://dev-s8qwnnguwcupqg2o.us.auth0.com/api/v2/"
          ALGORITHM             ="RS256"
          KMS_KEY_ID            ="4f22f451-61d2-4f5c-bdd8-6e3f4a739632"
    }
  }
  timeout = 30
}

resource "aws_lambda_event_source_mapping" "users-register" {
  event_source_arn = aws_sqs_queue.users_register_sqs.arn
  function_name    = aws_lambda_function.users_register.function_name
  batch_size       = 1
  depends_on = [
    aws_sqs_queue.users_register_sqs
  ]
  scaling_config {
      maximum_concurrency = 50
  }
}

resource "aws_sqs_queue" "users_register_dlq" {
  name = "users-register-dlq"
}

resource "aws_sqs_queue" "users_register_sqs" {
  name = "users-register-sqs"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.users_register_dlq.arn,
    maxReceiveCount     = 1
  })
}

resource "aws_iam_user" "user" {
  name = "user"
}

resource "aws_iam_policy" "sqs_queue_policy" {
  name        = "sqs-queue-policy"
  description = "Policy to allow access to the SQS queue"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "sqs:*",
        ]
        Effect   = "Allow"
        Resource = "arn:aws:sqs:*:*:*"
      },
    ]
  })
}

resource "aws_iam_user_policy_attachment" "sqs_queue_policy_user" {
  user       = aws_iam_user.user.name
  policy_arn = aws_iam_policy.sqs_queue_policy.arn
}

