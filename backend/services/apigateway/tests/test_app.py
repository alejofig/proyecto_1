import json
import pytest
from app import app
from create_user import generate_random_user

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_health_check(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.json == {'status': 'OK'}

def test_consultar_usuario_success(client, mocker):
    # Mock de la función get_current_user
    mocker.patch("auth.Auth0.get_current_user", return_value={"id": "example_user"})
    # Hacer una solicitud GET a /get_current_user/ con un token de autorización válido
    with client.get('/get_current_user/', headers={"Authorization": "Bearer valid_token"}) as response:
        assert response.status_code == 200

def test_consultar_usuario_invalid_token(client, mocker):
    # Mock de la función get_current_user para simular un token inválido
    mocker.patch("app.Auth0.get_current_user", side_effect=Exception("Invalid token"))
    # Hacer una solicitud GET a /get_current_user/ con un token de autorización inválido
    with client.get('/get_current_user/', headers={"Authorization": "Bearer invalid_token"}) as response:
        assert response.status_code == 401
        assert response.json == {"detail": "No se pudo validar las credenciales"}

def test_consultar_usuario_missing_token(client):
    # Hacer una solicitud GET a /get_current_user/ sin proporcionar un token de autorización
    with client.get('/get_current_user/') as response:
        assert response.status_code == 401
        assert response.json == {"detail": "No se pudo validar las credenciales"}



def test_registrar_usuario_validation_error(client, mocker):
    response = client.post('/registrar_usuario', json=generate_random_user())
    assert response.status_code == 400
    assert "Error de validación en los datos de entrada" in response.json