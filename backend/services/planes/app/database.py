from app import config
from app.models import Plan
from sqlmodel import Session, create_engine, SQLModel

SQLALCHEMY_DATABASE_URL = f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SQLModel.metadata.create_all(engine)


def create_session():
    session = Session(engine)
    return session


def create_plan(plan: Plan):
    session = create_session()
    session.add(plan)
    session.commit()
    session.close()
    return plan
