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
