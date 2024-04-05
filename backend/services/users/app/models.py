from typing import Optional
from sqlmodel import Field, SQLModel

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    password: str
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

