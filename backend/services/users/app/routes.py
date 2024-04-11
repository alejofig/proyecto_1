# app/routes.py
from fastapi import APIRouter
from app.auth import Auth0
from fastapi.responses import JSONResponse
import app.config as config
from app.database import get_user_by_email
from app.models import User
import boto3

router = APIRouter()
router.get("/")
async def health():
    return {"status": "ok"}

@router.get("/user/{user_email}")  
async def get_user(user_email: str):
    user = get_user_by_email(user_email)
    if user is None:
        return JSONResponse(status_code=404, content={"detail": "User not found"})
    else:
        return {"message": user}