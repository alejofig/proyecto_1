output "alb-dns-name" {
  value = aws_alb.alb_terceros.dns_name
}

output "rds_endpoint" {
  value = aws_db_instance.db_postgres_terceros.endpoint
}

output "aws_vpc_name" {
  value = aws_vpc.vpc_terceros.id
}