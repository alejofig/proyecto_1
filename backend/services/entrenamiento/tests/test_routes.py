# test_routes.py
from fastapi.testclient import TestClient
from app import routes
#from create_user import generate_random_user
client = TestClient(routes.router)


def test_crear_entrenamiento():
    
    entrenamiento = {
        "user_id": 1335,
        "sport_type": "Ride",
        "duration": "3",
        "fecha": "2023-10-10",
        "calories_active": 400,
        "total_calories": 600,
        "fcm": 179
    }
    response = client.post("/entrenamiento/", json=entrenamiento)
    assert response.status_code == 200

 