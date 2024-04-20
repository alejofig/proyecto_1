
from fastapi import FastAPI
from app.routes import router as entrenamiento_router

app = FastAPI()

app.include_router(entrenamiento_router)
