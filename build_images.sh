#Build image Front
cd frontWebApp
docker build -f Dockerfile -t front_sportapp .
cd ..
cd backend/services/users
#Build image users
docker build -f Dockerfile -t users_sportapp .
