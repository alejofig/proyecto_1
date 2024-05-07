from app import routes
from fastapi.testclient import TestClient

client = TestClient(routes.router)


def test_crear_indicador():
    indicador = {
        "userId": "1234",
        "nombreIndicador": "Potencia",
        "sensor": "Optico",
        "unidadMedida": "Watts",
        "calculoRealizar": "EMC",
        "detallesAdicionales": "Potencia"
    }
    response = client.post("/crear_indicador/", json=indicador)
    assert response.status_code == 200


def test_consultar_indicador():
    response = client.get("/consultar_indicador/")
    assert response.status_code == 200
