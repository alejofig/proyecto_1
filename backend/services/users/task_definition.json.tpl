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
         }, 
        {
          "name": "STRAVA_CLIENT_ID",
          "value": "${STRAVA_CLIENT_ID}"
         }, 
        {
          "name": "STRAVA_ACCESS_TOKEN",
          "value": "${STRAVA_ACCESS_TOKEN}"
         }, 
        {
          "name": "STRAVA_CLIENT_SECRET",
          "value": "${STRAVA_CLIENT_SECRET}"
         }, 
        {
          "name": "STRAVA_TOKEN_REFRESH",
          "value": "${STRAVA_TOKEN_REFRESH}"
         }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/users-app-new",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
   }
]