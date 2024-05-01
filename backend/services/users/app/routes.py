# app/routes.py
from datetime import datetime, timedelta
from app.auth import Auth0
from fastapi import APIRouter,HTTPException
from fastapi.responses import JSONResponse, RedirectResponse
from app.database import get_token_info, get_user_by_email, update_token_strava
import app.config as config
from urllib.parse import urlencode
import requests
router = APIRouter()

@router.get("/")
async def health():
    return {"status": "ok"}

@router.get("/user/{user_email}")  
async def get_user(user_email: str):
    user = get_user_by_email(user_email)
    if user is None:
        return JSONResponse(status_code=404, content={"detail": "User not found"})
    else:
        return user.dict()
    
@router.post("/token_strava/")
async def refresh_token(new_token: dict ):    
    update_token_strava(new_token)
    return {"status": "ok"}