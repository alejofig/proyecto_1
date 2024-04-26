from app.database import crear_servicio_alimentacion, solicitar_sesion_entrenador
from app.models import Alimentacion, Entrenador

from create_alimentacion import generate_random_alimentacion
from create_sesion_entrenador import generate_random_sesion_entrenador


def test_crear_servicio_alimentacion():
    alimentacion = Alimentacion(**generate_random_alimentacion())
    created_alimentacion = crear_servicio_alimentacion(alimentacion)


def test_create_sesion_entrenador():
    entrenador = Entrenador(**generate_random_sesion_entrenador())
    created_entrenador = solicitar_sesion_entrenador(entrenador)
