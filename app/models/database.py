import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .router import db

load_dotenv()


class Database:
    def __init__(self, db_url):
        self.engine = create_engine(db_url)
        self.Session = sessionmaker(bind=self.engine)
        try:
            self.create_tables()
        except:
            pass

    def create_tables(self):
        db.metadata.create_all(self.engine)

    def get_session(self):
        return self.Session()


# Configuración de la base de datos
DB_USER = os.getenv("DB_USER", "example")
DB_PASSWORD = os.getenv("DB_PASSWORD", "example")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", 5003)
DB_NAME = os.getenv("DB_NAME", "example")

DB_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

database = Database(DB_URL)
