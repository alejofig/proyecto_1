from app import routes
from fastapi.testclient import TestClient

client = TestClient(routes.router)


def test_solicitar_mototaller():
    mototaller = {
            "userId": "1339",
            "fechaSesion": "2024-04-23",
            "horaSesion": "03:17:23.545Z",
            "comentariosAdicionales": "Recogeme estoy en esta dirección",
            }
    response = client.post("/solicitar_mototaller/", json=mototaller)
    assert response.status_code == 200
