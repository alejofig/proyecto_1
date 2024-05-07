# test_database.py
from app.database import create_user, create_session
from app.models import User
from sqlalchemy.exc import IntegrityError
from tests.create_user import generate_random_user

def test_create_user():
    user = User(**generate_random_user())

    try:
        created_user = create_user(user)
    except IntegrityError as e:
        assert False, f"Error de integridad al crear usuario: {e}"
    assert created_user.id is not None
    assert created_user.username == user.username
    assert created_user.email == user.email