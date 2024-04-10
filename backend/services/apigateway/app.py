from functools import wraps
import os
import random
import config

import boto3
import requests
from flask import Flask, jsonify, request, json, redirect
from auth import Auth0
from werkzeug.exceptions import HTTPException
from models import User
from pydantic import ValidationError
from utils import protected_route

URL_USERS = os.getenv('USERS_PATH')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

app = Flask(__name__)

if __name__ == '__main__':
    app.run(debug=True)


# Endpoint para validar la salud del servicio
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK'}), 200


@app.route('/registrar-usuario', methods=['POST'])
def registrar_usuario():
    json_entrada = request.get_json()
    try:
        user_data = User(**json_entrada)
        user_data.dict()
        sqs = boto3.client('sqs',
                           region_name='us-west-2',
                           aws_access_key_id=AWS_ACCESS_KEY_ID,
                           aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
        mensaje = user_data.dict()
        queue_url = 'https://sqs.us-west-2.amazonaws.com/344488016360/users'
        message_url = json.dumps(mensaje)
        response = sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=message_url
        )
        print("Mensaje enviado correctamente a la cola SQS.")
        print(response['MessageId'])
        return jsonify('Mensaje enviado correctamente a la cola SQS.', 201)
    except ValidationError as e:
        return jsonify('Error de validación en los datos de entrada: ' + str(e)), 400
    except Exception as e:
        return jsonify('Error interno: ' + str(e)), 500


@app.route('/get_current_user/', methods=['GET'])
@protected_route
def consultar_usuario(user):
    return jsonify(user), 200

# Endpoint para envío de mensajes
@app.route('/enviar-mensaje/<user_id>', methods=['POST'])
def enviar_mensaje(user_id):
    json = request.get_json()

    # Valida los campos
    if 'mensaje' in json:
        mensaje = json['mensaje']
    else:
        return jsonify('No hay mensaje'), 401

    return jsonify({"Status: ": 201, "SQS Response Id: ": random.randint(0, 500)})



@app.route('/api/eventos', methods=['GET'])
def consultar_eventos():
    response = requests.get(f"{URL_USERS}/eventos", headers={})
    if response.status_code != 200:
        print(response)
        return jsonify('No hay eventos'), 401
    data = response.json()
    print(data)
    return jsonify(data), 201