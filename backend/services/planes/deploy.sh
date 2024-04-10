aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 344488016360.dkr.ecr.us-east-1.amazonaws.com
docker build -t servicio-users .
docker tag servicio-users:latest 344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-users:latest
docker push 344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-users:latest