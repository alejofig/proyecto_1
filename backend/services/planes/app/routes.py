from app.database import create_event, consultar_eventos
from app.models import Evento
from fastapi import APIRouter

router = APIRouter()


@router.get("/eventos")
async def consultar_enventos():
    eventos = consultar_eventos()
    return eventos


@router.post("/eventos")
async def crear_evento(event_data: Evento):
    evento = create_event(event_data)
    return evento
