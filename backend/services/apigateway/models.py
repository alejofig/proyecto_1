import random
from typing import List, Optional
from sqlmodel import Field, SQLModel
from pydantic import BaseModel
from datetime import datetime
from enum import Enum

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

class SportType(str, Enum):
    Run = "Run"
    Ride = "Ride"
    Swim = "Swim"

class Entrenamiento(BaseModel):
    user_id: Optional[int] = None
    sport_type: Optional[SportType] = None
    fecha: Optional[datetime] = None
    calories_active: Optional[float] = 0
    total_calories: Optional[float] = 0
    distance: Optional[int] =  Field(default_factory=lambda: round(random.uniform(10, 100)))
    duration: Optional[int] = 0
    
class EntrenamientoIndicadores(BaseModel):
    duration: str
    fcm: int
    height: int
    edad: int
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
