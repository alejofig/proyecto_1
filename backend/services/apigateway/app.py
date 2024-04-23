<<<<<<< HEAD
import os

import requests
from auth import Auth0
import boto3
from flask import Flask, jsonify, request, json
from flask_cors import CORS
from pydantic import ValidationError
from urllib.parse import unquote

from models import User, Plan
from utils import protected_route, protected_route_movil
import config
from dotenv import load_dotenv
load_dotenv()
URL_USERS = os.getenv('USERS_PATH')
URL_EVENTS = os.getenv('EVENTS_PATH')
URL_PLANES = os.getenv('PLANES_PATH')
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

@app.route("/login/")
def login_page():
    login_url = f'https://{config.AUTH0_DOMAIN}/authorize' \
                f'?audience=https://{config.AUTH0_DOMAIN}/api/v2/' \
                '&response_type=code' \
                f'&client_id={config.AUTH0_CLIENT_ID}' \
                f'&redirect_uri={config.REDIRECT_URI}'
    return f'<a href="{login_url}">Log in with Auth0</a>'

@app.route("/callback/")
def callback():
    code = request.args.get('code')
    try:
        token = Auth0.exchange_code_for_token(code)
        return {"token": token}
    except Exception as e:
        return str(e), 500

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


@app.route('/get_complete_user/', methods=['GET'])
@protected_route
def consultar_usuario_completo(user):
    user_email = unquote(user["email"])
    usuario_completo = requests.get(f"{URL_USERS}/user/{str(user_email)}", headers={})
    return jsonify(usuario_completo.json()), 200

@app.route('/get_current_user_movil/', methods=['GET'])
@protected_route_movil
def consultar_usuario_movil(user):
    return jsonify(user), 200


@app.route('/api/movil/eventos', methods=['GET'])
@protected_route_movil
def consultar_eventos_movil(user): 
     user_dict = user
     email = user_dict.get('email', 'No email provided')
     user_data = requests.get(f"{URL_USERS}/user/{email}", headers={}).json()
     pais = user_data.get('pais_residencia', 'na')
     cantidad_datos = 100
     response = requests.get(f"{URL_EVENTS}/eventos/{pais}/{cantidad_datos}", headers={})
     if response.status_code != 200:
         print(response)
         return jsonify('No hay eventos'), 401
     data = response.json()

     return jsonify(data), 201

@app.route('/api/web/eventos', methods=['GET'])
@protected_route
def consultar_eventos(user): 
     user_dict = user
     email = user_dict.get('email', 'No email provided')
     user_data = requests.get(f"{URL_USERS}/user/{email}", headers={}).json()
     pais = user_data.get('pais_residencia', 'na')
     cantidad_datos = 1000
     response = requests.get(f"{URL_EVENTS}/eventos/{pais}/{cantidad_datos}", headers={})
     if response.status_code != 200:
         print(response)
         return jsonify('No hay eventos'), 401
     data = response.json()
     data = {"user": user_data, 
             "eventos": data}

     return jsonify(data), 201

@app.route('/api/movil/plan', methods=['GET'])
@protected_route_movil
def consultar_planes_movil(user): 
     user_dict = user
     email = user_dict.get('email', 'No email provided')
     response = requests.get(f"{URL_PLANES}/planes/{email}", headers={})
     if response.status_code != 200:
         print(response)
         return jsonify('Error Consultando planes'), 401
     data = response.json()

     return jsonify(data), 201

@app.route('/api/web/plan', methods=['GET'])
@protected_route
def consultar_planes(user): 
     user_dict = user
     email = user_dict.get('email', 'No email provided')
     response = requests.get(f"{URL_PLANES}/planes/{email}", headers={})
     if response.status_code != 200:
         print(response)
         return jsonify('Error Consultado planes'), 401
     data = response.json()

     return jsonify(data), 201


@app.route('/api/web/plan', methods=['POST'])
@protected_route
def generar_plan_entrenamiento(user): 
     user_dict = user
     email = user_dict.get('email', 'No email provided')
     # Obtener datos del cuerpo de la solicitud
     body_data = request.json

     plan_data = {
            "deporte": body_data.get('deporte', ''),
            "nombre": body_data.get('nombre', ''),
            "usuario": email,
            "cantidadEntrenamientos": body_data.get('cantidadEntrenamientos', ''),
            "distanciaPorEntrenamientos":  body_data.get('distanciaPorEntrenamientos', ''),
            "fechas": body_data.get('fechas', ''),
            }

     response = requests.post(f"{URL_PLANES}/plan", headers={}, json=plan_data)

     if response.status_code != 200:
         print(response)
         return jsonify('Error Generando Plan'), 401

     return jsonify(response.json()), 201

@app.route('/generarPlanEntrenamiento', methods=['POST'])
def generarPlanEntrenamiento():
    json_data = request.get_json()
    print(json_data)
    planes_data = Plan(**json_data)
    print(planes_data)
    return jsonify({'mensaje': 'Plan creado'}), 201

# @app.route('/api/eventos', methods=['GET'])
# def consultar_eventos():
#     obtener_usuario = requests.get(f"{URL_USERS}/usuarios/1", headers={})
#     print(obtener_usuario.json())
#
#     response = requests.get(f"{URL_EVENTS}/eventos", headers={})
#     if response.status_code != 200:
#         print(response)
#         return jsonify('No hay eventos'), 401
#     data = response.json()
#     print(data)
#     return jsonify(data), 201
=======
import os

import requests
from auth import Auth0
import boto3
from flask import Flask, jsonify, request, json
from flask_cors import CORS
from pydantic import ValidationError
from urllib.parse import unquote

from models import User, Plan
from utils import protected_route
import config
from dotenv import load_dotenv
load_dotenv()
URL_USERS = os.getenv('USERS_PATH')
URL_EVENTS = os.getenv('EVENTS_PATH')
URL_ENTRENAMIENTOS = os.getenv('ENTRENAMIENTOS_PATH')
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
     #obtener_usuario = requests.get(f"{URL_USERS}/usuarios/1", headers={})
     #print(obtener_usuario.json())
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
>>>>>>> origin/develop
