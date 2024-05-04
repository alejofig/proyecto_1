from app.database import create_event, consultar_eventos, consultar_eventos_pais, consultar_eventos_pais_limit, consultar_notificaciones_relevantes, create_notificacion
from app.models import Evento, Notificacion
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

@router.get("/notificacion/{pais}")
async def consultar_notificaciones(pais: str):
    notificaciones = consultar_notificaciones_relevantes(pais)
    return notificaciones

@router.post("/notificacion")
async def consultar_notificaciones(noti_data: Notificacion):
    notificacion = create_notificacion(noti_data)
    return notificacion