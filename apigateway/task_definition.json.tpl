[
   {
      "essential": true,
      "name":"flask-app",
      "image":"${REPOSITORY_URL}",
      "portMappings":[
         {
            "containerPort":3001,
            "hostPort":3001,
            "protocol":"tcp"
         }
      ],
      "environment":[
         {
            "name":"DB_USER",
            "value":"${DB_USER}"
         },
         {
            "name":"DB_PASSWORD",
            "value":"${DB_PASSWORD}"
         },
         {
            "name":"DB_HOST",
            "value":"${DB_HOST}"
         },
         {
            "name":"DB_NAME",
            "value":"${DB_NAME}"
         },
         {
            "name":"DB_PORT",
            "value":"${DB_PORT}"
         },
         {
            "name":"APP_PORT",
            "value":"${FLASK_APP_PORT}"
         },
         {
            "name":"API_KEY",
            "value":"${API_KEY}"
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