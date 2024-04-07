from typing import Optional
from sqlmodel import Field, SQLModel,create_engine, Session
import app.config as config
from datetime import date, time

class Evento(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    fecha: date
    hora: time
    nombre: str
    ciudad: str
    pais: str
    descripcion: Optional[str] = None

SQLALCHEMY_DATABASE_URL = f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SQLModel.metadata.create_all(engine)

def create_session():
    session = Session(engine)
    return session

