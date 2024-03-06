import os

import boto3
from flask import Flask, jsonify, request, json

from .models.database import database
from .models.router import Usuario

app = Flask(__name__)

API_KEY = os.getenv('API_KEY')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')


# Ruta de salud para el health check
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK'}), 200


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


# Ruta para crear usuarios
@app.route('/usuario', methods=['POST'])
def crear_usuario():
    json = request.get_json()
    usuario = Usuario(
        nombre=json['nombre'],
        email=json['email'],
        username=json['username'],
        password_hash=json['password_hash']
    )
    session = database.get_session()
    usuario_existe = session.query(Usuario).filter_by(username=json['username']).first()
    if usuario_existe is None:
        database.session.add(usuario)
        database.commit()
    return jsonify({'id': str(usuario.id)}), 201


# Ruta para enviar mensajes a la cola
@app.route('/enviar-a-cola', methods=['POST'])
def enviar_mensajes():
    sqs = boto3.client('sqs',
                       region_name='us-west-2',
                       aws_access_key_id=AWS_ACCESS_KEY_ID,
                       aws_secret_access_key=AWS_SECRET_ACCESS_KEY)

    mensaje = {
        "username": "usuario2",
        "password": "contrasena"
    }

    queue_url = 'https://sqs.us-west-2.amazonaws.com/344488016360/users'
    message_url = json.dumps(mensaje)

    response = sqs.send_message(
        QueueUrl=queue_url,
        MessageBody=message_url
    )

    print("Mensaje enviado correctamente a la cola SQS.")
    print(response['MessageId'])


if __name__ == '__main__':
    app.run(debug=True)
