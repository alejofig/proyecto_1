from app import config
from app.models import Alimentacion
from sqlmodel import Session, create_engine, SQLModel, select

SQLALCHEMY_DATABASE_URL = f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SQLModel.metadata.create_all(engine)


def create_session():
    session = Session(engine)
    return session


def solicitar_servicio_alimentacion(alimentacion: Alimentacion):
    session = create_session()
    session.add(alimentacion)
    session.commit()
    session.close()
    return alimentacion


def consultar_servicios_alimentacion():
    session = create_session()
    statement = select(Alimentacion)
    results = session.exec(statement)
    servicios_alimentacion = results.all()
    return servicios_alimentacion


def reset_servicios_alimentacion():
    session = create_session()
    try:
        num_deleted = session.query(Alimentacion).delete()
        session.commit()
        return num_deleted
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()
