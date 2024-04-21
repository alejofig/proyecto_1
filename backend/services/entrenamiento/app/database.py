import calendar
from datetime import datetime, timedelta
from sqlmodel import Session, create_engine, SQLModel
from app import config
from app.models import Entrenamiento
from sqlalchemy import func
SQLALCHEMY_DATABASE_URL = f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_NAME}"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SQLModel.metadata.create_all(engine)

def create_session():
    session = Session(engine)
    return session

def create_entrenamiento(entrenamiento: Entrenamiento):
    session = create_session()
    session.add(entrenamiento)
    session.commit()
    session.refresh(entrenamiento)
    session.close()
    return entrenamiento

def obtener_entrenamientos():
    session = create_session()
    entrenamientos = session.query(Entrenamiento).all()
    session.close()
    return entrenamientos

def obtener_estadisticas(user_id: int):
    session = create_session()
    now = datetime.now()
    fecha_inicio = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    fecha_fin = fecha_inicio.replace(day=calendar.monthrange(now.year, now.month)[1], hour=23, minute=59, second=59, microsecond=999999)

    total_trainnings = session.query(Entrenamiento).filter(
        Entrenamiento.user_id == user_id,
        Entrenamiento.fecha.between(fecha_inicio, fecha_fin)
    ).count()

    total_calories = session.query(func.sum(Entrenamiento.total_calories)).filter(
        Entrenamiento.user_id == user_id,
        Entrenamiento.fecha.between(fecha_inicio, fecha_fin)
    ).scalar()

    total_distance = session.query(func.sum(Entrenamiento.distance)).filter(
        Entrenamiento.user_id == user_id,
        Entrenamiento.fecha.between(fecha_inicio, fecha_fin)
    ).scalar()

    max_time_training = session.query(func.max(Entrenamiento.duration)).filter(
        Entrenamiento.user_id == user_id,
        Entrenamiento.fecha.between(fecha_inicio, fecha_fin)
    ).scalar()

    max_calories_training = session.query(func.max(Entrenamiento.total_calories)).filter(
        Entrenamiento.user_id == user_id,
        Entrenamiento.fecha.between(fecha_inicio, fecha_fin)
    ).scalar()

    max_distance_training = session.query(func.max(Entrenamiento.distance)).filter(
        Entrenamiento.user_id == user_id,
        Entrenamiento.fecha.between(fecha_inicio, fecha_fin)
    ).scalar()

    mean_time_training = session.query(func.avg(Entrenamiento.duration)).filter(
        Entrenamiento.user_id == user_id,
        Entrenamiento.fecha.between(fecha_inicio, fecha_fin)
    ).scalar()


    return {
        "total_trainnings_month": total_trainnings,
        "total_calorias_month": total_calories,
        "total_distancia_month": total_distance,
        "max_time_training_month": max_time_training,
        "max_calories_training_month": max_calories_training,
        "max_distance_training_month": max_distance_training,
        "mean_time_training_month": mean_time_training
    }