terraform {
  backend "s3" {
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "vpc_planes" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "planes-vpc"
  }
}

resource "aws_internet_gateway" "igw_planes" {
  vpc_id = aws_vpc.vpc_planes.id
}

resource "aws_route_table" "route_table_planes" {
  vpc_id = aws_vpc.vpc_planes.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw_planes.id
  }
}

resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.subnet_planes_1.id
  route_table_id = aws_route_table.route_table_planes.id
}

resource "aws_subnet" "subnet_planes_1" {
  vpc_id                  = aws_vpc.vpc_planes.id
  cidr_block              = "10.0.10.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"
}

resource "aws_subnet" "subnet_planes_2" {
  vpc_id                  = aws_vpc.vpc_planes.id
  cidr_block              = "10.0.20.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1b"
}

resource "aws_db_subnet_group" "db_postgres_subnet_group_planes" {
  name       = "db_postgres_subnet_group_planes"
  subnet_ids = [aws_subnet.subnet_planes_1.id, aws_subnet.subnet_planes_2.id]
}

resource "aws_security_group" "sg_postgres_planes" {
  name        = "sg_postgres_planes"
  description = "Allow internet access to postgres"
  vpc_id      = aws_vpc.vpc_planes.id

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

resource "aws_db_instance" "db_postgres_planes" {
  allocated_storage      = 10
  engine                 = "postgres"
  engine_version         = "12.12"
  instance_class         = "db.t3.micro"
  db_name                = "db_planes"
  username               = "postgres"
  password               = "postgres"
  publicly_accessible    = true
  vpc_security_group_ids = [aws_security_group.sg_postgres_planes.id]
  db_subnet_group_name   = aws_db_subnet_group.db_postgres_subnet_group_planes.name
  skip_final_snapshot    = true

  tags = {
    Name = "planes-db"
  }
}

resource "aws_ecs_cluster" "cluster_planes" {
  name = "cluster_planes"
}

resource "aws_ecs_task_definition" "task_definition_planes" {
  family                   = "task_definition_planes"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = "arn:aws:iam::344488016360:role/ecsTaskExecutionRole"
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "servicio-planes"
      image     = "344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-planes:latest"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 3002
          hostPort      = 3002
        }
      ]
    }
  ])
}

resource "aws_security_group" "sg_fargate_planes" {
  name        = "sg_fargate_planes"
  description = "Allow inbound traffic"
  vpc_id      = aws_vpc.vpc_planes.id

  ingress {
    from_port   = 3002
    to_port     = 3002
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

resource "aws_ecs_service" "service_planes" {
  name            = "service_planes"
  cluster         = aws_ecs_cluster.cluster_planes.id
  task_definition = aws_ecs_task_definition.task_definition_planes.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.subnet_planes_1.id, aws_subnet.subnet_planes_2.id]
    security_groups  = [aws_security_group.sg_fargate_planes.id]
    assign_public_ip = true
  }
}
#test ecraaaaaaaaaaaaa