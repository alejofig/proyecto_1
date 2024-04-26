from app import routes
from fastapi.testclient import TestClient

client = TestClient(routes.router)


def test_crear_sesion_entrenador():
    entrenador = {
        "userId": "1234",
        "proveedor": "AlejoFit",
        "tipoEntrenamiento": "Grupal",
        "fechaSesion": "2024-04-15",
        "horaSesion": "08:30",
        "comentarios": "Comentarios"
    }
    response = client.post("/crear_sesion_entrenador/", json=entrenador)
    assert response.status_code == 200


def test_consultar_sesion_entrenador():
    response = client.get("/consultar_sesion_entrenador/")
    assert response.status_code == 200
