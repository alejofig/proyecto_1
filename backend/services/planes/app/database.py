from app import config
from app.models import Plan
from sqlmodel import Session, create_engine, SQLModel, select

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


def consultar_planes():
    session = create_session()
    statement = select(Plan)
    results = session.exec(statement)
    planes = results.all()
    return planes


def consultar_planes_usuario(email: str):
    session = create_session()
    statement = select(Plan).where(Plan.usuario == email)
    results = session.exec(statement)
    planes = results.all()
    return planes


def reset_planes():
    session = create_session()
    try:
        num_deleted = session.query(Plan).delete()
        session.commit()
        return num_deleted
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()
