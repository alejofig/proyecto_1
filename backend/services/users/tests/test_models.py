# test_models.py
from app.models import User

def test_user_model():
    # Crear una instancia de User
    user = User(
        username="testuser",
        password="testpassword",
        email="test@example.com",
        nombre="Test",
        apellido="User",
        tipo_documentacion="DNI",
        numero_identificacion="12345678",
        genero="Masculino",
        edad=30,
        peso=70,
        pais_nacimiento="Argentina",
        ciudad_nacimiento="Buenos Aires",
        antiguedad_residencia=25
    )

    # Verificar que los atributos se establecieron correctamente
    assert user.username == "testuser"
    assert user.password == "testpassword"
    assert user.email == "test@example.com"
    assert user.nombre == "Test"
    assert user.apellido == "User"
    assert user.tipo_documentacion == "DNI"
    assert user.numero_identificacion == "12345678"
    assert user.genero == "Masculino"
    assert user.edad == 30
    assert user.peso == 70
    assert user.pais_nacimiento == "Argentina"
    assert user.ciudad_nacimiento == "Buenos Aires"
    assert user.antiguedad_residencia == 25