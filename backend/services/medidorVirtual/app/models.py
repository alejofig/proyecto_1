from pydantic import BaseModel
from datetime import date
from typing import Optional

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