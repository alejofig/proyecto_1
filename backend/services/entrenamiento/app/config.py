import os
from dotenv import load_dotenv

load_dotenv()
DB_DB_ENTRENAMIENTO = os.getenv("DB_ENTRENAMIENTO","prueba")
DB_PASSWORD = os.getenv("DB_PASSWORD","prueba")
DB_HOST = os.getenv("DB_HOST","localhost")
DB_NAME = os.getenv("DB_NAME","prueba")
DB_PORT = os.getenv("DB_PORT","5435")
