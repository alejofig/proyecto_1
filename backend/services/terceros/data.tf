data "aws_availability_zones" "azs" {}

data "template_file" "task_definition_template" {
  template = file("task_definition.json.tpl")
  vars = {
    REPOSITORY_URL = "344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-terceros:latest"
    DB_USER        = "postgres"
    DB_PASSWORD    = "postgres"
    DB_NAME        = "postgres"
    DB_PORT        = "5432"
    DB_HOST        = aws_db_instance.db_postgres_terceros.address
  }
}