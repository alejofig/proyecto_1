from app.database import (crear_servicio_alimentacion, consultar_servicio_alimentacion, reset_servicio_alimentacion,
                          crear_sesion_entrenador, consultar_sesion_entrenador, reset_sesion_entrenador,
                          solicitar_servicio_mototaller)
from app.models import Alimentacion, Entrenador, Mototaller
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health():
    return {"status": "ok"}


@router.post("/crear_servicio_alimentacion")
async def crear_servicio_alimentacion(alimentacion: Alimentacion):
    alimentacion = crear_servicio_alimentacion(alimentacion)
    return {"message": "Servicio de alimentación generado con éxito"}


@router.get("/consultar_servicio_alimentacion")
async def consultar_servicio_alimentacion():
    servicios_alimentacion = consultar_servicio_alimentacion()
    return servicios_alimentacion


@router.post("/reset_servicio_alimentacion")
async def reset_servicio_alimentacion():
    num_total = reset_servicio_alimentacion()
    return num_total


@router.post("/crear_sesion_entrenador")
async def crear_sesion_entrenador(entrenador: Entrenador):
    entrenador = crear_sesion_entrenador(entrenador)
    return {"message": "Servicio de sesión con el entrenador generado con éxito"}


@router.get("/consultar_sesion_entrenador")
async def consultar_sesion_entrenador():
    sesiones_entrenador = consultar_sesion_entrenador()
    return sesiones_entrenador


@router.post("/reset_sesion_entrenador")
async def reset_sesion_entrenador():
    num_total = reset_sesion_entrenador()
    return num_total


@router.post("/solicitar_mototaller")
async def solicitar_mototaller(mototaller: Mototaller):
    mototaller = solicitar_servicio_mototaller(mototaller)
    return {"message": "Servicio de mototaller generado con éxito"}
