from app import routes
from fastapi.testclient import TestClient

client = TestClient(routes.router)


def test_sesion_entrenador():
    entrenador = {
        "tipoEntrenamiento": "Grupal",
        "fechaSesion": "2024-04-15",
        "horaSesion": "08:30",
        "comentarios": "Comentarios"
    }
    response = client.post("/sesion_entrenador/", json=entrenador)
    assert response.status_code == 200


def test_obtener_sesion_entrenador():
    response = client.get("/sesiones_entrenador/")
    assert response.status_code == 200
