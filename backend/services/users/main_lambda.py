from app.models import User
import json
from app.database import create_user
from app.utils import encrypt_data
from app.auth import Auth0

def run(event, context):
    # Procesa el evento de SQS
    for record in event['Records']:
        message_body = record['body']        
        try:
            message_data = json.loads(message_body)
            user = User(**message_data) 
            response = Auth0.register_user(user.email, user.password)
            user.password = encrypt_data(user.password)
            user.auth0_id = response["user_id"]         
            create_user(user)
            print("Enviando notificación al API Gateway...")
            #requests.post(f"{API_GATEWAY_ENDPOINT}/notifications", headers={"X-API-KEY": "your_api_key"}, json={"username": username})
        except json.JSONDecodeError as e:
            print("Error al decodificar el mensaje JSON:", e)
            continue  
    return {
        "statusCode": 200,
        "body": "Procesamiento de eventos de SQS completado"
    }


if __name__ == "__main__":
    # Simula un evento SQS con un solo mensaje que contiene todos los datos
    sqs_event = {
        "Records": [
            {
                "body": "{\"password\":\"135.Simetrik24@\",\"nombre\":\"a\",\"apellido\":\"a\",\"username\":\"ggg@yahoo.com\",\"tipo_documentacion\":\"PASAPORTE\",\"numero_identificacion\":\"1\",\"email\":\"ggg@yahoo.com\",\"edad\":1,\"peso\":1,\"altura\":1,\"genero\":\"Masculino\",\"pais_nacimiento\":\"a\",\"ciudad_nacimiento\":\"g\",\"pais_residencia\":\"f\",\"ciudad_residencia\":\"f\",\"antiguedad_residencia\":1,\"tipo_plan\":\"GRATUITO\",\"deportes\":[\"Natación\",\"Running\",\"Cycling\"]}"
            }
        ]
    }
    run(event=sqs_event, context=None)