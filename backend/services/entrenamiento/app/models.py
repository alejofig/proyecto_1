from sqlmodel import Field, SQLModel
from datetime import datetime, date
from typing import Optional

class Entrenamiento(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int 
    sport_type: str  # Tipo de deporte: 'atletismo' o 'ciclismo'
    duration: str
    fecha: date
    calories_active: int = 0
    total_calories: int = 0
    fcm: int = 0

