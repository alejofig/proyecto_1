from app.database import (solicitar_servicio_alimentacion, consultar_servicios_alimentacion, reset_servicios_alimentacion, solicitar_servicio_mototaller,
                          solicitar_sesion_entrenador, consultar_sesion_entrenador, reset_sesion_entrenador)
from app.models import Alimentacion, Entrenador, Mototaller
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health():
    return {"status": "ok"}


## Servicio de alimentacion
@router.post("/solicitar_alimentacion")
async def solicitar_alimentacion(alimentacion: Alimentacion):
    alimentacion = solicitar_servicio_alimentacion(alimentacion)
    return {"message": "Servicio de alimentación generado con éxito"}


@router.get("/servicios_alimentacion")
async def obtener_alimentacion():
    servicios_alimentacion = consultar_servicios_alimentacion()
    return servicios_alimentacion

@router.post("/solicitar_mototaller")
async def solicitar_mototaller(mototaller: Mototaller):
    mototaller = solicitar_servicio_mototaller(mototaller)
    return {"message": "Servicio de mototaller generado con éxito"}

@router.post("/reset_alimentacion")
async def reset_alimentacion():
    num_total = reset_servicios_alimentacion()
    return num_total


## Sesión de entrenamiento
@router.post("/sesion_entrenador")
async def sesion_entrenador(entrenador: Entrenador):
    entrenador = solicitar_sesion_entrenador(entrenador)
    return {"message": "Servicio de sesión con el entrenador generado con éxito"}


@router.get("/sesiones_entrenador")
async def obtener_sesion_entrenador():
    sesiones_entrenador = consultar_sesion_entrenador()
    return sesiones_entrenador


@router.post("/reset_entrenador")
async def reset_entrenador():
    num_total = reset_sesion_entrenador()
    return num_total
