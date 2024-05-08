from app import config
from app.models import Indicador
from sqlmodel import Session, create_engine, SQLModel, select

SQLALCHEMY_DATABASE_URL = f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SQLModel.metadata.create_all(engine)


def create_session():
    session = Session(engine)
    return session


def crear_nuevo_indicador(indicador: Indicador):
    session = create_session()
    session.add(indicador)
    session.commit()
    session.close()
    return indicador


def consultar_indicadores():
    session = create_session()
    statement = select(Indicador)
    results = session.exec(statement)
    indicadores = results.all()
    return indicadores


def reset_total_indicadores():
    session = create_session()
    try:
        num_deleted = session.query(Indicador).delete()
        session.commit()
        return num_deleted
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()
