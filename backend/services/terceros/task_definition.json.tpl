[
   {
      "essential": true,
      "name":"terceros-app",
      "image":"${REPOSITORY_URL}",
      "portMappings":[
         {
            "containerPort":3007,
            "hostPort":3007,
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
          "name": "DB_HOST",
          "value": "${DB_HOST}"
        },
          {
          "name": "DB_USER",
          "value": "${DB_USER}"
        }, 
        {
          "name": "DB_PASSWORD",
          "value": "${DB_PASSWORD}"
        }, 
        {
          "name": "DB_NAME",
          "value": "${DB_NAME}"
        }, 
        {
          "name": "DB_PORT",
          "value": "${DB_PORT}"
         }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/log-group-terceros",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
   }
]