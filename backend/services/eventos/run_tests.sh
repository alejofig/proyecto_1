#!/bin/bash

# Función para crear e inicializar el entorno virtual
create_virtualenv() {
    if [ ! -d "venv" ]; then
        if [[ "$OSTYPE" == "msys" ]]; then
            python -m venv venv
        else
            python3 -m venv venv
        fi
    fi
    source venv/bin/activate
}

run_database() {
    docker run --name users_tests -e POSTGRES_PASSWORD=prueba -e POSTGRES_USER=prueba -e POSTGRES_DB=prueba -p $1:5432 -d postgres
    sleep 5 # Esperar un poco para que la base de datos se levante completamente
}


cleanup() {
    echo "Cleaning up..."
    
    # Detener y eliminar el contenedor Docker
    docker stop users_tests
    docker rm users_tests

    echo "Cleanup complete"
}


# Ejecutar el flujo de trabajo para pruebas de usuarios
echo "Running tests for eventos..."
create_virtualenv
pip install -r requirements.txt
run_database 5434
uvicorn main:app --host 0.0.0.0 --port 8000 &
uvicorn_pid=$!
sleep 5
kill "$uvicorn_pid"
coverage run -m pytest tests/* -v
coverage report --fail-under=70
deactivate
cleanup
cd ..
