export DOCKER_DEFAULT_PLATFORM=linux/amd64
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 344488016360.dkr.ecr.us-east-1.amazonaws.com
docker build -t emails-register-lambda .
docker tag emails-register-lambda:latest 344488016360.dkr.ecr.us-east-1.amazonaws.com/emails-register-lambda:latest
docker push 344488016360.dkr.ecr.us-east-1.amazonaws.com/emails-register-lambda:latest