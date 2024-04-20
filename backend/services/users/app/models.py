from datetime import datetime
from typing import List, Optional
from sqlmodel import Field, SQLModel, JSON, Column

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
    pais_residencia: Optional[str] = None
    ciudad_residencia: Optional[str] = None
    antiguedad_residencia: Optional[int] = None
    altura: Optional[int] = None
    tipo_plan: Optional[str] = None
    deportes: List[str] = Field(sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Needed for Column(JSON)
    class Config:
        arbitrary_types_allowed = True

