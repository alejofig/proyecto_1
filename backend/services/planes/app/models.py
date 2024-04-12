from typing import Optional

from sqlmodel import Field, SQLModel


class Plan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    deporte: str
    nombre: str
    numeroEntrenamientosSemana: str
    objetivoDistanciaEntrenamiento: str
    fechas: str
