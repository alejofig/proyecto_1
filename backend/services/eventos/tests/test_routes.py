from app import routes
from fastapi.testclient import TestClient

client = TestClient(routes.router)

def test_consultar_enventos():
    response = client.get("/eventos/")
    assert response.status_code == 200

def test_crear_evento():
    evento = {
        "nombre": "Evento de prueba",
        "fecha": "2021-10-10",
        "hora": "10:00",
        "ciudad": "Bogota",
        "pais": "Colombia",
        "description": "Evento de prueba para testear la creación de eventos"
    }
    response = client.post("/eventos/", json=evento)
    assert response.status_code == 200

def test_consultar_enventos_pais():
    response = client.get("/eventos/colombia")
    assert response.status_code == 200

def test_consultar_enventos_pais_limit():
    response = client.get("/eventos/colombia/1")
    assert response.status_code == 200

