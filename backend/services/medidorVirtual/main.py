
from fastapi import FastAPI
from app.routes import router as medidor_router

app = FastAPI()

app.include_router(medidor_router)
