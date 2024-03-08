from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import declarative_base
from werkzeug.security import generate_password_hash, check_password_hash

db = declarative_base()


class Usuario(db):
    __tablename__ = 'usuarios'

    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=True)
    email = Column(String(100), nullable=True, unique=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)