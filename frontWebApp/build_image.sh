export DOCKER_DEFAULT_PLATFORM=linux/amd64
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 344488016360.dkr.ecr.us-west-2.amazonaws.com
docker build -t front-sportapp .
docker tag front-sportapp:latest 344488016360.dkr.ecr.us-west-2.amazonaws.com/front-sportapp:latest
docker push 344488016360.dkr.ecr.us-west-2.amazonaws.com/front-sportapp:latest
