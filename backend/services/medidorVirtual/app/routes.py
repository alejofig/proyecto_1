from fastapi import APIRouter, HTTPException
from app.models import Entrenamiento
from app.controler import calcular_ftp, calcular_vo2max

router = APIRouter()


@router.post("/calcular-indicadores/")
async def calcular_indicadores(event_data: Entrenamiento ):
    try:
        print("{{event_data}} ", event_data)
        ftp = calcular_ftp(event_data)
        vo2max = calcular_vo2max(event_data)
        print("{{FTP}}{{vo2max}} ", ftp, vo2max)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"ftp": ftp, "vo2Max": vo2max}
    