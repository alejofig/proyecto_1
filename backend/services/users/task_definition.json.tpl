[
   {
      "essential": true,
      "name":"users-app",
      "image":"${REPOSITORY_URL}",
      "portMappings":[
         {
            "containerPort":80,
            "hostPort":80,
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
          "value": "${DB_HOST}
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
        },
         {
            "name":"FLASK_APP_PORT",
            "value":"${FLASK_APP_PORT}"
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
         }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/users-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
   }
]