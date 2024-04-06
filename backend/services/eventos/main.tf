provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
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
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.10.0/24"
  map_public_ip_on_launch = true
  availability_zone = "us-east-1a"
}

resource "aws_subnet" "public2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.20.0/24"
  map_public_ip_on_launch = true
  availability_zone = "us-east-1b"
}

resource "aws_db_subnet_group" "postgres" {
  name        = "my-postgres-subnet-group"
  subnet_ids  = [aws_subnet.public1.id, aws_subnet.public2.id]
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

resource "aws_db_instance" "postgres_db_eventos" {
  allocated_storage    = 10
  engine               = "postgres"
  engine_version       = "12.12"
  instance_class       = "db.t3.micro"
  db_name              = "mydatabase"
  username             = "postgres"
  password             = "mypassword"
  publicly_accessible  = true
  vpc_security_group_ids = [aws_security_group.postgres_sg.id]
  db_subnet_group_name = aws_db_subnet_group.postgres.name
  skip_final_snapshot  = true
}
