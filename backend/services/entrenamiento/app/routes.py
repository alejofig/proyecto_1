from fastapi import FastAPI, HTTPException, Depends
from sqlmodel import Session
from datetime import datetime, date
from database import engine
from models import Entrenamiento


app = FastAPI()

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()

@app.post("/finalizar_entrenamiento/")
async def finalizar_entrenamiento(training_id: int, user_id: int, sport_type: str, start_time: datetime, end_time: datetime, duration: datetime, fecha: date, calories_active: int, power: int, total_calories: int, heart_rate: int, db: Session = Depends(get_db)):
    
    
     # Calcular la duración del entrenamiento
    duration = (end_time - start_time).total_seconds() / 60  # Duración en minutos

    # Crear una nueva instancia de entrenamiento
    entrenamiento = Entrenamiento(user_id=user_id, sport_type=sport_type, start_time=start_time, end_time=end_time, fecha=fecha, duration=duration, calories_active=calories_active, power=power, total_calories=total_calories, heart_rate=heart_rate)
    
    db.add(entrenamiento)
    db.commit()
    db.refresh(entrenamiento)  # Actualizar la instancia de training con los datos de la base de datos, como el ID asignado

    return {
        "message": "Entrenamiento finalizado",
        "training_id": entrenamiento.id,  # Cambiado de training.id a entrenamiento.id
        "user_id": entrenamiento.user_id,
        "sport_type": entrenamiento.sport_type,
        "start_time": entrenamiento.start_time,
        "end_time": entrenamiento.end_time,
        "fecha": entrenamiento.fecha,
        "duration": entrenamiento.duration,
        "calories_active": entrenamiento.calories_active,
        "power": entrenamiento.power,
        "total_calories": entrenamiento.total_calories,
        "heart_rate": entrenamiento.heart_rate
    }