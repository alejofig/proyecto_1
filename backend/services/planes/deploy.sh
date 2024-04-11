aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 344488016360.dkr.ecr.us-east-1.amazonaws.com
echo test
docker build -t servicio-planes .
docker tag servicio-planes:latest 344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-planes:latest
docker push 344488016360.dkr.ecr.us-east-1.amazonaws.com/servicio-planes:latest