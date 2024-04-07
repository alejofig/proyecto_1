# app/routes.py
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from app.models import Evento
from app.database import create_event, consultar_eventos

import json

router = APIRouter()


@router.get("/eventos")
async def consultar_enventos():
    eventos = consultar_eventos()
    return eventos


@router.post("/eventos")
async def crear_evento(event_data: Evento):
    evento = create_event(event_data)
    return evento