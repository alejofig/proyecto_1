import os

import boto3
from flask import Flask, jsonify, request, json
from flask_cors import CORS
from pydantic import ValidationError

from models import User, Plan
from utils import protected_route
from ..planes.app import database

URL_USERS = os.getenv('USERS_PATH')
URL_EVENTS = os.getenv('EVENTS_PATH')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')

app = Flask(__name__)
CORS(app)
cors = CORS(app, resource={
    r"/*": {
        "origins": "*"
    }
})
if __name__ == '__main__':
    app.run(debug=True)


# Endpoint para validar la salud del servicio
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK'}), 200


@app.route('/registrar_usuario', methods=['POST'])
def registrar_usuario():
    json_entrada = request.get_json()
    try:
        user_data = User(**json_entrada)
        user_data.dict()
        sqs = boto3.client('sqs', region_name='us-east-1')
        mensaje = user_data.dict()
        queue_url = os.getenv('SQS_URL')
        # queue_url = 'https://sqs.us-west-2.amazonaws.com/344488016360/users'
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


@app.route('/generarPlanEntrenamiento', methods=['POST'])
def generarPlanEntrenamiento():
    json_data = request.get_json()
    print(json_data)
    planes_data = Plan(**json_data)
    print(planes_data)

    deporte = json_data.get('deporte')
    nombre = json_data.get('nombre')
    usuario = json_data.get('usuario')
    cantidadEntrenamientos = json_data.get('cantidadEntrenamientos')
    distanciaPorEntrenamientos = json_data.get('distanciaPorEntrenamientos')
    fechas = json_data.get('fechas')

    database.create_plan(planes_data)
    return jsonify({'mensaje': 'Plan creado'}), 201

# @app.route('/api/eventos', methods=['GET'])
# def consultar_eventos():

#     obtener_usuario = requests.get(f"{URL_USERS}/usuarios/1", headers={})
#     print(obtener_usuario.json())

#     response = requests.get(f"{URL_EVENTS}/eventos", headers={})
#     if response.status_code != 200:
#         print(response)
#         return jsonify('No hay eventos'), 401
#     data = response.json()
#     print(data)
#     return jsonify(data), 201
