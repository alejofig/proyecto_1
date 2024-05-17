from functools import wraps
import json
from auth import Auth0
from flask import jsonify, request
import logging
import config
import requests
from dotenv import load_dotenv
import os
import boto3
import random
from models import Entrenamiento
from datetime import datetime
import requests
import urllib.parse

load_dotenv()
def protected_route(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        try:
            user_id = Auth0.get_current_user()
            user =Auth0.get_user_by_id(user_id)
            return f(user, *args, **kwargs)
        except Exception as e:
            print(e)
            return jsonify({"detail": "No se pudo validar las credenciales"}), 401
    return decorated_function

def protected_route_movil(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            authorization = request.headers.get('Authorization')
            logging.debug(f"token recibido {authorization}") 
            
            user = requests.get(f"https://{config.AUTH0_DOMAIN}/userinfo", 
                                headers={"Authorization": f"{authorization}"}) 
                
            return f(user.json(), *args, **kwargs)
        except Exception as e:
            print(e)
            return jsonify({"detail": "No se pudo validar las credenciales"}), 401    

    return decorated_function

def send_email(asunto, cuerpo, remitente, destinatario):
    sqs = boto3.client('sqs', region_name='us-east-1')
    mensaje = {
        "asunto": asunto,
        "cuerpo": cuerpo,
        "remitente": remitente,
        "destinatario": destinatario
    }
    queue_url = os.getenv('SQS_URL_NOTIFICATIONS')
    message_url = json.dumps(mensaje)
    sqs.send_message(
        QueueUrl=queue_url,
        MessageBody=message_url
    )


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

def send_to_strava(json_data):
    try:
        response_token = requests.get(f"{config.URL_USERS}/token_strava/{json_data['user_id']}")
        url = "https://www.strava.com/api/v3/activities"
        payload_dict = {
            'name': f'Entreno {json_data["sport_type"]} Sport App',
            "type": json_data["sport_type"],
            "sport_type": json_data["sport_type"],
            "elapsed_time": json_data["duration"],
            "start_date_local":  json_data["fecha"],
            "distance": json_data["distance"],
            "start": json_data["fecha"],
        }
        payload_encoded = urllib.parse.urlencode(payload_dict)
        headers = {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': f'Bearer {response_token.json()["token"]["access_token"]}'
        }
        response = requests.request("POST", url, headers=headers, data=payload_encoded)
        print(response.text)
        if response.status_code == 201:
            return jsonify({"detail": "Entrenamiento enviado a Strava"}), 201
        else:
            return jsonify({"detail": "No se pudo enviar el entrenamiento a Strava"}), 500
    except Exception as e:
        print(e)
        return jsonify({"detail": "No se pudo enviar el entrenamiento a Strava"}), 500


def calcularFisiologico(edad: int, altura: int, peso: int) -> int:
    # Validar edad
    if edad <= 30:
        e = 1
    elif 31 < edad <= 40:
        e = 2
    elif 41 < edad <= 50:
        e = 3
    else:
        e = 4

    # Validar altura
    if altura <= 160:
        a = 1
    elif 161 < altura <= 170:
        a = 2
    elif 171 < altura <= 180:
        a = 3
    else:
        a = 4

    # Validar peso
    if peso <= 50:
        p = 1
    elif 51 < peso <= 60:
        p = 2
    elif 61 < peso <= 70:
        p = 3
    else:
        p = 4

    total = e + a + p
    return total
