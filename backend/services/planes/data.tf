data "aws_availability_zones" "azs" {}

data "template_file" "task_definition_template" {
  template = file("task_definition.json.tpl")
  vars = {
    REPOSITORY_URL = "344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-planes:latest"
    DB_USER        = "postgres"
    DB_PASSWORD    = "postgres"
    DB_NAME        = "postgres"
    DB_PORT        = "5432"
    DB_HOST        = aws_db_instance.db_postgres_planes.address //local.rds_endpoint_without_port
  }
}

locals {
  container_definitions = [
    {
      name      = "planes-app"
      image     = "344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-planes:latest"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 3002
          hostPort      = 3002
        }
      ],
      environment = [
        {
          name  = "DB_HOST"
          value = aws_db_instance.db_postgres_planes.address
        }
      ]
    }
  ]
}