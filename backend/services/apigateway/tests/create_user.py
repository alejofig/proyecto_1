import random
import string

def generate_random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(length))

def generate_random_user():
    username = generate_random_string(5)
    email = f"{generate_random_string(5)}@example.com"
    password = "135.Uniandes24@"
    tipo_documentacion = "PASAPORTE",
    numero_identificacion = "1",
    edad = 1,
    peso = 1,
    altura = 1,
    genero = "Masculino",
    pais_nacimiento = "c",
    ciudad_nacimiento = "c",
    pais_residencia = "c",
    ciudad_residencia = "c",
    antiguedad_residencia = 12,
    tipo_plan = "GRATUITO",
    deportes = ["Natación"]

    user_data = {
       "username": username,
       "email": email,
       "password": password,
        "tipo_documentacion": tipo_documentacion,
        "numero_identificacion": numero_identificacion,
        "edad": edad,
        "peso": peso,
        "altura": altura,
        "genero": genero,
        "pais_nacimiento": pais_nacimiento,
        "ciudad_nacimiento": ciudad_nacimiento,
        "pais_residencia": pais_residencia,
        "ciudad_residencia": ciudad_residencia,
        "antiguedad_residencia": antiguedad_residencia,
        "tipo_plan": tipo_plan,
        "deportes": deportes
    }

    return user_data