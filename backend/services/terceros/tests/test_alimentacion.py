from app import routes
from fastapi.testclient import TestClient

client = TestClient(routes.router)


def test_solicitar_alimentacion():
    alimentacion = {
        "tipoAlimentacion": "Proteina",
        "numeroContacto": 3214567890,
        "paisActual": "Peru",
        "ciudadActual": "Lima",
        "direccionActual": "Calle Falsa 123"
    }
    response = client.post("/solicitar_alimentacion/", json=alimentacion)
    assert response.status_code == 200


def test_obtener_alimentacion():
    response = client.get("/servicios_alimentacion/")
    assert response.status_code == 200
