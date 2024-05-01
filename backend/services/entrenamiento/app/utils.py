from app.models import RutinaAlimenticia, RutinaDescanso


def calcular_rutina_alimenticia(calorías_activas: float) -> RutinaAlimenticia:
    carboidratos = calorías_activas * 0.5 / 4  # asumiendo que los carboidratos tienen 4 calorías por gramo
    proteinas = calorías_activas * 0.3 / 4    # asumiendo que las proteínas tienen 4 calorías por gramo
    grasas = calorías_activas * 0.2 / 9       # asumiendo que las grasas tienen 9 calorías por gramo
    return RutinaAlimenticia(carboidratos=carboidratos, proteinas=proteinas, grasas=grasas)


def calcular_rutina_descanso(duracion: int) -> RutinaDescanso:

    minutos_sueno = 480 
    minutos_meditacion = 60  
    minutos_relajacion = 30

    if duracion > 30:  
        minutos_sueno += 60  
        minutos_meditacion += 30
        minutos_relajacion += 15       

    else:
        minutos_sueno += 30  
        minutos_meditacion += 15
        minutos_relajacion += 5  

    return RutinaDescanso(minutos_sueno=minutos_sueno, minutos_meditacion=minutos_meditacion, minutos_relajacion=minutos_relajacion)
