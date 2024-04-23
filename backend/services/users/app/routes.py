# app/routes.py
from app.auth import Auth0
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.database import get_user_by_email

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