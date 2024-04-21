#aws ecr create-repository --repository-name servicio-medidor --region us-east-1

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 344488016360.dkr.ecr.us-east-1.amazonaws.com

docker build -t servicio-medidor .
docker tag servicio-medidor:latest 344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-medidor:latest

docker push 344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-medidor:latest

#terraform apply -auto-approve

#/*
#terraform {
#  backend "s3" {
#    region = "us-east-1"
#  }
#}
#*/