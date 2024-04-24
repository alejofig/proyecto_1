from app.database import create_event, consultar_eventos, consultar_eventos_pais, consultar_eventos_pais_limit
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


@router.get("/eventos/{pais}")
async def consultar_enventos(pais: str):
    eventos = consultar_eventos_pais(pais)
    return eventos


@router.get("/eventos/{pais}/{rows}")
async def consultar_enventos(pais: str, rows: int):
    eventos = consultar_eventos_pais_limit(pais, rows)
    return eventos
