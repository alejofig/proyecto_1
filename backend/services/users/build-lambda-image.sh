export DOCKER_DEFAULT_PLATFORM=linux/amd64
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 344488016360.dkr.ecr.us-east-1.amazonaws.com
docker build -t users-register-lambda -f Dockerfile.lambda .
docker tag users-register-lambda:latest 344488016360.dkr.ecr.us-east-1.amazonaws.com/users-register-lambda:latest
docker push 344488016360.dkr.ecr.us-east-1.amazonaws.com/users-register-lambda:latest