import requests
import time
import random
import string
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv
import os
import csv
load_dotenv()

# Función para generar una contraseña aleatoria
def generate_random_password(length=8):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for _ in range(length))

# Función para generar un nombre de usuario aleatorio
def generate_random_username(length=8):
    characters = string.ascii_lowercase + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

# Definir la URL para las peticiones GET y POST
url_get = f'{os.getenv("APIGATEWAY_ENDPOINT")}consultar-usuario/1'
url_post = f'{os.getenv("APIGATEWAY_ENDPOINT")}crear_usuario'

# Función para enviar peticiones GET
def send_get_request(url, writer):
    start_time = time.time()
    response = requests.get(url)
    end_time = time.time()
    status_code = response.status_code
    writer.writerow([start_time, end_time, url, status_code])

# Función para enviar peticiones POST
def send_post_request(url, writer):
    start_time = time.time()
    headers = {'Content-Type': 'application/json'}
    payload = {'username': generate_random_username(), 'password': generate_random_password()}  # Datos de usuario y contraseña aleatorios
    response = requests.post(url, json=payload, headers=headers)
    end_time = time.time()
    status_code = response.status_code
    writer.writerow([start_time, end_time, url, status_code])

# Número de peticiones a enviar
num_requests = 10

with open('peticiones_http.csv', 'w', newline='') as csvfile:
    fieldnames = ['Hora_inicio', 'Hora_fin', 'Endpoint', 'Estado']
    writer = csv.writer(csvfile)
    writer.writerow(fieldnames)

    # Crear un ThreadPoolExecutor para enviar las peticiones en paralelo
    with ThreadPoolExecutor(max_workers=10) as executor:  # Puedes ajustar el número de trabajadores según tus necesidades
        start_time = time.time()

        # Enviar peticiones GET en paralelo
        for _ in range(num_requests):
            executor.submit(send_get_request, url_get, writer)

        # Enviar peticiones POST en paralelo
        for _ in range(num_requests):
            executor.submit(send_post_request, url_post, writer)

        end_time = time.time()

# Calcular el tiempo total de ejecución
execution_time = end_time - start_time
print(f'Tiempo total para enviar {num_requests} peticiones en paralelo: {execution_time} segundos')
