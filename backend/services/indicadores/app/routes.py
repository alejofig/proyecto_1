from app.database import (crear_nuevo_indicador, consultar_indicadores, cambiar_indicador, reset_total_indicadores)
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


@router.get("/consultar_indicador")
async def consultar_indicador():
    indicadores = consultar_indicadores()
    return indicadores


@router.put("/actualizar_indicador/{nombre_indicador}/{visibilidad}")
async def actualizar_indicador(nombre_indicador: str, visibilidad: bool, indicador: Indicador):
    indicador = cambiar_indicador(nombre_indicador, visibilidad, indicador)
    return {"message": "Indicador modificado con éxito"}


@router.post("/reset_indicadores")
async def reset_indicadores():
    num_total = reset_total_indicadores()
    return num_total
