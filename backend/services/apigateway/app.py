import os
from urllib.parse import unquote

import boto3
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request, json
from flask_cors import CORS
from pydantic import ValidationError

from models import Mototaller, User, Plan, Alimentacion, Entrenador
from utils import protected_route

load_dotenv()
URL_USERS = os.getenv('USERS_PATH')
URL_EVENTS = os.getenv('EVENTS_PATH')
URL_ENTRENAMIENTOS = os.getenv('ENTRENAMIENTOS_PATH')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
URL_SERVICIOS = os.getenv('SERVICIOS_PATH')

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
        message_url = json.dumps(mensaje)
        response = sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=message_url
        )
        return jsonify('Mensaje enviado correctamente a la cola SQS.', 201)
    except ValidationError as e:
        return jsonify('Error de validación en los datos de entrada: ' + str(e)), 400
    except Exception as e:
        return jsonify('Error interno: ' + str(e)), 500


@app.route('/get_current_user/', methods=['GET'])
@protected_route
def consultar_usuario(user):
    return jsonify(user), 200


@app.route('/get_complete_user/', methods=['GET'])
@protected_route
def consultar_usuario_completo(user):
    user_email = unquote(user["email"])
    usuario_completo = requests.get(f"{URL_USERS}/user/{str(user_email)}", headers={})
    return jsonify(usuario_completo.json()), 200


@app.route('/api/eventos', methods=['GET'])
def consultar_eventos():
    # obtener_usuario = requests.get(f"{URL_USERS}/usuarios/1", headers={})
    # print(obtener_usuario.json())
    response = requests.get(f"{URL_EVENTS}/eventos", headers={})
    if response.status_code != 200:
        return jsonify('No hay eventos'), 401
    data = response.json()
    return jsonify(data), 201


@app.route('/obtener_estadisticas/', methods=['GET'])
@protected_route
def consultar_estadisticas(user):
    user_email = unquote(user["email"])
    usuario_completo = requests.get(f"{URL_USERS}/user/{str(user_email)}", headers={})
    estadisticas = requests.get(f"{URL_ENTRENAMIENTOS}/estadisticas/{usuario_completo.json()['id']}", headers={})
    return jsonify(estadisticas.json()), 200


@app.route('/generarPlanEntrenamiento', methods=['POST'])
def generarPlanEntrenamiento():
    json_data = request.get_json()
    planes_data = Plan(**json_data)
    return jsonify({'mensaje': 'Plan creado'}), 201


@app.route('/crear_servicio_mototaller/', methods=['POST'])
@protected_route
def consultar_estadisticas(user):
    json_data = request.get_json()
    mototaller = Mototaller(**json_data)

    user_email = unquote(user["email"])
    usuario_completo = requests.get(f"{URL_USERS}/user/{str(user_email)}", headers={})

    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }

    payload = mototaller.dict()
    payload["userId"] = usuario_completo.json()["id"]
    response = requests.post(f"{URL_SERVICIOS}/solicitar_mototaller/",
                             json=payload,
                             headers=headers)
    return jsonify(response), 200


@app.route('/solicitar_alimentacion', methods=['POST'])
@protected_route
def solicitar_alimentacion(user):
    json_data = request.get_json()
    alimentacion = Alimentacion(**json_data)

    user_email = unquote(user["email"])
    usuario_completo = requests.get(f"{URL_USERS}/user/{str(user_email)}", headers={})

    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }

    payload = alimentacion.dict()
    payload["userId"] = usuario_completo.json()["id"]
    response = requests.post(f"{URL_SERVICIOS}/solicitar_alimentacion/",
                             json=payload,
                             headers=headers)
    return jsonify(response), 200


@app.route('/solicitar_sesion_entrenador', methods=['POST'])
@protected_route
def solicitar_sesion_entrenador(user):
    json_data = request.get_json()
    entrenador = Entrenador(**json_data)

    user_email = unquote(user["email"])
    usuario_completo = requests.get(f"{URL_USERS}/user/{str(user_email)}", headers={})

    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }

    payload = entrenador.dict()
    payload["userId"] = usuario_completo.json()["id"]
    response = requests.post(f"{URL_SERVICIOS}/solicitar_sesion_entrenador/",
                             json=payload,
                             headers=headers)
    return jsonify(response), 200
