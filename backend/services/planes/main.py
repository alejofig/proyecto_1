from fastapi import FastAPI

from app.routes import router as api_router
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:4200",
    "https://planes.uniandes-sports.com"
]

app = FastAPI()

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)