from app import routes
from fastapi.testclient import TestClient

client = TestClient(routes.router)


def test_crear_servicio_alimentacion():
    alimentacion = {
        "userId": "1234",
        "proveedor": "Cocina Fit",
        "proposito": "nutricion",
        "tipoAlimentacion": "Proteina",
        "modoRecibir": "virtual",
        "numeroContacto": 3214567890,
        "direccionActual": "Calle Falsa 123",
        "ciudadActual": "Lima",
        "paisActual": "Peru"
    }
    response = client.post("/crear_servicio_alimentacion/", json=alimentacion)
    assert response.status_code == 200


def test_consultar_servicio_alimentacion():
    response = client.get("/consultar_servicio_alimentacion/")
    assert response.status_code == 200
