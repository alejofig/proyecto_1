import os
import random

import boto3
import requests
from flask import Flask, jsonify, request, json

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


# Endpoint para registro de usuarios
@app.route('/registrar-usuario', methods=['POST'])
def registrar_usuario():
    # Obtiene los datos de registro
    json_entrada = request.get_json()

    # Valida los campos
    if 'nombre' in json_entrada:
        nombre = json_entrada['nombre']
    else:
        return jsonify('Hay campos incompletos en la solicitud'), 401

    if 'email' in json_entrada:
        email = json_entrada['email']
    else:
        return jsonify('Hay campos incompletos en la solicitud'), 401

    if 'username' in json_entrada:
        username = json_entrada['username']
    else:
        return jsonify('Hay campos incompletos en la solicitud'), 401

    if 'password_hash' in json_entrada:
        password = json_entrada['password_hash']
    else:
        return jsonify('Hay campos incompletos en la solicitud'), 401

    # Configura el cliente
    sqs = boto3.client('sqs',
                       region_name='us-west-2',
                       aws_access_key_id=AWS_ACCESS_KEY_ID,
                       aws_secret_access_key=AWS_SECRET_ACCESS_KEY)

    # Arma el mensaje
    mensaje = {
        "username": username,
        "password": password
    }

    # Configura la cola
    queue_url = 'https://sqs.us-west-2.amazonaws.com/344488016360/users'
    message_url = json.dumps(mensaje)

    # Envía el mensaje a la cola
    response = sqs.send_message(
        QueueUrl=queue_url,
        MessageBody=message_url
    )

    print("Mensaje enviado correctamente a la cola SQS.")
    print(response['MessageId'])

    return jsonify('Mensaje enviado correctamente a la cola SQS.', 201)


# Endpoint para consulta de usuarios
@app.route('/consultar-usuario/<id_usuario>', methods=['GET'])
def consultar_usuario(id_usuario):
    response = requests.get(f"{URL_USERS}/usuarios", headers={})
    data = response.json()
    print(data)
    for user in data:
        if str(user['id']) == str(id_usuario):
            return jsonify({"El username del usuario es: ": user['username']}), 201
    return jsonify('El usuario no existe'), 401


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
