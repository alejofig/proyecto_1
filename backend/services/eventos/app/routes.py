# app/routes.py
from typing import List
from fastapi import APIRouter, HTTPException, Depends
import json

router = APIRouter()


@router.get("/eventos")
async def consultar_enventos():
    eventos = [
        {
        "fecha": "2024-04-10",
        "name": "Media Maratón Cali",
        "lugar" : "Zoológico, Cali"
        },
        {
        "fecha": "2024-04-13",
        "name": "La Maraton ETB",
        "lugar" : "ETB, Bogota"
        },
        {
        "fecha": "2024-04-25",
        "name": "Ruta por la paz",
        "lugar" : "Intercontinental, Cali"
        }       
    ]

    return json.dumps(eventos)
