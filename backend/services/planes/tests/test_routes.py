from app import routes
from fastapi.testclient import TestClient

client = TestClient(routes.router)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
