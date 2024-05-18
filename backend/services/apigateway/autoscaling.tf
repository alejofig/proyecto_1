# Configurar Application Auto Scaling
resource "aws_appautoscaling_target" "autoscaling_apigateway" {
  max_capacity       = 3
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.fp-ecs-cluster.name}/${aws_ecs_service.apigateway-service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# Configurar políticas de IAM
# Escalar hacia arriba
resource "aws_appautoscaling_policy" "scale_up_apigateway" {
  name               = "scale_up_policy_apigateway"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.autoscaling_apigateway.resource_id
  scalable_dimension = aws_appautoscaling_target.autoscaling_apigateway.scalable_dimension
  service_namespace  = aws_appautoscaling_target.autoscaling_apigateway.service_namespace

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
resource "aws_appautoscaling_policy" "scale_down_apigateway" {
  name               = "scale_down_policy_apigateway"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.autoscaling_apigateway.resource_id
  scalable_dimension = aws_appautoscaling_target.autoscaling_apigateway.scalable_dimension
  service_namespace  = aws_appautoscaling_target.autoscaling_apigateway.service_namespace

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
resource "aws_cloudwatch_metric_alarm" "cpu_high_apigateway" {
  alarm_name                = "cpu_high_apigateway"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  evaluation_periods        = 2
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/ECS"
  period                    = 120
  statistic                 = "Average"
  threshold                 = 70
  alarm_description         = "CPU utilization too high"
  insufficient_data_actions = []
  alarm_actions             = [aws_appautoscaling_policy.scale_up_apigateway.arn]

  dimensions = {
    ClusterName = aws_ecs_cluster.fp-ecs-cluster.name
    ServiceName = aws_ecs_service.apigateway-service.name
  }
}

# Escalar hacia abajo
resource "aws_cloudwatch_metric_alarm" "cpu_low_apigateway" {
  alarm_name                = "cpu_low_apigateway"
  comparison_operator       = "LessThanOrEqualToThreshold"
  evaluation_periods        = 2
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/ECS"
  period                    = 120
  statistic                 = "Average"
  threshold                 = 30
  alarm_description         = "CPU utilization too low"
  insufficient_data_actions = []
  alarm_actions             = [aws_appautoscaling_policy.scale_down_apigateway.arn]

  dimensions = {
    ClusterName = aws_ecs_cluster.fp-ecs-cluster.name
    ServiceName = aws_ecs_service.apigateway-service.name
  }
}
