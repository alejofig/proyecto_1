# app/routes.py
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from app.auth import Auth0
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import HTMLResponse
import app.config as config
from app.database import create_user
from app.models import User

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f'https://{config.AUTH0_DOMAIN}/oauth/token')

@router.get("/login/")
async def login_page():
    login_url = f'https://{config.AUTH0_DOMAIN}/authorize' \
                f'?audience=https://{config.AUTH0_DOMAIN}/api/v2/' \
                '&response_type=code' \
                f'&client_id={config.AUTH0_CLIENT_ID}' \
                f'&redirect_uri={config.REDIRECT_URI}'
    return HTMLResponse(f'<a href="{login_url}">Log in with Auth0</a>')

@router.get("/callback/")
async def callback(code: str):
    try:
        token = Auth0.exchange_code_for_token(code)
        # Almacena el token en una cookie o en el almacenamiento de sesión
        return {"token": token}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/protected/")
async def protected_route(token: str = Depends(oauth2_scheme)):
    try:
        user = Auth0.get_current_user(token)
        print(user)
        return {"message": "Ruta protegida, solo para usuarios autenticados"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=401, detail="No se pudo validar las credenciales")


@router.post("/register/")  # Deshabilitar la generación automática del modelo de respuesta
async def register_user(user_data: User):
    response = Auth0.register_user(user_data.email, user_data.password)
    user_data.auth0_id = response["user_id"]
    create_user(user_data)
    return {"message": "User registered successfully"}