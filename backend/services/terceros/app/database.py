from app import config
from app.models import Alimentacion, Entrenador, Mototaller
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


def solicitar_servicio_entrenador(entrenador: Entrenador):
    session = create_session()
    session.add(entrenador)
    session.commit()
    session.close()
    return entrenador


def solicitar_servicio_mototaller(mototaller: Mototaller):
    session = create_session()
    session.add(mototaller)
    session.commit()
    session.close()
    return mototaller


def consultar_servicio_alimentacion():
    session = create_session()
    statement = select(Alimentacion)
    results = session.exec(statement)
    servicios_alimentacion = results.all()
    return servicios_alimentacion


def consultar_servicio_entrenador():
    session = create_session()
    statement = select(Entrenador)
    results = session.exec(statement)
    sesion_entrenador = results.all()
    return sesion_entrenador


def consultar_servicio_entrenador_usuario(userid: str):
    session = create_session()
    statement = select(Entrenador).where(Entrenador.userId == userid)
    results = session.exec(statement)
    sesiones = results.all()
    return sesiones


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


def reset_servicio_entrenador():
    session = create_session()
    try:
        num_deleted = session.query(Entrenador).delete()
        session.commit()
        return num_deleted
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()
