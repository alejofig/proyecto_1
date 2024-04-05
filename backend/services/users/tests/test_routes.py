# test_routes.py
from fastapi.testclient import TestClient
from app import routes
from create_user import generate_random_user
client = TestClient(routes.router)

def test_login_page():
    response = client.get("/login/")
    assert response.status_code == 200


def test_register_user():
    # You should mock the data for registering a user
    user_data = generate_random_user()
    response = client.post("/register/", json=user_data)
    assert response.status_code == 200
    assert "message" in response.json()
    assert response.json()["message"] == "User registered successfully"
