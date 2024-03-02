from app.models.database import database
from app.models.router import Usuario
import json
import requests 
import os
from dotenv import load_dotenv

load_dotenv()
API_GATEWAY_ENDPOINT = os.getenv("API_GATEWAY_ENDPOINT")

def run(event, context):
    # Procesa el evento de SQS
    for record in event['Records']:
        message_body = record['body']        
        try:
            message_data = json.loads(message_body)
            username = message_data.get('username')
            password = message_data.get('password')
            session = database.get_session()
            new_user = Usuario(username=username)
            new_user.set_password(password)
            session.add(new_user)
            session.commit()            
            print("Usuario creado:")
            print("Usuario:", username)
            print("Enviando notificación al API Gateway...")
            #requests.post(f"{API_GATEWAY_ENDPOINT}/notifications", headers={"X-API-KEY": "your_api_key"}, json={"username": username})
        except json.JSONDecodeError as e:
            print("Error al decodificar el mensaje JSON:", e)
            continue  # Continúa con el siguiente mensaje
    return {
        "statusCode": 200,
        "body": "Procesamiento de eventos de SQS completado"
    }


if __name__ == "__main__": 
# Simula un evento SQS con múltiples mensajes en el formato especificado
    sqs_event = {
        "Records": [
            {
                "body": "{\"username\":\"alejofig11\",\"password\":\"alejo1234\"}"
            }
        ]
    }
    run(event=sqs_event, context=None)
