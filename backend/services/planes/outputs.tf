#output "alb-dns-name" {
#  value = aws_alb.alb_planes.dns_name
#}
#
#output "rds_endpoint" {
#  value = aws_db_instance.db_postgres_planes.endpoint
#}
#
#output "rds_endpoint_without_port" {
#  value = local.rds_endpoint_without_port
#}