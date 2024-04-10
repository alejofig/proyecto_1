terraform {
  backend "s3" {
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

# VPC, Redes y Seguridad
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "eventos-vpc"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route_table" "routetable" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.public1.id
  route_table_id = aws_route_table.routetable.id
}

resource "aws_subnet" "public1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.10.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"
}

resource "aws_subnet" "public2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.20.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1b"
}

resource "aws_db_subnet_group" "postgres" {
  name       = "my-postgres-subnet-group"
  subnet_ids = [aws_subnet.public1.id, aws_subnet.public2.id]
}

resource "aws_security_group" "postgres_sg" {
  name        = "postgres_sg"
  description = "Allow internet access to postgres"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Base de datos
resource "aws_db_instance" "postgres_db_eventos" {
  allocated_storage      = 10
  engine                 = "postgres"
  engine_version         = "12.12"
  instance_class         = "db.t3.micro"
  db_name                = "mydatabase"
  username               = "postgres"
  password               = "mypassword"
  publicly_accessible    = true
  vpc_security_group_ids = [aws_security_group.postgres_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.postgres.name
  skip_final_snapshot    = true
}

# Fargate Container
resource "aws_ecs_cluster" "cluster" {
  name = "cluster-servicios-jcr"
}

resource "aws_ecs_task_definition" "task" {
  family                   = "eventos-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = "arn:aws:iam::344488016360:role/ecsTaskExecutionRole"
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "servicio-eventos"
      image     = "344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-eventos:latest"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 3001
          hostPort      = 3001
        }
      ]
    }
  ])
}

resource "aws_security_group" "fargate_sg" {
  name        = "fargate_sg"
  description = "Allow inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_service" "service" {
  name            = "mi-servicio"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public1.id, aws_subnet.public2.id]
    security_groups  = [aws_security_group.fargate_sg.id]
    assign_public_ip = true
  }
}
