terraform {
  backend "s3" {
    region = "us-east-1"
  }
}
provider "aws" {
  # shared_credentials_file = "$HOME/.aws/credentials"
  region = "us-east-1"
}


###### Lambda notifications

resource "aws_iam_role" "lambda_exec_role_notifications" {
  name = "lambda-exec-role-notifications"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_policy" "lambda_sqs_policy" {
  name        = "email-notification-sqs-policy"
  description = "Policy to allow Lambda to receive messages from SQS"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Action    = [
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes"
      ],
      Resource  = aws_sqs_queue.email_notification.arn
    }]
  })
}

resource "aws_iam_policy" "lambda_kms_policy" {
  name        = "lambda-kms-policy-notifications"
  description = "Policy to allow Lambda to use KMS"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Action    = [
        "kms:Encrypt",
        "kms:Decrypt"
      ],
      Resource  = "arn:aws:kms:us-east-1:344488016360:key/4f22f451-61d2-4f5c-bdd8-6e3f4a739632"
    },{
      Effect    = "Allow",
      Action    = ["ses:*"]   
      Resource  = "*"
    }]
  })
}
resource "aws_iam_policy" "lambda_cloudwatch_logs_policy" {
  name        = "lambda-cloudwatch-logs-policy-notifications"
  description = "Policy to allow Lambda to write logs to CloudWatch Logs"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Action    = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",

      ],
      Resource  = "arn:aws:logs:*:*:*"  
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_cloudwatch_logs_attachment" {
  role       = aws_iam_role.lambda_exec_role_notifications.name
  policy_arn = aws_iam_policy.lambda_cloudwatch_logs_policy.arn
}
resource "aws_iam_role_policy_attachment" "lambda_sqs_attachment" {
  role       = aws_iam_role.lambda_exec_role_notifications.name
  policy_arn = aws_iam_policy.lambda_sqs_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_kms_attachment" {
  role       = aws_iam_role.lambda_exec_role_notifications.name
  policy_arn = aws_iam_policy.lambda_kms_policy.arn
}

resource "aws_lambda_function" "email_notification" {
  function_name = "emails-register"
  role          = aws_iam_role.lambda_exec_role_notifications.arn
  package_type  = "Image"
  image_uri     = "344488016360.dkr.ecr.us-east-1.amazonaws.com/emails-register-lambda:latest"
  timeout = 30
}

resource "aws_lambda_event_source_mapping" "email_notification" {
  event_source_arn = aws_sqs_queue.email_notification.arn
  function_name    = aws_lambda_function.email_notification.function_name
  batch_size       = 1
  depends_on = [
    aws_sqs_queue.email_notification
  ]
  scaling_config {
      maximum_concurrency = 50
  }
}

resource "aws_sqs_queue" "email_notification_dlq" {
  name = "email_notification-dlq"
}

resource "aws_sqs_queue" "email_notification" {
  name = "emails-register-sqs-new5"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.email_notification_dlq.arn,
    maxReceiveCount     = 1
  })
}

resource "aws_iam_user" "email" {
  name = "email-new5"
}

resource "aws_iam_policy" "sqs_queue_policy" {
  name        = "sqs-queue-policy-new5-notification"
  description = "Policy to allow access to the SQS queue"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "sqs:*",
        ]
        Effect   = "Allow"
        Resource = "arn:aws:sqs:*:*:*"
      },
    ]
  })
}

resource "aws_iam_user_policy_attachment" "sqs_queue_policy_email" {
  user       = aws_iam_user.email.name
  policy_arn = aws_iam_policy.sqs_queue_policy.arn
}

