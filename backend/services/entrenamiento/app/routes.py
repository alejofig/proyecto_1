from fastapi import APIRouter,HTTPException
from app.models import Entrenamiento
from app.database import create_entrenamiento,obtener_entrenamientos,obtener_estadisticas
from app.utils import calcular_rutina_alimenticia, calcular_rutina_descanso

router = APIRouter()

@router.get("/")
async def health():
    return {"status": "ok"}

@router.post("/entrenamiento")
async def crear_entrenamiento(event_data: Entrenamiento ):
    print(event_data)
    entrenamiento = create_entrenamiento(event_data)
    return entrenamiento

@router.get("/entrenamientos")
async def obtener_todos():
    entrenamientos = obtener_entrenamientos()
    return entrenamientos

@router.get("/estadisticas/{user_id}")
async def estadisticas(user_id: int):
    return obtener_estadisticas(user_id)


@router.post("/rutinas")
async def calcular_rutinas(event_data: Entrenamiento):

    rutina_alimenticia = calcular_rutina_alimenticia(event_data.calories_active)
    rutina_descanso = calcular_rutina_descanso(event_data.duration)
    return {
        "rutina_alimenticia": rutina_alimenticia,
        "rutina_descanso": rutina_descanso
    }



