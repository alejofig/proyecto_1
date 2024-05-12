import csv
import time
import asyncio
import aiohttp
import random
import string
from datetime import datetime
# Archivo donde se guardarán las respuestas
ARCHIVO_CSV = 'entrenamientos.csv'

# Número máximo de solicitudes simultáneas
MAX_CONCURRENT_REQUESTS = 1

# Número de solicitudes a enviar
NUM_SOLICITUDES = 1

# URL base para los servicios
URL_BASE_ENTRENAMIENTOS = 'https://apigateway.uniandes-sports.com/'

# Función para escribir datos en el archivo CSV
def escribir_en_csv(data):
    with open(ARCHIVO_CSV, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(data)


async def crear_entrenamiento(session, semaforo):
    async with semaforo:
        # Usar datetime para obtener la hora en formato ISO 8601 con zona horaria UTC
        hora_solicitud = datetime.utcnow().isoformat() + 'Z'
        try:
            # Datos para crear un entrenamiento
            fecha_actual = datetime.now()  # Asegura que la fecha en el payload también sea precisa
            data = {
                "user_id": 1335,
                "sport_type": "Ride",
                "fecha": fecha_actual.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + 'Z',
                "calories_active": 100,
                "total_calories": 100,
                "duration": 3600,
                "distance":1000
            }

            # Enviar los datos para crear el entrenamiento
            headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGT0wxY0ZTZ1FXNU5kV0EtWGtwUCJ9.eyJpc3MiOiJodHRwczovL2Rldi1zOHF3bm5ndXdjdXBxZzJvLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NjI5YjhmNGZjNDM2N2E3MzIxNzY4NDgiLCJhdWQiOlsiaHR0cHM6Ly9zcG9ydGFwcC5jb20iLCJodHRwczovL2Rldi1zOHF3bm5ndXdjdXBxZzJvLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MTU0NzYwMjgsImV4cCI6MTcxNTU2MjQyOCwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF6cCI6IlFuM204RnVMSVhLUUExZ0xmTkplUWY2YXpBTVlXS2pBIiwicGVybWlzc2lvbnMiOltdfQ.xynPLqKS1vmiqcBZ7Wkqy0AvzdUaYN-J6lJYqMFU4kaVMC4rFMcOXzKIegQJznrRQZ4QPdqJEE1ZprfNt_OuoGO0GIsvRZc8NqpUvcAY74g7m0FniPmeu73Jm2hkTM6UFXTDRL6tX1-v-aNll6G3K2YnZvSLVIti7wUSZF1F0XyfxPwwozxDNBlSW84rA7KZZ_MmwAtPGb8v1KNc8KFYXD7_55vllBGASAB5EsmSA7zT_6OEcdVFsL-5Q9bh9AkdLNzz-vPTup-ZDMmrqaMP_s-_IIDfD-PUzRpBX3rSafgNeDJQgPU0VGebgr7tHypMnpUPShMLeuTmG7aJCs-U5A'
            }
            entrenamiento_response = await session.post(f"{URL_BASE_ENTRENAMIENTOS}crear_entrenamiento/",
                                                        json=data,
                                                        headers=headers)

            # Obtener la hora de respuesta tan pronto como la respuesta es recibida
            hora_respuesta = datetime.utcnow().isoformat() + 'Z'
            respuesta = await entrenamiento_response.text()
        except Exception as e:
            respuesta = str(e)

        # Escribir los datos de la respuesta en el archivo CSV
        data_csv = [hora_solicitud, hora_respuesta, respuesta]
        escribir_en_csv(data_csv)
# Función principal asíncrona
async def main():
    headers = ['Hora de Solicitud', 'Hora de Respuesta', 'Respuesta del Endpoint']
    escribir_en_csv(headers)

    # Crear un semáforo para limitar las solicitudes simultáneas
    semaforo = asyncio.Semaphore(MAX_CONCURRENT_REQUESTS)

    async with aiohttp.ClientSession() as session:
        tasks = []
        for _ in range(NUM_SOLICITUDES):
            
            tasks.append(crear_entrenamiento(session, semaforo))
        
        await asyncio.gather(*tasks)

# Ejecutar la función principal
if __name__ == '__main__':
    asyncio.run(main())
