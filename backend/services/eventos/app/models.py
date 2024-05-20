from datetime import date, time
from typing import Optional

from sqlmodel import Field, SQLModel


class Evento(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    fecha: date
    hora: time
    nombre: str
    ciudad: str
    pais: str
    descripcion: Optional[str] = None

class Notificacion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    fecha: date
    hora: time
    nombre: str
    ciudad: str
    pais: str
    
