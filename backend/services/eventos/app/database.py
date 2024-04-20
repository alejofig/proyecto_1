from app.models import Evento, create_session
from sqlmodel import select, func



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
    statement = select(Evento).where(func.lower(Evento.pais) == func.lower(pais)) #f"SELECT * FROM evento WHERE LOWER(pais) = LOWER('{pais}');"
    results = session.exec(statement)
    eventos = results.all()
    session.close()
    return eventos

def consultar_eventos_pais_limit(pais, rows):
    session = create_session()
    statement = select(Evento).where(func.lower(Evento.pais) == func.lower(pais)).limit(rows) #f"SELECT * FROM evento WHERE LOWER(pais) = LOWER('{pais}');"
    results = session.exec(statement)
    eventos = results.all()
    session.close()
    return eventos
