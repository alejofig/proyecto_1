aws ecr create-repository --repository-name api-gateway --region us-east-1

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 344488016360.dkr.ecr.us-east-1.amazonaws.com

docker build -t api-gateway .
docker tag api-gateway:latest 344488016360.dkr.ecr.us-east-1.amazonaws.com/api-gateway:latest

docker push 344488016360.dkr.ecr.us-east-1.amazonaws.com/api-gateway:latest

#terraform apply -auto-approve

