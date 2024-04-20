import os
from dotenv import load_dotenv

load_dotenv()
DB_ENTRENAMIENTO = os.getenv("DB_ENTRENAMIENTO")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "db")
DB_NAME = os.getenv("DB_NAME")
DB_PORT = os.getenv("DB_PORT", "5432")
