from typing import List, Optional

from pydantic import BaseModel
from datetime import date

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

class Entrenamiento(BaseModel):
    id: Optional[int] = None
    user_id: int 
    sport_type: str  #atletismo o ciclismo
    duration: str
    fecha: date
    calories_active: float = 0.0
    total_calories: float = 0.0
    fcm: int = 0
    height: int = 0
    edad: int = 0
    genero: str

class Mototaller(BaseModel):
    fechaSesion: str
    horaSesion: str
    comentariosAdicionales: str


class Alimentacion(BaseModel):
    proveedor: str
    proposito: str
    tipoAlimentacion: str
    modoRecibir: str
    numeroContacto: int
    direccionActual: str
    ciudadActual: str
    paisActual: str


class Entrenador(BaseModel):
    proveedor: str
    tipoEntrenamiento: str
    fechaSesion: str
    horaSesion: str
    comentarios: str
