import os

import boto3
from flask import Flask, jsonify, request, json

from .models.database import database
from .models.router import Usuario

app = Flask(__name__)

API_KEY = os.getenv('API_KEY')


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
@app.route('/enviar', methods=['POST'])
def enviar_mensajes():
    # ----opcion1
    sqs1 = boto3.resource('sqs',
                          region_name="us-west-2",
                          aws_access_key_id='AKIAVANIV7HUBVMFSFGB',
                          aws_secret_access_key='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')
    queue1 = sqs1.get_queue_by_name(QueueName='users')

    mensaje = {'nombre': 'Alejo'}

    data = json.dumps(mensaje)
    queue1.send_message(MessageBody=data)

    # ----opcion2
    sqs2 = boto3.client('sqs',
                        region_name="us-west-2",
                        aws_access_key_id='AKIAVANIV7HUBVMFSFGB',
                        aws_secret_access_key='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')
    queue = sqs2.get_queue_url('users', '344488016360')
    print(queue.url)

    # ----opcion3
    session = boto3.Session(
        region_name="us-west-2",
        aws_access_key_id='AKIAVANIV7HUBVMFSFGB',
        aws_secret_access_key='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'
    )
    sqs3 = session.resource('sqs')

    # queue = sqs.get_queue_by_name(QueueName='users')
    queue3 = sqs3.get_queue_url('users', '344488016360')
    print(queue3.url)

    queue3.send_message(
        MessageBody='Mensaje a la cola',
        MessageAttributes={
            'username': {
                'StringValue': 'alejo',
                'DataType': 'String',
            },
            'password': {
                'StringValue': 'mipass',
                'DataType': 'String'
            }
        }
    )

    # ----opcion4
    sqs4 = boto3.client('sqs',
                        region_name="us-west-2",
                        aws_access_key_id='AKIAVANIV7HUBVMFSFGB',
                        aws_secret_access_key='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')

    # queue_url = 'https://sqs.us-west-2.amazonaws.com/344488016360/users'
    # queue = sqs.get_queue_by_name(QueueName='users')
    queue4 = sqs4.get_queue_url('https://sqs.us-west-2.amazonaws.com/344488016360/users')
    print(queue4.url)

    response = queue4.send_message(
        # QueueUrl=queue_url,
        MessageBody='Mensaje a la cola',
        MessageAttributes={
            'username': {
                'StringValue': 'alejo',
                'DataType': 'String',
            },
            'password': {
                'StringValue': 'mipass',
                'DataType': 'String'
            }
        }
    )
    print(response['MessageId'])


if __name__ == '__main__':
    app.run(debug=True)
