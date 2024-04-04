from sqlmodel import Session
from app import config
from app.models import User, create_session


def create_user(user: User):
    session = create_session()
    session.add(user)
    session.commit()
    session.close()
    return user