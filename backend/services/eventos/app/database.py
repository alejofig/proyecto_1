from app import config
from app.models import Evento, Notificacion
from sqlmodel import Session, create_engine, SQLModel, select, func

SQLALCHEMY_DATABASE_URL = f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SQLModel.metadata.create_all(engine)


def create_session():
    session = Session(engine)
    return session


def create_event(event: Evento):
    session = create_session()
    session.add(event)
    session.commit()
    session.close()
    return event


def consultar_eventos():
    session = create_session()
    statement = select(Evento)
    results = session.exec(statement)
    eventos = results.all()
    session.close()
    return eventos


def consultar_eventos_pais(pais):
    session = create_session()
    statement = select(Evento).where(func.lower(Evento.pais) == func.lower(pais))  # f"SELECT * FROM evento WHERE LOWER(pais) = LOWER('{pais}');"
    results = session.exec(statement)
    eventos = results.all()
    session.close()
    return eventos


def consultar_eventos_pais_limit(pais, rows):
    session = create_session()
    statement = select(Evento).where(func.lower(Evento.pais) == func.lower(pais)).limit(rows)  # f"SELECT * FROM evento WHERE LOWER(pais) = LOWER('{pais}');"
    results = session.exec(statement)
    eventos = results.all()
    session.close()
    return eventos


def consultar_notificaciones_relevantes(pais):
    session = create_session()
    statement = select(Notificacion).where((Notificacion.fecha == func.current_date()) & (func.lower(Notificacion.pais) == func.lower(pais)))
    results = session.exec(statement)
    notificaciones = results.all()
    session.close()
    return notificaciones

def create_notificacion(notificacion: Notificacion):
    session = create_session()
    session.add(notificacion)
    session.commit()
    session.close()
    return notificacion
