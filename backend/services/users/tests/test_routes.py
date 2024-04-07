# test_routes.py
from fastapi.testclient import TestClient
from app import routes
from create_user import generate_random_user
client = TestClient(routes.router)

def test_login_page():
    response = client.get("/login/")
    assert response.status_code == 200


def test_register_user():
    user_data = generate_random_user()
    response = client.post("/register/", json=user_data)
    assert response.status_code == 200
    assert "message" in response.json()
    assert response.json()["message"] == "User registered successfully"

def test_get_user_existing_user():
    # Usuario existente en la base de datos
    user_email = generate_random_user()["email"]

    response = client.get(f"/user/{user_email}")
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found"}