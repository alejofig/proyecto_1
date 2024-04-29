docker run \
  --name postgres-prueba \
  -e POSTGRES_USER=prueba \
  -e POSTGRES_PASSWORD=prueba \
  -e POSTGRES_DB=prueba \
  -p 5432:5432 \
  postgres