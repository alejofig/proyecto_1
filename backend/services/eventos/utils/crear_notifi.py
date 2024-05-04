import requests
from datetime import datetime, timedelta
import random

# URL de la API donde se crearán los eventos
api_url = "https://eventos.uniandes-sports.com/notificacion"

# Datos base para los eventos
nombres_eventos = ["Situacion de Robo en ", "Lluvias intensas en ", "Calles Cerradas en ", "Marchas en ", "Corte de Energía en "]
paises_ciudades = [{"Argentina":["Buenos Aires", "Córdoba", "Rosario"]},
                   {"Brasil":["Sao Paulo", "Rio de Janeiro", "Salvador"]},
                   {"Chile":["Santiago", "Valparaíso", "Concepción"]},
                   {"Uruguay":["Montevideo", "Punta del Este", "Colonia"]},
                   {"Colombia":["Bogotá", "Medellín", "Cali"]}]


# Crear y enviar 10 eventos
for j in range(10):
    for i in range(3):
        # Generar fecha y hora para el evento
        hours_to_add = random.randint(0, 24)
        event_date = datetime.now() + timedelta(hours=hours_to_add*(j-1))
        event_time = event_date.strftime("%H:%M:%S")
        pais_dict = random.choice(paises_ciudades)
        pais = list(pais_dict.keys())[0]
        ciudad = random.choice(pais_dict[pais])
        nombre = f"{random.choice(nombres_eventos)} {ciudad}"

        # Completar los datos del evento
        event_data = {
            "nombre": nombre,
            "fecha": event_date.strftime("%Y-%m-%d"),
            "hora": event_time,
            "pais": pais,
            "ciudad": ciudad
        }

        # Enviar la solicitud POST a la API
        response = requests.post(api_url, json=event_data)

        # Imprimir la respuesta de la API
        print(f"Evento {i+1}: {response.status_code}")
        if response.status_code != 200:
            print(f"Error al crear el evento {i+1}: {response.text}")

