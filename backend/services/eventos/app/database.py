from app.models import Evento, create_session
from sqlmodel import select


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
    return eventos
