import os
from http.client import HTTPException
from urllib.parse import unquote, urlencode
import logging
import boto3
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request, json,redirect,abort, session,url_for
from flask_cors import CORS
from pydantic import ValidationError
import config
from models import Mototaller, User, Plan, Alimentacion, Entrenador, Entrenamiento
from utils import protected_route, protected_route_movil, send_email, calcular_ftp, calcular_vo2max

load_dotenv()
URL_USERS = os.getenv('USERS_PATH','http://localhost:3001')
URL_EVENTS = os.getenv('EVENTS_PATH')
URL_PLANES = os.getenv('PLANES_PATH')
URL_ENTRENAMIENTOS = os.getenv('ENTRENAMIENTOS_PATH')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
URL_SERVICIOS = os.getenv('SERVICIOS_PATH')

app = Flask(__name__)
app.secret_key = 'super secret'
CORS(app)
cors = CORS(app, resource={
    r"/*": {
        "origins": "*"
    }
})
if __name__ == '__main__':
    app.run(debug=True)

logging.basicConfig(level=logging.DEBUG)

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

@app.route('/get_complete_user_movil/', methods=['GET'])
@protected_route_movil
def consultar_usuario_completo_movil(user):
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
        "distanciaPorEntrenamientos": body_data.get('distanciaPorEntrenamientos', ''),
        "fechas": body_data.get('fechas', ''),
    }

    response = requests.post(f"{URL_PLANES}/plan", headers={}, json=plan_data)

    if response.status_code != 200:
        print(response)
        return jsonify('Error Generando Plan'), 401

    return jsonify(response.json()), 201


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
def crear_servicio_mototaller(user):
    try:
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
        send_email(asunto="Solicitud de servicio de mototaller",
                   cuerpo="Su solicitud se ha creado con éxito y estaremos procesandola",
                   remitente="alejofig@hotmail.com",
                   destinatario=usuario_completo.json()["email"])
        return jsonify({"message": "Servicio creado con éxito"}), 201
    except ValidationError as e:
        return jsonify('Error de validación en los datos de entrada: ' + str(e)), 400
    except Exception as e:
        return jsonify('Error interno: ' + str(e)), 500


@app.route('/solicitar_alimentacion/', methods=['POST'])
@protected_route
def solicitar_alimentacion(user):
    try:
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

        return jsonify({"message": "Servicio creado con éxito"}), 201
    except ValidationError as e:
        return jsonify('Error de validación en los datos de entrada: ' + str(e)), 400
    except Exception as e:
        return jsonify('Error interno: ' + str(e)), 500


@app.route('/solicitar_sesion_entrenador/', methods=['POST'])
@protected_route
def solicitar_sesion_entrenador(user):
    try:
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

        return jsonify({"message": "Servicio creado con éxito"}), 201
    except ValidationError as e:
        return jsonify('Error de validación en los datos de entrada: ' + str(e)), 400
    except Exception as e:
        return jsonify('Error interno: ' + str(e)), 500


@app.route('/sesiones_entrenador', methods=['GET'])
@protected_route
def consultar_sesiones_entrenador(user):
    user_dict = user
    email = user_dict.get('email', 'No email provided')
    user_data = requests.get(f"{URL_USERS}/user/{email}", headers={}).json()
    userid = user_data.get('id', 'na')

    response = requests.get(f"{URL_SERVICIOS}/sesiones_entrenador/{userid}", headers={})
    if response.status_code != 200:
        print(response)
        return jsonify('Error consultado sesiones con entrenador'), 401
    data = response.json()

    return jsonify(data), 201


@app.route('/calcular-indicadores2/', methods=['POST'])
@protected_route_movil
def calcular_indicadores2(user):
    user_dict = user
    email = user_dict.get('email', 'No email provided')
    user_data = requests.get(f"{URL_USERS}/user/{email}", headers={}).json()
    
    try:
        # Extracción de datos necesarios del usuario
        altura = user_data.get('altura', 0)
        genero = user_data.get('genero', 'na')
        edad = user_data.get('edad', 0)

        entrenamiento = Entrenamiento (
            duration = request.get_json('duration', '00:00:00'),
            fcm = request.json.get('fcm', 0),
            height = altura,
            edad = edad,
            genero = genero
        )

        # Cálculo de indicadores
        ftp = calcular_ftp(entrenamiento)
        vo2max = calcular_vo2max(entrenamiento)

        return jsonify({"ftp": ftp, "vo2Max": vo2max}), 200
    except Exception as e:
        return jsonify('Error interno: ' + str(e)), 500
    
    
@app.route('/calcular-indicadores/', methods=['POST'])
@protected_route_movil
def calcular_indicadores(user):

    event_data = request.get_json()
    medidor_data = Entrenamiento(**event_data)
    try:
        print("{{medidor_data}} ", medidor_data)
        ftp = calcular_ftp(medidor_data)
        vo2max = calcular_vo2max(medidor_data)
        print("{{FTP}}{{vo2max}} ", ftp, vo2max)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"ftp": ftp, "vo2Max": vo2max}



@app.route("/login_strava")
def login():
    user_email = request.args.get('email')
    try:
        usuario_completo = requests.get(f"{URL_USERS}/user/{str(user_email)}", headers={})
        session['user_id'] = usuario_completo.json()["id"]
        query_params = {
            "client_id": config.STRAVA_CLIENT_ID,
            "response_type": "code",
            "redirect_uri": config.STRAVA_REDIRECT_URI,
            "scope": "read,activity:write,activity:read_all",
            "approval_prompt": "force",
            "state": session['user_id']
        }
        AUTH_URL = "https://www.strava.com/oauth/authorize"
        url = f"{AUTH_URL}?{urlencode(query_params)}"
        return redirect((url))
    except Exception as e:
        return jsonify('Error interno: ' + str(e)), 500

@app.route("/strava_callback")
def token():
    code = request.args.get('code')
    user_id = request.args.get('state')
    if not code:
        abort(400, description="No code provided")

    data = {
        "client_id": config.STRAVA_CLIENT_ID,
        "client_secret": config.STRAVA_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code"
    }
    TOKEN_URL = "https://www.strava.com/oauth/token"
    response = requests.post(TOKEN_URL, data=data)
    if response.status_code != 200:
        abort(400, description="Invalid token response")
    token = response.json()
    token["user_id"]= user_id
    response = requests.post(f"{URL_USERS}/token_strava", json=token)
    return redirect(config.FRONT_URL+"/dashboard" )