from sqlmodel import Session, create_engine, SQLModel, select
from app import config
from app.models import User

SQLALCHEMY_DATABASE_URL = f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SQLModel.metadata.create_all(engine)

def create_session():
    session = Session(engine)
    return session

def create_user(user: User):
    session = create_session()
    session.add(user)
    session.commit()
    session.refresh(user)
    session.close()
    return user

def get_user_by_email(email: str):
    session = create_session()
    statement = select(User).where(User.email==email)
    results = session.exec(statement)
    user = results.first()
    return user