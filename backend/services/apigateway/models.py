import random
from typing import List, Optional
from sqlmodel import Field, SQLModel
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
    user_id: Optional[int]
    sport_type: Optional[str]
    fecha: Optional[date]
    calories_active: Optional[float]
    total_calories: Optional[float]
    distance: int =  Field(default_factory=lambda: round(random.uniform(10, 100)))
    fcm: int = 0
    height: int = 0
    edad: int = 0
    


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
