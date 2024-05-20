# Configurar Application Auto Scaling
resource "aws_appautoscaling_target" "autoscaling_eventos" {
  max_capacity       = 3
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.cluster_eventos.name}/${aws_ecs_service.service_eventos.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# Configurar políticas de IAM
# Escalar hacia arriba
resource "aws_appautoscaling_policy" "scale_up_eventos" {
  name               = "scale_up_policy_eventos"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.autoscaling_eventos.resource_id
  scalable_dimension = aws_appautoscaling_target.autoscaling_eventos.scalable_dimension
  service_namespace  = aws_appautoscaling_target.autoscaling_eventos.service_namespace

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Average"

    step_adjustment {
      scaling_adjustment          = 1
      metric_interval_lower_bound = 0
    }
  }
}

# Escalar hacia abajo
resource "aws_appautoscaling_policy" "scale_down_eventos" {
  name               = "scale_down_policy_eventos"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.autoscaling_eventos.resource_id
  scalable_dimension = aws_appautoscaling_target.autoscaling_eventos.scalable_dimension
  service_namespace  = aws_appautoscaling_target.autoscaling_eventos.service_namespace

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Average"

    step_adjustment {
      scaling_adjustment          = -1
      metric_interval_lower_bound = 0
    }
  }
}

# Configurar alarmas de CloudWatch
# Escalar hacia arriba
resource "aws_cloudwatch_metric_alarm" "cpu_high_eventos" {
  alarm_name                = "cpu_high_eventos"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  evaluation_periods        = 2
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/ECS"
  period                    = 120
  statistic                 = "Average"
  threshold                 = 70
  alarm_description         = "CPU utilization too high"
  insufficient_data_actions = []
  alarm_actions             = [aws_appautoscaling_policy.scale_up_eventos.arn]

  dimensions = {
    ClusterName = aws_ecs_cluster.cluster_eventos.name
    ServiceName = aws_ecs_service.service_eventos.name
  }
}

# Escalar hacia abajo
resource "aws_cloudwatch_metric_alarm" "cpu_low_eventos" {
  alarm_name                = "cpu_low_eventos"
  comparison_operator       = "LessThanOrEqualToThreshold"
  evaluation_periods        = 2
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/ECS"
  period                    = 120
  statistic                 = "Average"
  threshold                 = 30
  alarm_description         = "CPU utilization too low"
  insufficient_data_actions = []
  alarm_actions             = [aws_appautoscaling_policy.scale_down_eventos.arn]

  dimensions = {
    ClusterName = aws_ecs_cluster.cluster_eventos.name
    ServiceName = aws_ecs_service.service_eventos.name
  }
}
