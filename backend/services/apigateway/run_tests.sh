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

# Ejecutar el flujo de trabajo para pruebas de usuarios
echo "Running tests for apigateway..."
create_virtualenv
pip install -r requirements.txt
coverage run -m pytest tests/* -v
coverage report --fail-under=80
deactivate
