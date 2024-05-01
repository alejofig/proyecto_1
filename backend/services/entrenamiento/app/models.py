import random
from sqlmodel import Field, SQLModel
from datetime import date
from typing import Optional
from pydantic import BaseModel


class Entrenamiento(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int 
    sport_type: str  
    duration: int
    fecha: date
    calories_active: float = 0.0
    total_calories: float = 0.0
    fcm: int = 0
    distance: int =  Field(default_factory=lambda: round(random.uniform(10, 100)))


class RutinaAlimenticia(BaseModel):
    carboidratos: float
    proteinas: float
    grasas: float

class RutinaDescanso(BaseModel):
    minutos_sueno: int
    minutos_meditacion: int
    minutos_relajacion: int 