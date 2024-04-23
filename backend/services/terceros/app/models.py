from datetime import date, time
from typing import Optional

from sqlmodel import Field, SQLModel


class Alimentacion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    userId: str
    proveedor: str
    proposito: str
    tipoAlimentacion: str
    modoRecibir: str
    numeroContacto: str
    direccionActual: str
    ciudadActual: str
    paisActual: str


class Mototaller(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    userId: str
    fechaSesion: date
    horaSesion: time
    comentariosAdicionales: str


class Entrenador(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    userId: str
    proveedor: str
    tipoEntrenamiento: str
    fechaSesion: str
    horaSesion: str
    comentarios: str
