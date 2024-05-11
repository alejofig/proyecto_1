import csv
import time
import asyncio
import aiohttp
import random
import string

def escribir_en_csv(data):
    with open('solicitudes.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(data)

async def generar_email():
    letras = string.ascii_lowercase
    nombre = ''.join(random.choice(letras) for i in range(8))  # Genera un nombre aleatorio de 8 caracteres
    dominio = random.choice(['gmail.com', 'yahoo.com', 'outlook.com'])  # Elije aleatoriamente un dominio
    return f"{nombre}@{dominio}"

async def enviar_solicitud(session, data, email):
    hora_solicitud = time.asctime(time.gmtime())

    async with session.post('https://apigateway.uniandes-sports.com/registrar_usuario', json=data) as response:
        hora_respuesta = time.asctime(time.gmtime())
        respuesta = await response.json()

        data_csv = [hora_solicitud, hora_respuesta, respuesta, email]
        escribir_en_csv(data_csv)

async def main():
    headers = ['Hora de Solicitud', 'Hora de Respuesta', 'Respuesta del Endpoint', 'Email']
    escribir_en_csv(headers)

    async with aiohttp.ClientSession() as session:
        tasks = []
        for _ in range(1):
            email = await generar_email()
            data = {
                "password": "135.Simetrik24#",
                "nombre": "a",
                "apellido": "a",
                "username": email,
                "tipo_documentacion": "PASAPORTE",
                "numero_identificacion": "1",
                "email": email,
                "edad": 12,
                "peso": 1,
                "altura": 1,
                "genero": "Masculino",
                "pais_nacimiento": "c",
                "ciudad_nacimiento": "c",
                "pais_residencia": "c",
                "ciudad_residencia": "c",
                "antiguedad_residencia": 12,
                "tipo_plan": "GRATUITO",
                "deportes": ["Natación"]
            }
            tasks.append(enviar_solicitud(session, data, email))
        
        await asyncio.gather(*tasks)

if __name__ == '__main__':
    asyncio.run(main())
