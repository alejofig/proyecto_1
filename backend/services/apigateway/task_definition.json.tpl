[
   {
      "essential": true,
      "name":"apigateway-app",
      "image":"${REPOSITORY_URL}",
      "portMappings":[
         {
            "containerPort":3001,
            "hostPort":3001,
            "protocol":"tcp"
         },
        {
          "containerPort":443,
          "hostPort":443,
          "protocol":"tcp"
        }
      ],
      "environment":[
         {
          "name": "SQS_URL",
          "value": "${SQS_URL}"
        },
         {
            "name":"FLASK_APP_PORT",
            "value":"${FLASK_APP_PORT}"
         },
         {
            "name":"USERS_PATH",
            "value":"${USERS_PATH}"
         },
         {
            "name":"ENTRENAMIENTOS_PATH",
            "value":"${ENTRENAMIENTOS_PATH}"
         },
         {
            "name":"AUTH0_DOMAIN",
            "value":"${AUTH0_DOMAIN}"
         },
         {
            "name":"AUTH0_CLIENT_SECRET",
            "value":"${AUTH0_CLIENT_SECRET}"
         },
         {
            "name":"AUTH0_CLIENT_ID",
            "value":"${AUTH0_CLIENT_ID}"
         },
         {
            "name":"AUTH0_API_IDENTIFIER",
            "value":"${AUTH0_API_IDENTIFIER}"
         },
         {
            "name":"REDIRECT_URI",
            "value":"${REDIRECT_URI}"
         }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/flask-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
   }
]