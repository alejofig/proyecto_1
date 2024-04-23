output "alb-dns-name" {
  value = aws_alb.alb_terceros.dns_name
}

output "rds_endpoint" {
  value = aws_db_instance.db_postgres_terceros.endpoint
}