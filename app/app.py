import os

import boto3
from flask import Flask, jsonify, request, json

from .models.database import database
from .models.router import Usuario
from .errors import *

app = Flask(__name__)

API_KEY = os.getenv('API_KEY')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')


# Ruta de salud para el health check
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK'}), 200


# Validación de token
def validate_token(request):
    if 'Authorization' in request.headers:
        token = request.headers['Authorization']
        if not token.startswith('Bearer'):
            raise TokenInvalidError
    else:
        raise NoTokenError


# Ruta para obtener usuarios
@app.route('/usuarios', methods=['GET'])
def obtener_usuarios():
    session = database.get_session()
    usuarios = session.query(Usuario).all()
    users = []
    for user in usuarios:
        users.append({
            'id': user.id,
            'username': user.username
        })
    return jsonify(users)


# 1. Ruta para consulta de usuarios
@app.route('/consultar-usuarios', methods=['GET', ])
def consultar_usuarios():
    obtener_usuarios()


# 2. Ruta para registro de usuarios
@app.route('/registrar-usuario', methods=['POST', ])
def registrar_usuario():
    # Valida el token
    token = validate_token(request)
    if token is None:
        raise TokenInvalidError

    # Obtiene los datos de registro
    json = request.get_json()

    # Valida los campos
    if 'nombre' in json:
        nombre_ = json['nombre']
    else:
        raise MissingDataError

    if 'email' in json:
        email_ = json['email']
    else:
        raise MissingDataError

    if 'username' in json:
        username_ = json['username']
    else:
        raise MissingDataError

    if 'password_hash' in json:
        password_hash_ = json['password_hash']
    else:
        raise MissingDataError

    # Carga los valores
    usuario = Usuario(
        nombre=nombre_,
        email=email_,
        username=username_,
        password_hash=password_hash_
    )

    # Valida que el usuario no exista antes de crearlo
    users = obtener_usuarios().get_json()
    for user in users:
        if user.username == 'username':
            raise UserDoesExist
        else:
            enviar_notificaciones(usuario.username, usuario.password_hash)


# 3. Ruta para enviar notificaciones a la cola
@app.route('/enviar-notificacion/<username>&<password>', methods=['POST'])
def enviar_notificaciones(username, password):
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

    # Consulta el registro creado
    users = obtener_usuarios().get_json()
    for user in users:
        if user.username == 'username':
            return respuesta_usuario(user.id)


# 4. Ruta para respuesta al usuario
@app.route('/respuesta_usuario', methods=['GET,'])
def respuesta_usuario(id):
    if id is not None:
        return jsonify('El usuario fue creado exitosamente', 201)


if __name__ == '__main__':
    app.run(debug=True)
