from app.models import Entrenamiento
from datetime import datetime
import random
 
def calcular_ftp(entrenamiento: Entrenamiento) -> float:
    velocidad_promedio = random.uniform(10.0, 33.0)
    ftp= (velocidad_promedio * 1.8) / (entrenamiento.height * 0.02) + 3.5 + (entrenamiento.fcm * 0.1)
    return round(ftp, 2)

def calcular_vo2max(entrenamiento: Entrenamiento) -> float:
    duration_in_minutes = convert_to_minutes(entrenamiento.duration)
    s = 1 if entrenamiento.genero == "Masculino" else 0
    vo2max = 132.6 - (0.17) - (0.39 * entrenamiento.edad) + (6.31 * s) - (3.27 * duration_in_minutes) - (0.156 * entrenamiento.fcm)
    return round(vo2max, 2)

def convert_to_minutes(time_str):
    time_obj = datetime.strptime(time_str, '%H:%M:%S')
    minutes = time_obj.hour * 60 + time_obj.minute + time_obj.second / 60
    return minutes
