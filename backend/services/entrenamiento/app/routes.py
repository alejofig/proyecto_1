from fastapi import APIRouter
from app.models import Entrenamiento
from app.database import create_entrenamiento

router = APIRouter()

@router.post("/entrenamiento")
async def crear_entrenamiento(event_data: Entrenamiento ):
    
    entrenamiento = create_entrenamiento(event_data)
    return entrenamiento
    