from fastapi import APIRouter
from app.models import Entrenamiento
from app.database import create_entrenamiento,obtener_entrenamientos,obtener_estadisticas

router = APIRouter()

@router.get("/")
async def health():
    return {"status": "ok"}

@router.post("/entrenamiento")
async def crear_entrenamiento(event_data: Entrenamiento ):
    entrenamiento = create_entrenamiento(event_data)
    return entrenamiento

@router.get("/entrenamientos")
async def obtener_todos():
    entrenamientos = obtener_entrenamientos()
    return entrenamientos

@router.get("/estadisticas/{user_id}")
async def estadisticas(user_id: int):
    return obtener_estadisticas(user_id)