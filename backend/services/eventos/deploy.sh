#aws ecr create-repository --repository-name servicio-eventos --region us-east-1

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 344488016360.dkr.ecr.us-east-1.amazonaws.com

docker build -t servicio-eventos .
docker tag servicio-eventos:latest 344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-eventos:latest

docker push 344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-eventos:latest

#terraform apply -auto-approve

#/*
#terraform {
#  backend "s3" {
#    region = "us-east-1"
#  }
#}
#*/
