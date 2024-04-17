from typing import Optional

from sqlmodel import Field, SQLModel


class Alimentacion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tipoAlimentacion: str
    numeroContacto: str
    paisActual: str
    ciudadActual: str
    direccionActual: str
