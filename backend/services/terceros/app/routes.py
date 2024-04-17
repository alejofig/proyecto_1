from app.database import solicitar_servicio_alimentacion, consultar_servicios_alimentacion, reset_servicios_alimentacion
from app.models import Alimentacion
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health():
    return {"status": "ok"}


@router.post("/solicitar_alimentacion")
async def solicitar_alimentacion(alimentacion: Alimentacion):
    alimentacion = solicitar_servicio_alimentacion(alimentacion)
    return {"message": "Servicio de alimentación generado con éxito"}


@router.get("/servicios_alimentacion")
async def obtener_alimentacion():
    servicios_alimentacion = consultar_servicios_alimentacion()
    return servicios_alimentacion


@router.post("/reset")
async def reset_alimentacion():
    num_total = reset_servicios_alimentacion()
    return num_total
