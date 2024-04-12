from app import routes
from fastapi.testclient import TestClient

client = TestClient(routes.router)


def test_crear_plan():
    plan = {
        "deporte": "Atletismo",
        "nombre": "Juan Arango",
        "numeroEntrenamientosSemana": "4",
        "objetivoDistanciaEntrenamiento": "10"
    }
    response = client.post("/planes/", json=plan)
    assert response.status_code == 200


def test_consultar_plan():
    response = client.get("/planes/")
    assert response.status_code == 200
