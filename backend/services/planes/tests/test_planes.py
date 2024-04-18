from app import routes
from fastapi.testclient import TestClient

client = TestClient(routes.router)


def test_crear_plan():
    plan = {
        "deporte": "Atletismo",
        "nombre": "Abdominales",
        "usuario": "Juan Arango",
        "cantidadEntrenamientos": "4",
        "distanciaPorEntrenamientos": "10",
        "fechas": "2024/04/15"
    }
    response = client.post("/plan/", json=plan)
    assert response.status_code == 200


def test_consultar_plan():
    response = client.get("/planes/")
    assert response.status_code == 200
