from app.database import (crear_nuevo_indicador, consultar_todos_indicadores, consultar_indicadores_user, cambiar_indicador, reset_total_indicadores)
from app.models import Indicador
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health():
    return {"status": "ok"}


@router.post("/crear_indicador")
async def crear_indicador(indicador: Indicador):
    indicador = crear_nuevo_indicador(indicador)
    return {"message": "Nuevo indicador ha sido creado con éxito"}


@router.get("/consultar_indicadores")
async def consultar_indicadores():
    indicadores = consultar_todos_indicadores()
    return indicadores


@router.get("/indicadores_atletismo/{userid}")
async def consultar_indicadores_usuario_atletismo(userid: str):
    deporte: str = 'Atletismo'
    indicadores_usuario = consultar_indicadores_user(userid, deporte)
    return indicadores_usuario


@router.get("/indicadores_ciclismo/{userid}")
async def consultar_indicadores_usuario_ciclismo(userid: str):
    deporte: str = 'Ciclismo'
    indicadores_usuario = consultar_indicadores_user(userid, deporte)
    return indicadores_usuario


@router.put("/actualizar_indicador")
async def actualizar_indicador(indicador: Indicador):
    indicador = cambiar_indicador(indicador)
    return {"message": "Indicador modificado con éxito"}


@router.post("/reset_indicadores")
async def reset_indicadores():
    num_total = reset_total_indicadores()
    return num_total
