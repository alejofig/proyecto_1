from typing import List, Optional

from pydantic import BaseModel


class User(BaseModel):
    username: str
    password: str
    email: str
    nombre: str
    apellido: str
    tipo_documentacion: str
    numero_identificacion: str
    genero: str
    edad: int
    peso: int
    pais_nacimiento: str
    ciudad_nacimiento: str
    pais_residencia: str
    ciudad_residencia: str
    antiguedad_residencia: int
    altura: int
    tipo_plan: str
    deportes: Optional[List[str]]

    # Needed for Column(JSON)
    class Config:
        arbitrary_types_allowed = True


class Plan(BaseModel):
    deporte: str
    nombre: str
    usuario: str
    cantidadEntrenamientos: str
    distanciaPorEntrenamientos: str
    fechas: str

class Mototaller(BaseModel):
    userId: str
    fechaSesion: str
    horaSesion: str
    comentariosAdicionales: str