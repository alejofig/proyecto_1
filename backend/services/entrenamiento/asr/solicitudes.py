import csv
import time
import asyncio
import aiohttp
import random
import string

# Archivo donde se guardarán las respuestas
ARCHIVO_CSV = 'entrenamientos.csv'

# Número máximo de solicitudes simultáneas
MAX_CONCURRENT_REQUESTS = 1

# Número de solicitudes a enviar
NUM_SOLICITUDES = 20

# URL base para los servicios
URL_BASE_ENTRENAMIENTOS = 'https://apigateway.uniandes-sports.com/'

# Función para escribir datos en el archivo CSV
def escribir_en_csv(data):
    with open(ARCHIVO_CSV, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(data)


async def crear_entrenamiento(session, semaforo):
    async with semaforo: 
        hora_solicitud = time.asctime(time.gmtime())
        try:

            # Datos para crear un entrenamiento
            data = {
                "user_id":1335,
                "sport_type":"Run",
                "fecha":"2024-05-11T18:56:36.105251",
                "calories_active":100,
                "total_calories":100,
                "duration": 60
            }

            # Enviar los datos para crear el entrenamiento
            headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImVGT0wxY0ZTZ1FXNU5kV0EtWGtwUCJ9.eyJpc3MiOiJodHRwczovL2Rldi1zOHF3bm5ndXdjdXBxZzJvLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NjI5YjhmNGZjNDM2N2E3MzIxNzY4NDgiLCJhdWQiOlsiaHR0cHM6Ly9zcG9ydGFwcC5jb20iLCJodHRwczovL2Rldi1zOHF3bm5ndXdjdXBxZzJvLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MTU0NzIwNTUsImV4cCI6MTcxNTU1ODQ1NSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF6cCI6IlFuM204RnVMSVhLUUExZ0xmTkplUWY2YXpBTVlXS2pBIiwicGVybWlzc2lvbnMiOltdfQ.Z1oL8l1BNoif-ebuhM_N6pjwx98UF2LjSGOZ4IW9NgUpVqIrXcqGk4bI-5iS4yd7kAdcMj8WGBebOHW0uOG1My9QMymlyIwWihy7XIrecWqH580iC-ZSsGKSpGDVurHKRAFpuvR3PzY0ogH4EPmUE9W-O6oxcbTauQ0ABoo9azopWhrcsMRqBdQsdiSnRX5MV311HAa7tC5rNAn3n-di3Af1nsLoM5EYMr45LQtBPzarmlwBM0ai3znklsI4lqm7QkaW5tQEhzeHXXgxqHHAo1G6SNSWMYd7gZGIx2jE4xcb2ZJDsL0c4b0bSNPzXjnEBWh0ZPFZwITQhPvLIlaxKQ'
            }
            entrenamiento_response = await session.post(f"{URL_BASE_ENTRENAMIENTOS}crear_entrenamiento/",
                                                        json=data,
                                                        headers=headers)

            hora_respuesta = time.asctime(time.gmtime())
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
