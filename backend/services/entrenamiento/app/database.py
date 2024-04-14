from sqlmodel import Session, create_engine, SQLModel
from app import config
from app.models import Entrenamiento

SQLALCHEMY_DATABASE_URL = f"postgresql://{config.DB_ENTRENAMIENTO}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SQLModel.metadata.create_all(engine)

def create_session():
    session = Session(engine)
    return session

def create_entrenamiento(entrenamiento: Entrenamiento):
    session = create_session()
    session.add(entrenamiento)
    session.commit()
    session.refresh(entrenamiento)
    session.close()
    return entrenamiento

