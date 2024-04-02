from typing import Optional
from sqlmodel import Field, SQLModel,create_engine, Session
import app.config as config

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    email: str
    auth0_id: Optional[str] = None
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    tipo_documentacion: Optional[str] = None
    numero_identificacion: Optional[str] = None
    genero: Optional[str] = None
    edad: Optional[int] = None
    peso: Optional[int] = None
    pais_nacimiento: Optional[str] = None
    ciudad_nacimiento: Optional[str] = None
    antiguedad_residencia: Optional[int] = None

SQLALCHEMY_DATABASE_URL = f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SQLModel.metadata.create_all(engine)

def create_session():
    session = Session(engine)
    return session

