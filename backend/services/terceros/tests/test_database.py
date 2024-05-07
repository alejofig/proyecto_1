from app.database import solicitar_servicio_alimentacion, solicitar_servicio_entrenador
from app.models import Alimentacion, Entrenador

from tests.create_alimentacion import generate_random_alimentacion
from tests.create_sesion_entrenador import generate_random_sesion_entrenador


def test_create_alimentacion():
    alimentacion = Alimentacion(**generate_random_alimentacion())
    created_alimentacion = solicitar_servicio_alimentacion(alimentacion)


def test_create_sesion_entrenador():
    entrenador = Entrenador(**generate_random_sesion_entrenador())
    created_entrenador = solicitar_servicio_entrenador(entrenador)
