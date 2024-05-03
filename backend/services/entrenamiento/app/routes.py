from fastapi import APIRouter,HTTPException
from app.models import Entrenamiento
from app.database import create_entrenamiento,obtener_entrenamientos,obtener_estadisticas, obtener_ultimo_entrenamiento
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

@router.get("/ultimo_entrenamiento/{user_id}")
async def obtener_ultimo_entrenamiento_por_usuario(user_id: int):
    entrenamiento = obtener_ultimo_entrenamiento(user_id)
    return entrenamiento


@router.post("/rutina_alimentacion")
async def calcular_rutina_alimentacion(event_data: Entrenamiento):

    rutina_alimenticia = calcular_rutina_alimenticia(event_data.calories_active)

    return {
        "rutina_alimenticia": rutina_alimenticia
    }

@router.post("/rutina_descanso")
async def calcular_rutina_descanso(event_data: Entrenamiento):

    rutina_descanso = calcular_rutina_descanso(event_data.duration)
    return {
        "rutina_descanso": rutina_descanso
    }



