from typing import Optional

from sqlmodel import Field, SQLModel


class Indicador(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    userId: str
    nombreIndicador: str
    deporte: str
    sensor: str
    unidadMedida: str
    calculoRealizar: str
    detallesAdicionales: str
